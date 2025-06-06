<template>
  <v-app>
    <Navbar v-if="isAuthenticated" />
    <v-main>
      <router-view />
    </v-main>
    <Footer v-if="showFooter" />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex';
import Navbar from './components/layout/Navbar.vue';
import Footer from './components/layout/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  },
  computed: {
    ...mapGetters(['isAuthenticated']),
    showFooter() {
      // Hide footer on Login and Register pages
      const noFooterRoutes = ['/login', '/register'];
      return !noFooterRoutes.includes(this.$route.path.toLowerCase());
    }
  },
  created() {
    // Check if user is already logged in (token in localStorage)
    this.$store.dispatch('checkAuth');
  }
}
</script>
