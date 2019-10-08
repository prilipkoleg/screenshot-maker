<template>
  <div class="page-create-screenshot">
<!--    <h2>Create Screenshot</h2>-->

    <div class="md-layout md-alignment-center">
      <md-card class="md-layout-item md-size-50 md-small-size-100">

        <md-card-content>
          <md-card-header>
            <div class="md-title">Create Screenshot</div>
          </md-card-header>

          <ValidationObserver tag="form"
                              id="form-screenshot-create"
                              name="makeScreenshot"
                              class="makeScreenshot"
                              ref="makeScreenshotObserver"
                              v-slot="{ invalid }"
                              v-on:submit.prevent="onSubmit">

            <ValidationProvider name="WEB link"
                                :rules="{
                                  required: true,
                                  // eslint-disable-next-line max-len
                                  regex: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
                                }"
                                v-slot="{ errors }"
            >
              <md-field class="">
                <label for="scr-link">WEB page link</label>
                <md-input id="scr-link"
                          name="scr-link"
                          type="text"
                          v-model="form.link"
                          required
                />
              </md-field>
              <span class="md-error">{{ errors[0] }}</span>
            </ValidationProvider>


            <div class="md-layout md-gutter">
              <div class="md-layout-item md-small-size-100">
                <md-switch id="scr-fullPage"
                           class="md-primary"
                           name="scr-fullPage"
                           type="text"
                           v-model="form.options.fullPage"
                           ref="scr-fullPage"
                >Full Page</md-switch>
              </div>

              <div class="md-layout-item md-small-size-100">
                <ValidationProvider name="Width"
                                    rules="required|between:100,3000"
                                    v-slot="{ errors }">
                  <md-field class="">
                    <label for="scr-link">Width</label>
                    <md-input id="scr-width"
                              name="scr-width"
                              type="number"
                              min="100"
                              max="3000"
                              v-model="form.options.width"
                              required
                              :disabled="sizeAvailable"
                    />
                  </md-field>
                  <span class="md-error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>

              <div class="md-layout-item md-small-size-100">
                <ValidationProvider name="Height"
                                    rules="required|between:100,3000"
                                    v-slot="{ errors }">
                  <md-field class="">
                    <label for="scr-link">Height</label>
                    <md-input id="scr-height"
                              name="scr-height"
                              type="number"
                              min="100"
                              max="3000"
                              v-model="form.options.height"
                              required
                              :disabled="sizeAvailable"
                    />
                  </md-field>
                  <span class="md-error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>

            <div class="md-layout md-gutter">
              <div class="md-layout-item md-xlarge-size-25
              md-large-size-25 md-medium-size-50 md-small-size-100">
                <ValidationProvider name="Timeout"
                                    rules="required|between:0,60"
                                    v-slot="{ errors }">
                  <md-field class="">
                    <label for="scr-timeout">Timeout</label>
                    <md-input id="scr-timeout"
                              name="scr-timeout"
                              type="number"
                              min="0"
                              max="60"
                              v-model="form.options.timeout"
                    />
                  </md-field>
                  <span class="md-error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </div>


            <md-progress-bar md-mode="indeterminate" v-if="sending" />

            <div class="md-error" v-if="errors2.length">
              <ul>
                <li v-for="(error, index) in errors2"
                    v-bind:key="index+1">{{error}}</li>
              </ul>
            </div>

            <md-card-actions>
              <md-button type="submit"
                         class="md-primary"
                         :disabled="sending || invalid">Create Screenshot</md-button>
            </md-card-actions>
          </ValidationObserver>
          <md-snackbar :md-active.sync="snackStatus">
            The task has been sent to the queue!</md-snackbar>
        </md-card-content>

      </md-card>
    </div>

  </div>
</template>

<script>
import { mainApi } from '../../../services';
// import { getLogger } from '../../../common';

// const logger = getLogger('LoginForm');

export default {
  name: 'CreateScreenshot',
  data: () => ({
    form: {
      link: '',
      options: {
        fullPage: false,
        width: 1920,
        height: 1024,
        timeout: 0,
      },
    },
    sending: false,
    snackStatus: false,
    errors2: [],
  }),
  computed: {
    sizeAvailable() {
      return this.form.options.fullPage;
    },
  },
  methods: {
    async onSubmit() {
      try {
        this.sending = true;
        await mainApi.screenshotCreate(this.form);
        await new Promise(r => setTimeout(r, 1000));
        this.sending = false;
        this.snackStatus = true;
        setTimeout(() => {
          this.snackStatus = false;
        }, 4000);
        this.resetForm();
      } catch (e) {
        this.sending = false;
        this.errors2 = [];
        this.errors2.push((e && e.message) || e);
      }
      return null;
    },
    resetForm() {
      this.form = {
        link: '',
        options: {
          fullPage: false,
          width: 1920,
          height: 1024,
          timeout: 0,
        },
      };
      this.sending = false;
      // this.snackStatus = false;
      this.errors2 = [];
      // You should call it on the next frame
      requestAnimationFrame(() => {
        this.$refs.makeScreenshotObserver.reset();
      });
    },
  },
  // created() {},
};
</script>

<style lang="scss">
  .md-error {
    font-size: 13px;
    color: darkred;
  }
</style>
