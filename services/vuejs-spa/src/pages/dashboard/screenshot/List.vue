<template>
  <div class="screenshots-list">
    <h2>Screenshots List</h2>

    <div class="spinner-holder" v-if="loading">
      <md-progress-spinner class=""
                           :md-stroke="3"
                           :md-diameter="30"
                           md-mode="indeterminate"
      ></md-progress-spinner>
    </div>
    <div v-else>
      <div v-if="!screenshots.length">
        <p>No screenshots have been created yet.</p>
      </div>
      <div v-else>

<!--        TEST NEW COMPONENT -->
        <md-list class="md-triple-line" :md-expand-single="true">
          <md-list-item md-expand v-for="(item) in screenshots"
                        :key="item._id"
                        v-bind:item="item"
                        :class="{
                          'error-status': isScreenshotError(item),
                          'inProgress-status': isScreenshotInProgress(item),
                        }"
          >

            <md-icon>{{
              isScreenshotError(item)
              ? 'error'
              : item.options.fullPage
              ? 'photo_album'
              : 'panorama'}}</md-icon>
            <span class="md-list-item-text">{{item.link}}</span>
            <div slot="md-expand">
              <screenshot-info-list-item class="md-layout md-gutter"
                                         v-bind:item="item"
                                         v-bind:updateScreenshotItemData="updateScreenshotItemData"
                                         v-bind:handleScreenshotRecreate="handleScreenshotRecreate"
                                         v-bind:handleScreenshotDelete="handleScreenshotDelete"
                                         v-bind:isScreenshotInProgress="isScreenshotInProgress"
                                         v-bind:isScreenshotError="isScreenshotError"
              />
            </div>

          </md-list-item>
        </md-list>
<!--        TEST NEW COMPONENT ENDS-->

<!--        <md-list class="md-triple-line" :md-expand-single="true">
          <md-list-item md-expand v-for="(item, index) in screenshots"
                        :key="item._id"
                        v-bind:item="item"
                        :class="{
                          'error-status': isScreenshotError(item),
                          'inProgress-status': isScreenshotInProgress(item),
                        }"
          >

            <md-icon>{{
              isScreenshotError(item)
                ? 'error'
                : item.options.fullPage
                  ? 'photo_album'
                  : 'panorama'}}</md-icon>
            <span class="md-list-item-text">{{item.link}}</span>
            <div slot="md-expand">
              <div class="md-layout md-gutter">
                <div class="md-layout-item md-size-30 md-small-size-100">
                  <div class="screenshot-image">
                    <div class="inProgress-holder" v-if="isScreenshotInProgress(item)">
                      <md-progress-spinner class="md-accent"
                                           :md-stroke="5"
                                           :md-diameter="80"
                                           md-mode="indeterminate"
                      ></md-progress-spinner>
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
            </div>

          </md-list-item>
&lt;!&ndash;          <md-divider class=""></md-divider>&ndash;&gt;
        </md-list>-->

      </div>
    </div>

  </div>
</template>

<script>
import { mainApi } from '@/services';

import ScreenshotInfoListItem from '@/components/ScreenshotInfoListItem';
// import { getLogger, constants } from '@/common';

export default {
  name: 'ScreenshotsList',
  data() {
    return {
      loading: true,
      screenshots: null,
    };
  },
  computed: {},
  methods: {
    async getScreenshots() {
      const data = await mainApi.screenshotsList().catch(/* TODO ADD ERRORS HANDLER */);
      data[0].task.status = 'inProgress';
      this.screenshots = data || [];
    },
    async updateScreenshotItemData(id) {
      const updatedData = await mainApi.screenshotGet(id).catch() || null;
      if (updatedData) {
        const itemIndex = this.screenshots.findIndex(item => item && item._id === id);
        this.$set(this.screenshots, itemIndex, updatedData);
      }
    },
    async handleScreenshotRecreate(id) {
      await mainApi.screenshotReCreate(id)
        .then(() => this.updateScreenshotItemData(id))
        .catch();
    },
    async handleScreenshotDelete(id) {
      await mainApi.screenshotDelete(id)
        .then(() => this.getScreenshots())
        .catch();
    },
    isScreenshotError: data => data && data.task.status === 'error',
    isScreenshotInProgress: data => data && !['done', 'error'].includes(data.task.status),
  },
  async created() {
    await this.getScreenshots();
    this.loading = false;
  },
  components: {
    ScreenshotInfoListItem,
  },
};
</script>

<style lang="scss">
  .text-right {
    text-align: right;
  }
  .text-bold {
    font-weight: bold;
  }
  .screenshots-list {
    .spinner-holder {
      padding: 10vh 10px;
      text-align: center;
    }
    .md-list.md-triple-line .md-list-item-content {
      min-height: inherit;
      padding: 5px;
    }
    .md-list .md-list-item {
      &:not(:last-child) {
        .md-list-item-expand {
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        }
      }
      .md-icon {
        color: #3e9276;
      }
      &.error-status {
        background: rgba(241, 20, 107, 0.2);
        .md-icon {
          color: darkred;
        }

        .md-active {
          background: none;
        }
      }
    }
    .md-active {
      background: rgba(32, 166, 184, 0.22);
      .md-list-item-content {
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
      }
      .md-list-expand {
        padding: 20px 5px;
      }
    }
    .md-list-item-text{
      font-size: smaller;
    }
  }
  .screenshot-image {
    padding: 2px;
    min-width: 200px;
    max-width: 400px;
    min-height: 200px;
    max-height: 300px;
    overflow: scroll;
    border: 1px solid lightskyblue;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;

    box-shadow: rgba(0, 0, 0, 0.2) 0px 1px 5px 0px,
                rgba(0, 0, 0, 0.14) 0px 2px 2px 0px,
                rgba(0, 0, 0, 0.12) 0px 3px 1px -2px;

    a:hover {
      cursor: zoom-in;
    }

    img {
      display: block;
    }
  }
  .md-table-cell, .md-table-head-label, .md-table-head-container {
    height: inherit;
    padding-top: inherit;
    padding-bottom: inherit;
  }
  .inProgress-holder {
    text-align: center;
    margin-top: 55px;
  }
</style>
