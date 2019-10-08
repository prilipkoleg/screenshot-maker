<template>
  <div class="account-info">
    <md-card>

      <md-card-header>
        <md-avatar>
          <img src="../../assets/default_profile.svg" alt="People">
        </md-avatar>

        <div class="md-title">{{username}}</div>
        <div class="md-subhead">{{email}}</div>
      </md-card-header>

<!--      <md-card-area></md-card-area>-->
      <md-card-actions>
        <md-button class="md-primary" @click="signOut">Logout</md-button>
      </md-card-actions>

    </md-card>
  </div>
</template>

<script>
import { authService } from '../../services';
import { constants } from '../../common';

const decodedToken = authService.__getDecodedToken();

export default {
  data: () => ({
    username: decodedToken.username || 'User',
    email: decodedToken.email || '...',
  }),
  methods: {
    signOut() {
      authService.signOut()
        .then(() => {
          this.$router.replace({ name: constants.router.name.LOGIN });
        });
    },
  },
};
</script>

<style lang="scss">

</style>
