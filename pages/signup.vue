<template>
  <v-content>
    <v-container fluid fill-height class="main-container">
      <v-layout class="matrix">
        <canvas id="matr"></canvas>
      </v-layout>
      <v-layout align-center justify-center class="main-layout">
        <v-scale-transition mode="out-in">
          <v-alert
            v-if="notification.is"
            v-model="notification.is"
            dismissible
            outline
            :type="notification.level">
            {{ notification.text }}
          </v-alert>
        </v-scale-transition>
        <v-card class="card elevation-12">
          <img
            height="130px"
            src="cereris-logo.png">
          <v-card-title class="justify-center" style="margin-top: 10px; padding: 0">
            <div>
              <span style="font-weight: 400; font-size: 18pt; color: rgb(63, 28, 49)">{{ $t('signup.createAccount') }}</span>
            </div>
          </v-card-title>
          <v-card-text style="padding-left: 20px; padding-right: 20px;">
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
                v-model="Email"
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
              <v-spacer class="hidden-xs-only"></v-spacer>
              <v-btn
                class="enterBtn"
                v-on:click='signup' 
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
    </v-container>
  </v-content>
</template>

<script>
  import axios from 'axios'
  import httpCfg from '../config/http'
  import languageCfg from '../config/language'
  import errors from '../config/errors'
  import { Validator } from 'vee-validate'

  export default {
    layout: 'empty',
    data: function () {
      return {
        lang: '',
        Email: '',
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
          this.$nuxt.error({ statusCode: 500, error })
        }
      },
      setNotification (is, text, level) {
        this.notification.is = is
        this.notification.text = text
        this.notification.level = level
      },
      changeLang () {
        // this.$i18n.locale = (this.$i18n.locale === 'ru') ? 'en' : 'ru'
        let all = Object.keys(languageCfg.all)
        for (let i = 0; i < Object.values(languageCfg.all).length; i++) {
          if (languageCfg.all[all[i]] === this.language) {
            this.$i18n.locale = all[i]
            Validator.localize(all[i], languageCfg.veeValidateMessages[all[i]])
          }
        }
      },
      matrixBack () {
        var c = document.getElementById('matr')
        var ctx = c.getContext('2d')

        //  making the canvas full screen
        // c.height = window.innerHeight;
        c.width = window.innerWidth
        c.height = document.body.clientHeight
        //  c.width = document.body.clientWidth;
        //  chinese characters - taken from the unicode charset
        var matrix = 'CcEeRrIiSs'
        //  converting the string into an array of single characters
        matrix = matrix.split('')

        var fontSize = 10
        var columns = c.width / fontSize // number of columns for the rain
        //  an array of drops - one per column
        var drops = []
        //  x below is the x coordinate
        //  1 = y co-ordinate of the drop(same for every drop initially)
        for (var x = 0; x < columns; x++) {
          drops[x] = 1000 * Math.random()
        }

        //  drawing the characters
        function draw (isDark) {
          //  Black BG for the canvas
          //  translucent BG to show trail
          //  ctx.fillStyle = "rgba(0, 0, 0, 0.04)";
          if (isDark) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)'
          }
          ctx.fillRect(0, 0, c.width, c.height)
          ctx.fillStyle = 'rgba(0, 84, 5, 1)' //  green text
          ctx.font = fontSize + 'px arial'
          //  looping over drops
          for (var i = 0; i < drops.length; i++) {
            //  a random chinese character to print
            var text = matrix[ Math.floor(Math.random() * matrix.length) ]
            //  x = i*font_size, y = value of drops[i]*font_size
            ctx.fillText(text, i * fontSize, drops[i] * fontSize)
            //  sending the drop back to the top randomly after it has crossed the screen
            //  adding a randomness to the reset to make the drops scattered on the Y axis
            if (drops[i] * fontSize > c.height && Math.random() > 0.975) {
              drops[i] = 0
            }
            //  incrementing Y coordinate
            drops[i]++
          }
        }
        setInterval(() => {
          draw(this.isDark)
        }, 75)
      }
    },

    mounted () {
      this.matrixBack()
    }
  }
</script>

<style scoped>
  .main-container{
    position: absolute;
    width: 100%;
    padding: 0;
  }

  .main-layout{
    position: absolute;
    width: 100%;
    text-align: center;
  }

  .canvas#matr{
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    margin: auto;
  }

  .matrix{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 0;
  }

  .card{
    text-align: center;
    background-color: rgba(255, 255, 255, 0.7);
    padding-bottom: 20px;
    padding-top: 40px;
    width: 395px;
  }

  .switchBtn{
    display: inline;
  }

  @media only screen and (max-width: 400px){ 
    .enterBtn{
      width: 100%;
    }

    .switchBtn{
      display: none;
    }
  }

  .switchBtnMob {display: none;}

  @media only screen and (max-width: 400px){ 
    .switchBtnMob{
      width: 100%;
      display: inline;
      margin-top: 5px
    }
  }
</style>
