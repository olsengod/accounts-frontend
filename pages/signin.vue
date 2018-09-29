<template>
  <v-content>
    <v-container fluid fill-height>
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
            <v-scale-transition mode="out-in">
              <v-alert
                v-if="notification.is"
                v-model="notification.is"
                dismissible
                outline
                :type="notification.level"
              >
                {{ notification.text }}
              </v-alert>
            </v-scale-transition>
          <v-card class="elevation-12">
            <v-toolbar>
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  prepend-icon="email"
                  label="Email"
                  type="text"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  :error-messages="errors.collect('email')"
                  v-model="email"
                ></v-text-field>
                <v-text-field
                  prepend-icon="lock"
                  label="Password"
                  type="password"
                  v-validate="'required|min:5|max:20'"
                  data-vv-name="password"
                  :error-messages="errors.collect('password')"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn v-on:click='signin'>Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<style scoped>
</style>

<script>
  import axios from 'axios'
  import sha256 from 'sha256'
  import httpCfg from '../config/http'

  export default {
    layout: 'empty',
    data: function () {
      return {
        email: '',
        password: '',
        notification: {
          is: false,
          text: '',
          level: ''
        }
      }
    },
    methods: {
      async signin () {
        try {
          this.setNotification(false)
          if (!await this.$validator.validateAll()) {
            return
          }

          let response = await axios({
            method: 'post',
            url: httpCfg.backendURL + '/api/v1/users/signin/email',
            data: {
              email: this.email,
              password: sha256(this.password)
            },
            validateStatus: function (status) {
              return status === 200 || status === 400
            }
          })

          if (response.status === 200) {
            this.$store.dispatch('user/setTokens', { data: response.data })
            this.$router.push('/')
            return
          }
          for (let i = 0; i < response.data.data.length; i++) {
            if ([10, 13, 41].includes(response.data.data[i])) {
              this.setNotification(true, response.data.data[i], 'warning')
              return
            }
          }
          this.$nuxt.error({ statusCode: 500, response })
        } catch (error) {
          this.$nuxt.error({ statusCode: 500, error })
        }
      },
      setNotification (is, text, level) {
        this.notification.is = is
        this.notification.text = text
        this.notification.level = level
      }
    }
  }
</script>
