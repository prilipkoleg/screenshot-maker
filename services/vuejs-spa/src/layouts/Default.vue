<script>
import NavBar from './chunks/NavBar';
// import SideBar from '@/components/SideBar';
import FooterBar from './chunks/FooterBar';

export default {
  components: {
    NavBar,
    // SideBar,
    FooterBar,
  },
};
</script>

<template>
  <div class="template-default">
    <slot />
  </div>
</template>

<style lang="scss">
.template-default {
  height: 100%;
  min-height: 100vh;
  width: 100%;
}
</style>
