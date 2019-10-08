<template>
  <div id="app">
    <component :is="layout">
      <router-view/>
    </component>
  </div>
</template>


<script>
const defaultLayout = 'default';
export default {
  computed: {
    layout() {
      return `layout.${(this.$route.meta.layout || defaultLayout)}`;
    },
  },
  created() {
    // nothing defined here (when this.$route.path is other than "/")
    // console.log(this.$route, this.$route.meta.layout);
  },
  updated() {
    // something defined here whatever the this.$route.path
    // console.log(this.$route, this.$route.meta.layout);
  },
};

//   export default {
//   name: 'App',
// };
</script>


<style src="./app.scss" lang="scss"></style>
