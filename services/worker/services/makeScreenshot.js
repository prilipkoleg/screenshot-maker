'use strict';

const puppeteer = require('puppeteer');
// require('request').defaults({ rejectUnauthorized: false });
const rp = require('request-promise');
const pTimeout = require('p-timeout');

const { amqp } = require('../config');

const LIMIT_BROWSER_PAGES = amqp.queue.screenshots.prefetchCount;
const TIMEOUT_RECALL_GET_PAGE = 1 * 1000;
const TIMEOUT_PAGE_SCREENSHOT = 60 * 1000;
const defaultPageSize = {
  Width: 1920, // 1366, // 1920,
  height: 1080,
};

const puppeteerConfigs = {
  browser: {
    ignoreHTTPSErrors: true,
    //slowMo: 250,
    //dumpio: true,
    args: [
      '--no-sandbox',
      '--hide-scrollbars',
      '--disable-extensions',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage', // fixed ->  Error: WebSocket is not open: readyState 3 (CLOSED)
      // '--disable-gpu',

      '--incognito',
      '--disk-cache-size=0',
      '--media-cache-size=0',
    ],
  },

  page: { waitUntil: 'load', timeout: 60 * 1000 },

  screenshot: { type: 'png', fullPage: false },
};


const browserHandler = {
  // ------- data
  newPages: true, // open|close page for each task
  browser: {
    isLaunching: false,
    instance: null,
    pages: new Map(),
  },

  // ------- methods
  async browserLaunch() {
    if (this.browser.isLaunching) {return;}

    say('Launching browser ....');

    this.browser.isLaunching = true;
    this.browser.pages.clear();

    return puppeteer.launch(puppeteerConfigs.browser)
      .then((browser) => {
        this.browser.instance = browser;
        this.browser.isLaunching = false;
        say('🚀 Browser ready!');
        return Promise.resolve();
      });
  },

  async browserKill() {
    if (this.browser.isLaunching) {return;}
    await this.browser.instance.close();
    this.browser.pages.clear();
    this.browser.instance = null;

    return Promise.resolve();
  },

  async browserCreatePage(pageIndex) {
    // const timeLabel = `${formatPageNum(pageIndex)} create`;
    // console.time(timeLabel);
    const page = await this.browser.instance.newPage();
    // console.timeEnd(timeLabel);
    // page.on('console', msg => console.log(pageIndex + ' PAGE LOG:', msg.text()));
    // page.on('load', () => console.log(pageIndex + ' onLoad'));
    // page.on('error', (err) => console.log(pageIndex + ' error', err));
    return Promise.resolve(page);
  },

  async pageGetFree() {
    const freePage = [...this.browser.pages.entries()].find(([index, pageValue]) => !pageValue.busy);

    if (freePage) {
      const [ pageIndex, data ] = freePage;
      data.busy = true;
      if (this.newPages) {
        data.page = await this.browserCreatePage(pageIndex);
      }
      return Promise.resolve(freePage);
    }

    if (this.browser.instance === null) {
      await this.browserLaunch();
    }

    const pageIndex = this.browser.pages.size + 1;
    const ExceedingPagesLimit = pageIndex > LIMIT_BROWSER_PAGES;

    if (this.browser.isLaunching || ExceedingPagesLimit) {
      if (ExceedingPagesLimit) {
        say(`All available '📕 ${this.browser.pages.size}' pages are busy!`);
      } else {
        say('Task are waiting for the browser!');
      }

      return new Promise(resolve => setTimeout(() => resolve(this.pageGetFree()), TIMEOUT_RECALL_GET_PAGE));
    }

    const data = { busy: true };
    const setData = [pageIndex, data];

    this.browser.pages.set(...setData);
    data.page = await this.browserCreatePage(pageIndex);

    say(`Page: ${formatPageNum(pageIndex)} -> created.`);

    return Promise.resolve(setData);
  },

  async pageSetFree(pageIndex) {
    // const timeLabel = `${formatPageNum(pageIndex)} close`;
    const data = this.browser.pages.get(pageIndex);
    if (data) {
      // console.time(timeLabel);
      if (data.page && this.newPages) {
        try {
          await data.page.removeAllListeners();
          await data.page.close();
        } catch (error) { console.log('Browser error: ', error); }
        data.page = null;
      }
      data.busy = false;
      // console.timeEnd(timeLabel);
    }
    return Promise.resolve();
  },

  async pageReset(pageIndex) { // don't works as expected!
    const page = this.browser.pages.get(pageIndex);
    page.busy = true;
    try {
      await page.page.close();
    } catch (error) {console.log('Reset error', error)}
    delete page.page;
    try {
      page.page = await this.browser.instance.newPage();
    } catch (error) { console.log('New Page err:', error)}
    page.busy = false;
    return Promise.resolve();
  },
};
const makeTimeout = ms => new Promise(resolve => setTimeout(resolve, ms));

module.exports = async (url, options) => {
  const width = /*parseInt(options.width || '') ||*/ defaultPageSize.Width;
  const height = /*parseInt(options.height || '') ||*/ defaultPageSize.height;
  const { fullPage, timeout } = options;

  let pageIndex = null;

  try {
    // ----> Check url response status code
    await checkLinkHeadResponse(url);

    // ----> get Page
    const [_pageIndex, pageData] = await browserHandler.pageGetFree();
    const page = pageData.page;
    pageIndex = _pageIndex;

    // ----> set params
    await page.setViewport({ width: width, height: height });
    await page.goto(url, puppeteerConfigs.page);

    // ----> Make screenshot
    say(`⬇️ ${formatPageNum(pageIndex)} Fetching: '${url}'`);
    if (timeout) await makeTimeout(timeout * 1000);
    const screenshot = await pTimeout(
      page.screenshot(Object.assign({}, puppeteerConfigs.screenshot, {fullPage})),
      TIMEOUT_PAGE_SCREENSHOT,
      'Screenshot timed out'
    );
    say(`💥 ${formatPageNum(pageIndex)} Screenshot done: '${url}'`);

    await browserHandler.pageSetFree(pageIndex);

    // return Buffer.from(screenshot).toString('base64');
    // return Buffer.from(screenshot);
    return screenshot;
  } catch (error) {
    if (pageIndex) {
      say(`💔 ${formatPageNum(pageIndex)} Force close: '${url}'`);
      await browserHandler.pageSetFree(pageIndex);
    }

    const { message = '' } = error;

    // Handle websocket not opened error
    if (/not open/i.test(message)){
      say('🕸 Web socket failed!');
      try {
        await browserHandler.browserKill();
      } catch (err) {
        console.warn(`Chrome could not be killed ${message}`);
      }
    }

    return Promise.reject(error);
  }

  // --------- helpers
  function checkLinkHeadResponse(url) {
    return new Promise((resolve, reject) => {
      rp({
        uri: url,
        method: 'HEAD',
        simple: false,
        resolveWithFullResponse: true,
        json: false,
      })
        .then((response) => {
          const statusCode = response.statusCode;
          if(statusCode === 200 || statusCode === 404) {
            resolve();
          } else {
            reject(new Error('Invalid page'));
          }
        }).catch((err) => {
        reject(err);
      });
    });
  }

};

function formatPageNum(pageIndex) {
  return '📕' + (pageIndex < 10
    ? `0${pageIndex}`
    : pageIndex);
}
function say(message = '') {
  if (!message) return;
  console.log(message);
}
