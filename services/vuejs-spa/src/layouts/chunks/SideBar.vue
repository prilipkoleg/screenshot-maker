<template>
  <div class="sidebar">
    <account-info/>
    <nav-bar/>
  </div>
</template>

<script>
import NavBar from './NavBar';
import AccountInfo from './AccountInfo';

export default {
  name: 'SideBar',
  components: {
    NavBar,
    AccountInfo,
  },
};
</script>
