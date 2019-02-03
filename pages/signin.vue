<template>
  <v-content>
    <v-container fluid fill-height align-center justify-center>
      <v-layout align-center justify-center column class="main-layout">
        <v-scale-transition mode="out-in">
          <v-alert
            class="alert"
            v-if="notification.is"
            v-model="notification.is"
            dismissible
            :type="notification.level">
            {{ notification.text }}
          </v-alert>
        </v-scale-transition>
        <v-layout align-center justify-center class="card-layout">
          <v-card class="card elevation-12">
            <img
              style="margin-top: 15px"
              height="130px"
              src="cereris-logo.png">
            <v-card-title class="justify-center" style="margin-top: 10px; padding: 0">
              <div>
                <span style="font-weight: 400; font-size: 18pt; color: rgb(63, 28, 49)">{{ $t('signin.returnMes') }}</span>
              </div>
            </v-card-title>
            <v-card-text style="padding-left: 20px; padding-right: 20px;">
              <v-select
                color="rgb(56, 150, 29)"
                prepend-icon="language"
                :items="languages"
                v-model="language"
                :label="$t('signup.lang')"
                @change="changeLang()">
              </v-select>
              <v-form>
                <v-text-field
                  color="rgb(56, 150, 29)"
                  prepend-icon="alternate_email"
                  label="Email"
                  id="email"
                  :label="$t('signin.email')"
                  type="text"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  :error-messages="errors.collect('email')"
                  v-model="email">                    
                </v-text-field>
                <v-text-field
                  color="rgb(56, 150, 29)"
                  prepend-icon="lock"
                  :label="$t('signin.password')"
                  type="password"
                  v-validate="'required|min:5|max:20'"
                  data-vv-name="password"
                  :error-messages="errors.collect('password')"
                  v-model="password"
                ></v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-left: 20px; padding-right: 20px;">
              <v-layout wrap align-center justify-center>
                <v-flex xs12>
                  <v-btn
                    class="enterBtn"
                    @click='signin' 
                    color="rgb(56, 150, 29)">
                    {{ $t('signin.continueBtn') }}
                    <v-icon right dark style="margin-left: 3px">forward</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex xs12 sm6 style="padding-top: 10px">
                  <nuxt-link style="text-decoration: none" to="/forgetPassword">
                    <v-btn
                      class="passLink"
                      flat
                      color="rgb(56, 150, 29)">{{ $t('signin.forgetPassword') }}</v-btn>
                  </nuxt-link>
                </v-flex>
                  <v-spacer class="space"></v-spacer>
                <v-flex xs12 sm6 style="padding-top: 10px">
                  <nuxt-link style="text-decoration: none" to="/signup">
                    <v-btn
                      class="switchBtn"
                      flat 
                      color="rgb(56, 150, 29)">{{ $t('signin.isRegistered') }}</v-btn>
                  </nuxt-link>
                </v-flex>
              </v-layout>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
  import axios from 'axios'
  import sha256 from 'sha256'
  import httpCfg from '../config/http'
  import errors from '../config/errors'
  import languageCfg from '../config/language'
  import { Validator } from 'vee-validate'
  // import checkTokens from '@/assets/scripts/checkTokens'
  import ls from 'local-storage'

  export default {
    layout: 'empty',
    data () {
      return {
        email: '',
        password: '',
        language: languageCfg.all[this.$i18n.locale],
        languages: Object.values(languageCfg.all),
        notification: {
          is: false,
          text: '',
          level: ''
        },
        prevURL: ''
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

            signinResponse.data.data.redirect = this.$router.push
            this.$store.dispatch('user/setTokens', { data: signinResponse.data.data })
            this.$store.dispatch('user/setUser', { data: userResponse.data.data, i18n: this.$i18n })
            // this.$router.push('/')
            this.serviceRedirect(signinResponse.data.data.accessToken, signinResponse.data.data.refreshToken, signinResponse.data.data.expiresIn)
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
      },
      changeLang () {
        let all = Object.keys(languageCfg.all)
        for (let i = 0; i < Object.values(languageCfg.all).length; i++) {
          if (languageCfg.all[all[i]] === this.language) {
            this.$i18n.locale = all[i]
            Validator.localize(all[i], languageCfg.veeValidateMessages[all[i]])
          }
        }
      },
      async serviceRedirect (accessToken, refreshToken, expiresIn) {
        //  token request
        switch (this.prevURL) {
          case 'https://torlight-stage.cereris.org':
            this.$router.push(this.prevURL + '?accessToken=' + accessToken + '&refreshToken' + refreshToken + '&expiresIn' + expiresIn)
            break
          default:
            this.$router.push('/')
        }
      }
    },

    async created () {
      console.log('redirectHistory ', document.referrer)

      this.prevURL = document.referrer
      let accessToken = ls.get('cererisAccountAccessToken')
      let refreshToken = ls.get('cererisAccountRefreshToken')
      let expiresIn = ls.get('cererisExpiresIn')

      if (!accessToken || !refreshToken || !expiresIn) {
        return
      }
      this.serviceRedirect(accessToken, refreshToken, expiresIn)
    }
  }
</script>

<style scoped>

  .main-layout{
    max-width: 400px;
  }

  .alert{
    width: 100%;
  }

  .card-layout{
    position: relative;
    width: 100%;
    max-height: 585px;
  }

  .card{
    text-align: center;
    background-color: rgba(255, 255, 255, 0.7);
    padding-bottom: 10px;
    padding-top: 40px;
    width: 100%;
  }

  .enterBtn{
    width: 100%;
    color: rgb(255, 255, 255)
  }

  .passLink{
    margin-top: 5px;
    width: 100%;
    padding: 0; 
    font-size: 9pt
  }

  .switchBtn{
    margin-top: 5px;
    width: 100%;
    padding: 0; 
    font-size: 9pt
  }

  .space{
    display: inline;
  }

  @media only screen and (max-width: 599px){ 
    .card-layout{
      position: relative;
      width: 100%;
      max-height: 636px;
    }
  }

  @media only screen and (max-width: 332px){ 
    .switchBtn{
      width: 100%;
    }

    .space{
      display: none;
    }
  }

  @media only screen and (max-width: 317px){ 
    .card-layout{
      position: relative;
      width: 100%;
      max-height: 672px;
    }
  }
</style>
