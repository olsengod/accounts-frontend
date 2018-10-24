<template>
  <v-container fluid fill-height align-center justify-center>
    <v-layout align-center justify-center column class="main-layout">
      <v-flex xs12 class="inputFlex">
        <v-form>
          <v-text-field
            class="textField"
            color="rgb(56, 150, 29)"
            prepend-icon="person"
            :label="$t('index.userName')"
            type="text"
            v-validate="{ required: email.length === 0 }"
            data-vv-name="userName"
            :error-messages="errors.collect('userName')"
            v-model="userName"
          ></v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12 class="inputFlex">
        <v-form>
          <v-text-field
            class="textField"
            color="rgb(56, 150, 29)"
            prepend-icon="alternate_email"
            :label="$t('index.email')"
            type="text"
            v-validate="'email'"
            data-vv-name="email"
            :error-messages="errors.collect('email')"
            v-model="email"
          ></v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12 class="inputFlex">
        <v-form>
          <v-text-field
            class="textField"
            color="rgb(56, 150, 29)"
            :label="$t('index.password')"
            prepend-icon="lock"
            type="password"
            v-validate="'min:5|max:20'"
            data-vv-name="password"
            :error-messages="errors.collect('password')"
            v-model="passwordChange">
          </v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12 class="inputFlex">
        <v-form>
          <v-text-field
            class="textField"
            color="rgb(56, 150, 29)"
            :label="$t('index.phone')"
            prepend-icon="phone"
            type="text"
            v-validate="{ required: email.length === 0, regex: /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/}"
            data-vv-name="phone"
            :error-messages="errors.collect('phone')"
            v-model="phone">
          </v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12 class="inputFlex">
        <v-form>
          <v-select
            class="textField"
            color="rgb(56, 150, 29)"
            prepend-icon="language"
            :items="languages"
            v-model="language"
            :label="$t('index.lang')"
            @change="changeLang()">
          </v-select>
        </v-form>
      </v-flex>
      <v-flex xs12 style="text-align: center; width: 100%">
        <v-btn
          dark
          class="Btn"
          color="rgb(56, 150, 29)"
          @click="updateUser"><v-icon left>save</v-icon>{{ $t('index.saveBtn') }}
        </v-btn>
      </v-flex>
      <v-flex xs12 style="text-align: center; width: 100%">
        <v-btn
          dark
          class="Btn"
          color="error"
          @click="deleteUser"><v-icon left>delete</v-icon>{{ $t('index.deleteBtn') }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-form @submit.prevent="validateForm()" data-vv-scope="passwordForm">
      <v-dialog v-model="signupCompletion" persistent full-width max-width="400">
        <v-layout align-center justify-center column class="main-layout">
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
                <v-text-field
                  ref="password"
                  color="rgb(56, 150, 29)"
                  prepend-icon="lock_open"
                  :label="$t('signup_completion.password')"
                  type="password"
                  v-validate="'required|min:5|max:20'"
                  data-vv-name="password"
                  :error-messages="errors.collect('passwordForm.password')"
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
                  :error-messages="errors.collect('passwordForm.confirm-password')"
                  :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'"
                  @click:append ="() => (isPasswordVisible = !isPasswordVisible)"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  v-model="confirmPassword">                    
                </v-text-field>
              </v-card-text>
              <v-card-actions style="padding-left: 20px; padding-right: 20px;">
                <v-layout wrap align-center justify-center>
                  <v-flex xs12>
                    <v-btn
                      @click="signup_completion()"
                      dark
                      class="continueBtn"
                      color="rgb(56, 150, 29)">{{ $t('signup_completion.continueBtn') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-layout>
        </v-layout>
      </v-dialog>
    </v-form>
  </v-container>
</template>

<script>
// import { mapState } from 'vuex'
import axios from 'axios'
import sha256 from 'sha256'
import httpCfg from '../config/http'
import languageCfg from '../config/language'
import { Validator } from 'vee-validate'
import ls from 'local-storage'
import signout from '@/assets/scripts/signout'

export default {
  layout: 'default',
  middleware: ['autologin', 'authenticated'],
  data () {
    return {
      userName: '',
      email: '',
      passwordChange: '',
      phone: '',
      language: languageCfg.all[this.$i18n.locale],
      languages: Object.values(languageCfg.all),
      signupCompletion: false,
      password: '',
      confirmPassword: '',
      isPasswordVisible: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/signup' }
      ],
      notification: {
        is: false,
        text: '',
        level: ''
      }
    }
  },
  methods: {
    async signup_completion () {
      try {
        this.setNotification(false)
        console.log('VALIDATOR', this.$validator)
        // if (!await this.$validator.validateAll('passwordForm')) {
        if (!await this.validateForm()) {
          console.log('ERR VALIDATE')
          console.log(await this.$validator.validate('passwordForm.*'))
          console.log(await this.$validator.validateAll('passwordForm'))
          return
        }
        console.log('REQUEST')

        let userResponse
        let setPasswordResponse = await axios({
          method: 'patch',
          url: httpCfg.backendURL + '/api/v1/users/current',
          headers: {'authorization': this.$store.getters['user/accessToken']},
          data: {
            password: sha256(this.password)
          },
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })

        if (setPasswordResponse.status === 200) {
          userResponse = await axios({
            method: 'get',
            url: httpCfg.backendURL + '/api/v1/users/current',
            headers: {'authorization': this.$store.getters['user/accessToken']},
            validateStatus: function (status) {
              return status === 200
            }
          })
          this.$store.dispatch('user/setUser', { data: userResponse.data.data, i18n: this.$i18n })
          this.$router.push('/')
          return
        }

        this.$nuxt.error({ statusCode: 500, responses: [setPasswordResponse, userResponse] })
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
      console.log(this.$i18n)
      let all = Object.keys(languageCfg.all)
      for (let i = 0; i < Object.values(languageCfg.all).length; i++) {
        if (languageCfg.all[all[i]] === this.language) {
          this.$i18n.locale = all[i]
          Validator.localize(all[i], languageCfg.veeValidateMessages[all[i]])
        }
      }
    },
    validateForm () {
      this.$validator.validateAll('passwordForm').then((result) => {
        return result
      })
    },
    async getUserInfo () {
      let userResponse = await axios({
        method: 'get',
        url: httpCfg.backendURL + '/api/v1/users/current',
        headers: {'authorization': this.$store.getters['user/accessToken']},
        validateStatus: function (status) {
          return status === 200
        }
      })

      this.userName = userResponse.data.data.username
      this.email = userResponse.data.data.email
      this.phone = userResponse.data.data.phone
    },
    async updateUser () {
      try {
        this.setNotification(false)
        if (!await this.$validator.validateAll('passwordForm')) {
          return
        }
        let userResponse
        let updateUserResponse = await axios({
          method: 'patch',
          url: httpCfg.backendURL + '/api/v1/users/current',
          headers: {'authorization': this.$store.getters['user/accessToken']},
          data: {
            email: this.email,
            username: this.userName,
            password: sha256(this.password),
            phone: this.phone,
            data: { language: this.language }
          },
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })

        if (updateUserResponse.status === 200) {
          userResponse = await axios({
            method: 'get',
            url: httpCfg.backendURL + '/api/v1/users/current',
            headers: {'authorization': this.$store.getters['user/accessToken']},
            validateStatus: function (status) {
              return status === 200
            }
          })
          this.$store.dispatch('user/setUser', { data: userResponse.data.data, i18n: this.$i18n })
          return
        }
        this.$nuxt.error({ statusCode: 500, responses: [updateUserResponse, userResponse] })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },
    async deleteUser () {
      try {
        this.setNotification(false)
        if (!await this.$validator.validateAll('passwordForm')) {
          return
        }
        let deleteUserResponse = await axios({
          method: 'delete',
          url: httpCfg.backendURL + '/api/v1/users/current',
          headers: {'authorization': this.$store.getters['user/accessToken']},
          validateStatus: function (status) {
            return status === 200
          }
        })
        ls.clear()
        signout()
        this.$nuxt.error({ statusCode: 500, responses: deleteUserResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    }
  },
  created () {
    switch (this.$store.getters['user/state']) {
      case 'active':
        console.log('ACTIVE')
        break
      case 'registered':
        console.log('REGISTERED')
        this.signupCompletion = true
        break
      case 'deleted':
        console.log('DELETED')
        this.$router.push('/error.vue')
        break
    }
  },

  mounted () {
    if (this.$store.getters['user/state'] === 'active') {
      this.getUserInfo()
    }
  }
}
</script>

<style scoped>
  .main-layout {
    max-width: 400px;
  }

  .inputFlex {
    width: 100%;
  }

  .Btn {
    width: 100%;
  }

  .card-layout {
    position: relative;
    width: 100%;
    max-height: 517px;
  }

  .card {
    text-align: center;
    /*background-color: rgba(255, 255, 255, 0.7);*/
    padding-bottom: 10px;
    padding-top: 40px;
    width: 100%;
  }

  .continueBtn {
    /*margin-top: 5px;*/
    width: 100%;
    padding: 0; 
    font-size: 9pt;
    color: rgb(255, 255, 255)
  }

  a.comntinueBtn.v-btn.v-btn--router.theme--dark {
    width: 100%;
  }

  @media only screen and (max-width: 599px) { 
    .card-layout {
      position: relative;
      width: 100%;
      max-height: 558px;
    }
  }

  @media only screen and (max-width: 332px) { 
    .switchBtn {
      width: 100%;
    }

    .space {
      display: none;
    }
  }
</style>