<template>
  <div>
    <div class="md-layout-item md-size-30 md-small-size-100">
      <div class="screenshot-image">
        <div class="inProgress-holder" v-if="isScreenshotInProgress(item)">
          <md-progress-spinner class="md-accent"
                               :md-stroke="5"
                               :md-diameter="80"
                               md-mode="indeterminate"
          ></md-progress-spinner>
        </div>
        <div v-else-if="isScreenshotError(item)" class="text-center">
          <md-icon>warning</md-icon>
        </div>
        <a v-else :href="getScreenshotSrc(item.storagePath)" target="_blank">
          <img :src="getScreenshotSrc(item.storagePath)"
               :alt="`Screenshot: '${item.link}'`"/>
        </a>
      </div>
    </div>
    <div class="md-layout-item md-size-55 md-small-size-100">
      <div class="screenshot-info">
        <md-table md-card>

          <md-table-row>
            <md-table-head>Property name</md-table-head>
            <md-table-head class="text-right">Value</md-table-head>
          </md-table-row>

          <md-table-row v-for="(value, name, index) in getScreenshotInfo(item)"
                        :key="index">
            <md-table-cell class="text-bold">{{name}}</md-table-cell>
            <md-table-cell v-html="value"
                           class="text-right md-table-cell-container">
            </md-table-cell>
          </md-table-row>

        </md-table>
      </div>
    </div>
    <div class="md-layout-item md-size-15 md-small-size-100">

      <div>
        <md-button class="md-raised md-primary"
                   @click="handleScreenshotRecreate(item._id)">
          <md-icon class="md-primary">cached</md-icon>
          Recreate
        </md-button>
      </div>
      <div>
        <md-button class="md-raised md-accent"
                   @click="handleScreenshotDelete(item._id)">
          <md-icon class="md-primary">delete</md-icon>
          Delete
        </md-button>
      </div>
    </div>
  </div>
</template>

<script>
import config from '@/config';

const SCREENSHOT_DONE_LISTENER_INTERVAL = 4 * 1000;

export default {
  name: 'ScreenshotInfoListItem',
  data: () => ({
    doneListenerInterval: null,
  }),
  props: [
    'item',
    'updateScreenshotItemData',
    'handleScreenshotRecreate',
    'handleScreenshotDelete',
    'isScreenshotInProgress',
    'isScreenshotError',
  ],
  methods: {
    getScreenshotSrc:
      storagePath => `${config.urls.static}${config.screenshotsBucketName}/${storagePath}?time=${Date.now()}`,
    getScreenshotInfo: (data) => {
      const { _id: id, createdAt, link, options, task } = data;
      const createdAtFormatted = new Date(createdAt).toUTCString();
      return {
        Id: id,
        Link: `<a href="${link}"
                  target="_blank"
                  rel="noopener noreferrer"
                  >${link.length > 40 ? `${link.slice(0, 40)}...` : link}</a>`,
        Status: task.status,
        FullPage: options.fullPage.toString(),
        Timeout: `${options.timeout}s`,
        CreatedAt: createdAtFormatted,
      };
    },
    setDoneListenerInterval() {
      const screenshotId = this.item._id;
      if (!screenshotId || this.doneListenerInterval) {
        return;
      }
      this.doneListenerInterval =
        setInterval(
          () => this.updateScreenshotItemData(screenshotId),
          SCREENSHOT_DONE_LISTENER_INTERVAL,
        );
    },
    deleteDoneListenerInterval() {
      if (!this.doneListenerInterval) {
        return;
      }
      clearInterval(this.doneListenerInterval);
      this.doneListenerInterval = null;
    },
  },
  created() {
    if (this.isScreenshotInProgress(this.item)) {
      return this.setDoneListenerInterval();
    }
    this.deleteDoneListenerInterval();
    return null;
  },
  updated() {
    if (this.isScreenshotInProgress(this.item)) {
      return this.setDoneListenerInterval();
    }
    this.deleteDoneListenerInterval();
    return null;
  },
  destroyed() {
    this.deleteDoneListenerInterval();
  },
};
</script>

<style lang="scss">
  .text-center {
    text-align: center;
  }
</style>
