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
              height="130px"
              src="cereris-logo.png">
            <v-card-title class="justify-center" style="margin-top: 10px; padding: 0">
              <div>
                <span style="font-weight: 400; font-size: 18pt; color: rgb(63, 28, 49)">{{ $t('signup.createAccount') }}</span>
              </div>
            </v-card-title>
            <v-card-text style="padding-left: 20px; padding-right: 20px; padding-top: 20px">
              <v-form>
                <v-text-field
                  style="color: rgb(60, 176, 30)"
                  color="rgb(56, 150, 29)"
                  prepend-icon="alternate_email"
                  :label="$t('signup.email')"
                  type="text"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  :error-messages="errors.collect('email')"
                  v-model="email"
                ></v-text-field>
              </v-form>
              <v-select
                color="rgb(56, 150, 29)"
                prepend-icon="language"
                :items="languages"
                v-model="language"
                :label="$t('signup.lang')"
                @change="changeLang()">
              </v-select>
            </v-card-text>
            <v-card-actions style="padding-left: 20px; padding-right: 20px">
              <v-layout row wrap align-center justify-center>
                <nuxt-link style="text-decoration: none" to="/signin">
                  <v-btn
                    class="switchBtn"
                    flat 
                    color="rgb(56, 150, 29)" 
                    style="margin-right: 10px; padding: 0; font-size: 9pt">{{ $t('signup.isRegistered') }}</v-btn>
                </nuxt-link>
                <v-spacer class="space"></v-spacer>
                <v-btn
                  class="enterBtn"
                  @click='signup' 
                  color="rgb(56, 150, 29)" 
                  style="color: rgb(255, 255, 255)">
                  {{ $t('signup.continueBtn') }}
                  <v-icon right dark style="margin-left: 5px">forward</v-icon>
                </v-btn>
                <nuxt-link style="text-decoration: none" to="/signin">
                  <v-btn
                    class="switchBtnMob"
                    flat 
                    color="rgb(56, 150, 29)" 
                    style="margin-right: 10px; padding: 0; font-size: 9pt">{{ $t('signup.isRegistered') }}</v-btn>
                </nuxt-link>
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
  import languageCfg from '../config/language'
  import errors from '../config/errors'
  import { Validator } from 'vee-validate'

  const httpCfg = require('../config/http')[process.env.IS_DEV ? 'is_dev' : 'is_prod']

  export default {
    layout: 'empty',
    data: function () {
      return {
        lang: '',
        email: '',
        language: languageCfg.all[this.$i18n.locale],
        notification: {
          is: false,
          text: '',
          level: ''
        },
        languages: Object.values(languageCfg.all)
      }
    },
    methods: {
      async signup () {
        try {
          this.setNotification(false)

          if (!await this.$validator.validateAll()) {
            return
          }
          console.log('Pre request')
          let signupResponse = await axios({
            method: 'post',
            url: httpCfg.backendURL + '/api/v1/users/signup/email',
            data: {
              email: this.email,
              language: this.$i18n.locale
            },
            validateStatus: function (status) {
              return status === 200 || status === 400
            }
          })
          console.log('Post request')
          if (signupResponse.status === 200) {
            // TODO: здесь вместо уведомления нужно будет сделать redirect на страницу с просьбой проверить почту
            this.setNotification(true, this.$t('informationMessages.completeRegistrationWithEmail', { email: this.email }), 'info')
            return
          }

          // signupResponse.status === 400, so now need to process errors
          for (let i = 0; i < signupResponse.data.data.length; i++) {
            if ([errors.EMAIL_ALREADY_IN_USE].includes(signupResponse.data.data[i])) {
              this.setNotification(true, this.$t('errors.error' + signupResponse.data.data[i]), 'warning')
              return
            }
          }
          this.$nuxt.error({ statusCode: 500, responses: [signupResponse] })
        } catch (error) {
          console.log('err', error)
          this.$nuxt.error({ statusCode: 500, error })
        }
      },
      setNotification (is, text, level) {
        this.notification.is = is
        this.notification.text = text
        this.notification.level = level
      },
      changeLang () {
        console.log(this.$i18n)
        let all = Object.keys(languageCfg.all)
        for (let i = 0; i < Object.values(languageCfg.all).length; i++) {
          if (languageCfg.all[all[i]] === this.language) {
            this.$i18n.locale = all[i]
            Validator.localize(all[i], languageCfg.veeValidateMessages[all[i]])
          }
        }
      }
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
    max-height: 455px;
  }

  .card{
    text-align: center;
    background-color: rgba(255, 255, 255, 0.7);
    padding-bottom: 10px;
    padding-top: 40px;
    /*width: 395px;*/
    width: 100%;
  }

  .switchBtn,
  .space{
    display: inline;
  }

  /*@media only screen and (max-width: 599px){ 
    .card-layout{
      position: relative;
      width: 100%;
      max-height: 455px;
    }
  }*/

  .switchBtnMob {display: none;}

  @media only screen and (max-width: 431px){ 
    .switchBtnMob{
      width: 100%;
      display: inline;
      /*margin-top: 5px*/
      margin-top: 10px
    }

    .enterBtn{
      width: 100%;
    }

    .switchBtn,
    .space{
      display: none;
    }

    .card-layout{
      position: relative;
      width: 100%;
      max-height: 501px;
    }
  }

  @media only screen and (max-width: 324px){ 
    .card-layout{
      position: relative;
      width: 100%;
      max-height: 537px;
    }
  }
</style>
