<template>
  <v-container fluid fill-height align-center justify-center style="z-index: 1">
    <v-layout align-center justify-center column class="main-layout" xs12 sm6>
      <v-layout align-center justify-center class="card-layout">
        <v-card class="card elevation-12">
          <v-toolbar justify-center align-center style="text-align: center; align-items: center;" class="error">
            <v-toolbar-title>
              <span
                style="font-weight: 400; font-size: 18pt; color: rgb(255,255,255)">{{ $t('errorPage.default') }}
              </span>
            </v-toolbar-title>
          </v-toolbar>
          <v-card-text style="padding-left: 20px; padding-right: 20px; padding-top: 20px">
            <div style="font-weight: 300; font-size: 12pt; color: rgb(63, 28, 49); width: 500px; height: auto">
              <v-list class="menu">
                <v-list-tile
                  v-for="error in errors"
                  :key="error"
                  style="margin-bottom: 10px">
                  <span>
                    {{ error }}
                  </span>
                  <br>
                </v-list-tile>
              </v-list>
            </div>
          </v-card-text>
          <v-card-actions style="padding-left: 20px; padding-right: 20px">
            <v-spacer></v-spacer>
            <nuxt-link style="text-decoration: none" to="/">
              <v-btn
                class="returnBtn"
                flat 
                color="rgb(56, 150, 29)" 
                style="margin-right: 10px; padding: 0; font-size: 9pt">{{ $t('errorPage.returnHome') }}
              </v-btn>
            </nuxt-link>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'empty',
  // props: ['error', 'responses'],
  data () {
    return {
      errors: []
    }
  },
  mounted () {
    if (this.$route.query.hasOwnProperty('data')) {
      if (Array.isArray(this.$route.query.data)) {
        console.log('ERR 1')
        for (let i = 0; i < this.$route.query.data.length; i++) {
          this.errors.push(this.$t('errors.error' + this.$route.query.data[i]))
        }
      } else {
        console.log('ERR 2')
        this.errors.push(this.$t('errors.error' + this.$route.query.data))
      }
    } else {
      console.log('ERR DEFAULT')
      this.errors.push(this.$t('errors.error8'))
    }
  }
}
</script>

<style scoped>
  .card{
    max-width: 100%;
  }
</style>