<template>
  <div class="login-container">

    <md-tabs class="md-transparent" md-alignment="fixed">
      <md-tab id="tab-signIn" md-label="Sign In">
        <md-card-content>
          <ValidationObserver tag="form"
                              id="formSignIn"
                              name="signIn"
                              class="signIn"
                              ref="signInObserver"
                              v-slot="{ invalid }"
                              v-on:submit.prevent="onSubmit">

            <ValidationProvider name="email" rules="required|min:5|email" v-slot="{ errors }">
              <md-field class="">
                <label for="signIn.email">Email Address</label>
                <md-input id="signIn.email"
                          name="signIn.email"
                          type="email"
                          autocomplete="email"
                          v-model="form.signIn.email"
                          required
                />
              </md-field>
              <span class="md-error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider name="password" rules="required|min:6" v-slot="{ errors }">
              <md-field class="">
                <label for="signIn.password">Password</label>
                <md-input id="signIn.password"
                          name="signIn.password"
                          type="password"
                          v-model="form.signIn.password"
                          required
                />
              </md-field>
              <span class="md-error">{{ errors[0] }}</span>
            </ValidationProvider>

            <div>
              <md-checkbox class="md-primary"
                           v-model="form.signIn.rememberMe">
                Remember me
              </md-checkbox>
            </div>

            <md-progress-bar md-mode="indeterminate" v-if="form.signIn.sending" />

            <div class="md-error" v-if="form.signIn._errors.length">
              <ul>
                <li v-for="(error, index) in form.signIn._errors"
                    v-bind:key="index+1">{{error}}</li>
              </ul>
            </div>

            <md-card-actions>
              <md-button type="submit"
                         class="md-primary"
                         :disabled="form.sending || invalid">Sign In</md-button>
            </md-card-actions>

          </ValidationObserver>
        </md-card-content>
      </md-tab>
      <md-tab id="tab-signUp" md-label="Sing Up">
        <md-card-content>
          <ValidationObserver tag="form"
                              id="formSignUp"
                              name="signUp"
                              class="signUp"
                              ref="signUpObserver"
                              v-slot="{ invalid }"
                              v-on:submit.prevent="onSubmit">

            <ValidationProvider name="email" rules="required|min:5|email" v-slot="{ errors }">
              <md-field class="">
                <label for="signUp.email">Email Address</label>
                <md-input id="signUp.email"
                          name="signUp.email"
                          type="email"
                          v-model="form.signUp.email"
                          required
                />
              </md-field>
              <span class="md-error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider name="su-password"
                                vid="su-password"
                                rules="required|min:6"
                                v-slot="{ errors }"
            >
              <md-field class="">
                <label for="signUp.password">Password</label>
                <md-input id="signUp.password"
                          name="signUp.password"
                          type="password"
                          v-model="form.signUp.password"
                          required
                />
              </md-field>
              <span class="md-error">{{ errors[0] }}</span>
            </ValidationProvider>

            <ValidationProvider name="su-passwordConfirm"
                                rules="required|min:6|confirmed:su-password" v-slot="{ errors }">
              <md-field class="">
                <label for="signUp.passwordConfirm">Password Confirm</label>
                <md-input id="signUp.passwordConfirm"
                          name="signUp.passwordConfirm"
                          type="password"
                          v-model="form.signUp.passwordConfirm"
                          required
                />
              </md-field>
              <span class="md-error">{{ errors[0] }}</span>
            </ValidationProvider>

            <md-progress-bar md-mode="indeterminate" v-if="form.sending" />

            <div class="md-error" v-if="form.signUp._errors.length">
              <ul>
                <li v-for="(error, index) in form.signUp._errors"
                    v-bind:key="index+1">{{error}}</li>
              </ul>
            </div>

            <md-card-actions>
              <md-button type="submit"
                         class="md-primary"
                         :disabled="form.signUp.sending || invalid">Sign In</md-button>
            </md-card-actions>

          </ValidationObserver>
        </md-card-content>
      </md-tab>
    </md-tabs>

  </div>
</template>

<script>
import { authService } from '../services';
import { getLogger, constants } from '../common';

const logger = getLogger('LoginForm');

export default {
  name: 'LoginForm',
  data: () => ({
    form: {
      signIn: {
        email: null,
        password: null,
        rememberMe: false,
        sending: false,
        _errors: [],
      },
      signUp: {
        email: null,
        password: null,
        passwordConfirm: null,
        sending: false,
        _errors: [],
      },
    },
  }),
  methods: {
    async onSubmit(event) {
      const formName = event.target.name;
      console.log('onSubmit called', event, formName);
      if (!formName || !(formName in this.form)) {
        return console.error(`Form name: '${formName}' is not valid`);
      }

      try {
        const data = this.form[formName];
        if (typeof authService[formName] !== 'function') {
          console.log(new Error(`Method: '${formName}' not found!`));
          return false;
        }

        logger.info([
          'formName:', formName,
          'formData:', data,
        ]);

        switch (formName) {
          case 'signIn': {
            data.sending = true;
            const signInData = { ...(({ sending, _errors, ...rest } = data) => rest)() };
            await authService.signIn(signInData);
            this.resetForms();
            await this.$router.replace({ name: constants.router.name.DASHBOARD });
            break;
          }
          case 'signUp': {
            data.sending = true;
            const signUpData = {
              username: data.email,
              ...(({ sending, _errors, ...rest } = data) => rest)(),
            };
            await authService.signUp(signUpData);
            this.resetForms();
            await this.$router.replace({ name: constants.router.name.DASHBOARD });
            break;
          }
          default: {
            console.log(`Form Name: '${formName}' Not Valid!`);
          }
        }
      } catch (e) {
        this.form[formName].sending = false;
        this.form[formName]._errors = [];
        this.form[formName]._errors.push((e && e.message) || e);
      }
      return null;
    },
    resetForms() {
      this.form = {
        signIn: {
          email: null,
          password: null,
          rememberMe: false,
          sending: false,
          _errors: [],
        },
        signUp: {
          email: null,
          password: null,
          passwordConfirm: null,
          sending: false,
          _errors: [],
        },
      };
      // You should call it on the next frame
      requestAnimationFrame(() => {
        this.$refs.signInObserver.reset();
        this.$refs.signUpObserver.reset();
      });
    },
  },
};
</script>

<style lang="scss">
  .template-default {
    /*background-image: url("https://images.unsplash.com/photo-1530053969600-caed2596d242?ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&h=2000&q=80");
    background-image: url("https://images.unsplash.com/photo-1556861460-7d38b2955d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=3034&h=2000&q=80");
    background-image: url("https://images.unsplash.com/photo-1560259979-e45719df036e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjIzODIyfQ&auto=format&fit=crop&w=2134&h=2000&q=80");
    background-image: url("https://images.unsplash.com/photo-1540206395-68808572332f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2081&h=1500&q=80");
    background-image: url("https://images.unsplash.com/photo-1429552077091-836152271555?ixlib=rb-1.2.1&auto=format&fit=crop&w=2088&q=80");
    background-image: url("../assets/loginBG.jpeg");*/
    background-image: url("../assets/fireBG.jpeg");
    background-image: url("../assets/lightningBG.jpeg");
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  };
  .login-container {
    padding-top: 20vh;
  }
  .md-tabs {
    margin: 0 auto;
    background: rgba(255, 255, 255, 0.85);
    max-width: 600px;
    color: #fff;
  }
  .md-tabs-navigation:after{
    width: 100%;
    display: block;
    border-bottom: 2px solid white;
  }
  .md-card-content:last-of-type {
    padding-bottom: 5px;
  }
  .md-button[type=submit] {
    background: #65bddc;
    .md-button-content{
      color: #fff;
    }
    &:hover {
      background: #20aac9;
    }
    &[disabled=disabled] {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
  .md-error {
    font-size: 13px;
    color: darkred;
  }
</style>
