<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app>
      <v-toolbar flat class="transparent" height="60" extension-height="60">
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
        <v-list-tile @click="navigate('/')">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ routes.index }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile v-if="$store.getters['user/isAdmin']" @click="navigate('/adminPage')">
          <v-list-tile-action>
            <v-icon>people</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ routes.adminPage }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar height="60" extension-height="60" app>
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
        <nuxt v-cloak />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import signout from '@/assets/scripts/signout'

export default {
  data () {
    return {
      drawer: false
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
      this.$router.push(nav)
    }
  },

  mounted () {
    if (window.innerWidth > 900) {
      this.drawer = true
    }
  },

  computed: {
    routes () {
      return {
        index: this.$t('default.account'),
        adminPage: this.$t('default.users')
      }
    },
    title () { return this.routes[this.$nuxt.$route.name] }
  }
}
</script>

<style scoped>
  .title {
    font-weight: 400;    
  }

  .toolbar {
    /*height: 64px;*/
  }
</style>