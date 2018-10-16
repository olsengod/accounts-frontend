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
            <v-card-title class="justify-center" style="margin-top: 10px; padding-right: 20px; padding-left: 20px">
              <div>
                <span style="font-weight: 400; font-size: 18pt; color: rgb(63, 28, 49)">
                  {{ $t('signup_completion.completeRegistration') }}
                </span>
              </div>
            </v-card-title>
            <v-card-text style="padding-left: 20px; padding-right: 20px;">
              <v-form>
                <v-text-field
                  ref="password"
                  color="rgb(56, 150, 29)"
                  prepend-icon="lock_open"
                  :label="$t('signup_completion.password')"
                  type="password"
                  v-validate="'required|min:5|max:20'"
                  data-vv-name="password"
                  :error-messages="errors.collect('password')"
                  :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'"
                  @click:append="() => (isPasswordVisible = !isPasswordVisible)"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  v-model="password">
                </v-text-field>
                <v-text-field
                  color="rgb(56, 150, 29)"
                  prepend-icon="lock"
                  :label="$t('signup_completion.confirm')"
                  type="password"
                  v-validate="'required|confirmed:password'"
                  data-vv-name="confirm-password"
                  :error-messages="errors.collect('confirm-password')"
                  :append-icon="isPasswordVisible2 ? 'visibility' : 'visibility_off'"
                  @click:append ="() => (isPasswordVisible2 = !isPasswordVisible2)"
                  :type="isPasswordVisible2 ? 'text' : 'password'"
                  v-model="confirmPassword">                    
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-card-actions style="padding-left: 20px; padding-right: 20px;">
              <v-layout wrap align-center justify-center>
                <v-flex xs12>
                  <!-- <nuxt-link style="text-decoration: none; width: 100%" to="/signup"> -->
                  <v-btn
                    dark
                    @click="signup_completion"
                    class="continueBtn"
                    color="rgb(56, 150, 29)">{{ $t('signup_completion.continueBtn') }}
                  </v-btn>
                  <!-- </nuxt-link> -->
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
  // import axios from 'axios'
  // import sha256 from 'sha256'
  // import httpCfg from '../config/http'
  // import errors from '../config/errors'
  // import { Validator } from 'vee-validate'

  export default {
    layout: 'empty',
    data: function () {
      return {
        password: '',
        confirmPassword: '',
        isPasswordVisible: false,
        isPasswordVisible2: false,
        notification: {
          is: false,
          text: '',
          level: ''
        }
      }
    },
    methods: {
      async signup_completion () {
        // try {
        //   this.setNotification(false)
        //   if (!await this.$validator.validateAll()) {
        //     return
        //   }

        //   let signupResponse
        //   let userResponse

        //   signupResponse = await axios({
        //     method: 'patch',
        //     url: httpCfg.backendURL + '/api/v1/users/current',
        //     data: {
        //       password: sha256(this.password)
        //     },
        //     validateStatus: function (status) {
        //       return status === 200 || status === 400
        //     }
        //   })

        //   if (signupResponse.status === 200) {
        //     userResponse = await axios({
        //       method: 'get',
        //       url: httpCfg.backendURL + '/api/v1/users/current',
        //       headers: {'authorization': signupResponse.data.data.accessToken},
        //       validateStatus: function (status) {
        //         return status === 200
        //       }
        //     })
        //     this.$store.dispatch('user/setTokens', { data: signupResponse.data.data })
        //     this.$store.dispatch('user/setUser', { data: userResponse.data.data, i18n: this.$i18n })
        //     this.$router.push('/')
        //     return
        //   }

        //   // signinResponse.status === 400, so now need to process errors
        //   for (let i = 0; i < signupResponse.data.data.length; i++) {
        //     if ([errors.WRONG_PASSWORD_LENGTH].includes(signupResponse.data.data[i])) {
        //       this.setNotification(true, this.$t('errors.error' + signupResponse.data.data[i]), 'warning')
        //       return
        //     }
        //     if ([errors.PASSWORD_IS_NOT_A_STRING].includes(signupResponse.data.data[i])) {
        //       // ?
        //       return
        //     }
        //   }
        //   this.$nuxt.error({ statusCode: 500, responses: [signupResponse, userResponse] })
        // } catch (error) {
        //   this.$nuxt.error({ statusCode: 500, error })
        // }
      },
      setNotification (is, text, level) {
        this.notification.is = is
        this.notification.text = text
        this.notification.level = level
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
    max-height: 517px;
  }

  .card{
    text-align: center;
    background-color: rgba(255, 255, 255, 0.7);
    padding-bottom: 10px;
    padding-top: 40px;
    width: 100%;
  }

  .continueBtn{
    /*margin-top: 5px;*/
    width: 100%;
    padding: 0; 
    font-size: 9pt;
    color: rgb(255, 255, 255)
  }

  a.comntinueBtn.v-btn.v-btn--router.theme--dark{
    width: 100%;
  }

  @media only screen and (max-width: 599px){ 
    .card-layout{
      position: relative;
      width: 100%;
      max-height: 558px;
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
</style>
