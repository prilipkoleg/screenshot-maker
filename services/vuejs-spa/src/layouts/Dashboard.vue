<template>
  <div class="page-container">
    <md-app md-waterfall md-mode="fixed">
      <md-app-toolbar class="md-primary md-large">
        <div class="md-toolbar-row">
          <md-button class="md-icon-button md-xlarge-hide"
                     @click="menuVisible = !menuVisible">
            <md-icon>menu</md-icon>
          </md-button>

          <img class="vue-logo" src="../assets/logo.png" alt="VueJs logo">
          <span class="md-title">Screenshot Maker</span>
        </div>
      </md-app-toolbar>

      <md-app-drawer md-permanent="full" :md-active.sync="menuVisible">
        <side-bar />
      </md-app-drawer>

      <md-app-content>
        <slot></slot>
      </md-app-content>
    </md-app>

<!--    <footer-bar />-->

  </div>
</template>

<script>
import SideBar from './chunks/SideBar';
import FooterBar from './chunks/FooterBar';

export default {
  name: 'Dashboard',
  data: () => ({
    menuVisible: false,
  }),
  components: {
    SideBar,
    FooterBar,
  },
};
</script>

<style lang="scss">
  .md-toolbar.md-theme-default {
    background-image: url("https://images.unsplash.com/photo-1556861460-7d38b2955d05?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&h=100&q=80");
    /*background-image: url("https://images.unsplash.com/photo-1560259979-e45719df036e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjIzODIyfQ&auto=format&fit=crop&w=2134&h=2000&q=80");*/
    /*background-image: url("https://images.unsplash.com/photo-1540206395-68808572332f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2081&h=1500&q=80");*/
    /*background-image: url("https://images.unsplash.com/photo-1429552077091-836152271555?ixlib=rb-1.2.1&auto=format&fit=crop&w=2088&q=80");*/
    /*background-image: url("../assets/loginBG.jpeg");*/
    /*background-image: url("../assets/fireBG.jpeg");*/
    /*background-image: url("../assets/lightningBG.jpeg");*/
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
  }
  .md-app-container {
    min-height: 100vh;
  }
  .vue-logo {
    max-height: 40px;
  }
</style>
