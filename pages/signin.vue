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
              <nuxt-link to="/signup">Регистрация</nuxt-link>
              <v-spacer></v-spacer>
              <v-btn v-on:click='signin'>Вход</v-btn>
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
  import errors from '../config/errors'

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

          let signinResponse
          let userResponse

          signinResponse = await axios({
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

          if (signinResponse.status === 200) {
            userResponse = await axios({
              method: 'get',
              url: httpCfg.backendURL + '/api/v1/users/current',
              headers: {'authorization': signinResponse.data.data.accessToken},
              validateStatus: function (status) {
                return status === 200
              }
            })
            this.$store.dispatch('user/setTokens', { data: signinResponse.data.data })
            this.$store.dispatch('user/setUser', { data: userResponse.data.data, i18n: this.$i18n })
            this.$router.push('/')
            return
          }

          // signinResponse.status === 400, so now need to process errors
          for (let i = 0; i < signinResponse.data.data.length; i++) {
            if ([errors.ACCOUNT_NOT_ACTIVE, errors.EMAIL_OR_PASSWORD_IS_WRONG].includes(signinResponse.data.data[i])) {
              this.setNotification(true, this.$t('errors.error' + signinResponse.data.data[i]), 'warning')
              return
            }
          }
          this.$nuxt.error({ statusCode: 500, responses: [signinResponse, userResponse] })
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
