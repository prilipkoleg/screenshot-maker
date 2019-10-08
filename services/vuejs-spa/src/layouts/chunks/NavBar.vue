<template>
  <nav class="navbar">
    <md-list>

      <router-link :to="{name: 'dashboard'}">
        <md-list-item>
          <md-icon>home</md-icon>
          <span class="md-list-item-text">Home</span>
        </md-list-item>
      </router-link>

      <router-link :to="{name: 'screenshot.create'}" >
        <md-list-item>
          <md-icon>add</md-icon>
          <span class="md-list-item-text">Create Screenshot</span>
        </md-list-item>
      </router-link>

      <router-link :to="{name: 'screenshot.list'}">
        <md-list-item md-active="true">
          <md-icon>list</md-icon>
          <span class="md-list-item-text">Screenshot list</span>
        </md-list-item>
      </router-link>

    </md-list>

  </nav>
</template>

<script>

</script>

<style lang="scss">
  .navbar {
    box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
  }
  .router-link-exact-active {
    background: rgba(0, 0, 0, 0.11);
    .md-list-item-text {
      font-weight: bold;
    }
  }
  .md-list-item-text {
    color: black;
  }
</style>
