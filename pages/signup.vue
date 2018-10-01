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
              <v-toolbar-title>Registration form</v-toolbar-title>
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
              </v-form>
            </v-card-text>
            <v-card-actions>
              <nuxt-link to="/signin">Вход</nuxt-link>
              <v-spacer></v-spacer>
              <v-btn v-on:click='signup'>Регистрация</v-btn>
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
  import httpCfg from '../config/http'
  import languageCfg from '../config/language'

  export default {
    layout: 'empty',
    data: function () {
      return {
        email: '',
        language: languageCfg.default,
        notification: {
          is: false,
          text: '',
          level: ''
        }
      }
    },
    methods: {
      async signup () {
        try {
          this.setNotification(false)

          if (!await this.$validator.validateAll()) {
            return
          }

          let signupResponse = await axios({
            method: 'post',
            url: httpCfg.backendURL + '/api/v1/users/signup/email',
            data: {
              email: this.email,
              language: this.language
            },
            validateStatus: function (status) {
              return status === 200 || status === 400
            }
          })

          if (signupResponse.status === 200) {
            this.setNotification(true, this.$t('informationMessages.completeRegistrationWithEmail', { email: this.email }), 'info')
            return
          }

          // signupResponse.status === 400, so now need to process errors
          for (let i = 0; i < signupResponse.data.data.length; i++) {
            if ([35].includes(signupResponse.data.data[i])) {
              this.setNotification(true, this.$t('errors.error' + signupResponse.data.data[i]), 'warning')
              return
            }
          }
          this.$nuxt.error({ statusCode: 500, responses: [signupResponse] })
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
