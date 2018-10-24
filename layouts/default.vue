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
        <v-list-tile @click="menuItem = $t('index.title')">
          <v-list-tile-action>
            <v-icon>person</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ $t('index.title') }}</v-list-tile-title>
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
        @click="$vuetify.goTo(0, {offset: 0})">{{ menuItem }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn
          flat
          @click="sign_out()"
          :style="{ color: $vuetify.theme.textTheme +'' }">
          {{ $t('index.logout') }}
        </v-btn>
      </v-toolbar-items> 
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import signout from '@/assets/scripts/signout'

export default {
  data () {
    return {
      drawer: false,
      menuItem: this.$t('index.title')
    }
  },

  methods: {
    switchNav () {
      this.drawer = !this.drawer
    },
    sign_out () {
      signout()
    }
    // async signout () {
    //   try {
    //     let signoutResponse = await axios({
    //       method: 'post',
    //       url: httpCfg.backendURL + '/api/v1/users/signout',
    //       headers: {'authorization': this.$store.getters['user/accessToken']},
    //       validateStatus: function (status) {
    //         return status === 200
    //       }
    //     })

    //     if (signoutResponse.status === 200) {
    //       this.$store.commit('user/RESET_USER')
    //       this.$router.push('/signin')
    //       return
    //     }

    //     this.$nuxt.error({ statusCode: 500, responses: signoutResponse })
    //   } catch (error) {
    //     console.log(error)
    //     this.$nuxt.error({ statusCode: 500, error })
    //   }
    // }
  }
}
</script>

<style scoped>
  .title {
    font-weight: 400;    
  }
</style>