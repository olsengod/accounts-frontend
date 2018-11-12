<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      app>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-if="$store.getters['user/username']">{{ $store.getters['user/username'] }}</v-list-tile-title>
              <v-list-tile-title v-else>Username</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile @click="navigate('account')">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ navigation.account.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile @click="navigate('users')">
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ navigation.users.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar class="toolbar" app>
      <v-toolbar-side-icon @click="switchNav()"></v-toolbar-side-icon>
      <img
        src="@/static/cereris-logo.png"
        alt="Logo" 
        height="25px"
        style="cursor: pointer">
      <v-toolbar-title
        class="title hidden-xs-only"
        @click="$vuetify.goTo(0, {offset: 0})">{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          flat
          @click="sign_out()"
          :style="{ color: $vuetify.theme.textTheme + '' }">
          {{ $t('index.logout') }}
        </v-btn>
      </v-toolbar-items> 
    </v-toolbar>
    <v-content>
      <v-container fluid style="padding: 0">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import signout from '@/assets/scripts/signout'
// import axios from 'axios'
// import httpCfg from '@/config/http'

export default {
  data () {
    return {
      drawer: false,
      // menuItem: this.$t('index.account'),
      title: this.$t('index.account'),
      navigation: {
        account: {
          path: '/',
          title: this.$t('index.account')
        },
        users: {
          path: '/adminPage',
          title: this.$t('index.users')
        }
      }
    }
  },

  methods: {
    switchNav () {
      this.drawer = !this.drawer
    },
    sign_out () {
      signout(this.$store, this.$router)
    },
    navigate (nav) {
      console.log('Nav ', nav)
      this.title = this.navigation[nav].title
      // store.commit('user/Navigate', navigation[nav].title)
      this.$router.push(this.navigation[nav].path)
    }
  },
  computed: {
  }
}
</script>

<style scoped>
  .title {
    font-weight: 400;    
  }
</style>