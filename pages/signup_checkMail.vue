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
            <v-card-text style="padding-left: 20px; padding-right: 20px; padding-top: 20px">
              <div style="font-weight: 400; font-size: 14pt; color: rgb(63, 28, 49)">
                {{ $t('signup_checkMail.message') }}
              </div>
            </v-card-text>
            <v-card-actions style="padding-left: 20px; padding-right: 20px">
              <v-layout wrap align-center justify-center>
                <v-flex xs12>
                  <nuxt-link style="text-decoration: none; width: 100%" to="/signup">
                    <v-btn
                      dark
                      @click="signup_completion"
                      class="continueBtn"
                      color="rgb(56, 150, 29)">{{ $t('signup_completion.continueBtn') }}
                    </v-btn>
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

  .continueBtn{
    /*margin-top: 5px;*/
    width: 100%;
    padding: 0; 
    font-size: 9pt;
    color: rgb(255, 255, 255)
  }
</style>