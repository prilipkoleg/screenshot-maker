<template>
  <div>
    <h2>DashboardNoSidebar Template</h2>

    <nav-bar />

    <div class="container section">
      <div class="columns">
        <div class="column is-8">
          <slot />
        </div>
      </div>
    </div>

    <footer-bar />
  </div>
</template>

<script>
import NavBar from './chunks/NavBar';
import FooterBar from './chunks/FooterBar';

export default {
  components: {
    NavBar,
    FooterBar,
  },
};
</script>
