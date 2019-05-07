<template>
  <v-container fluid fill-height align-center justify-center v-if="loading" class="main-container">
    <Loader />
  </v-container>
  <v-container v-else fluid fill-height align-center justify-center class="main-container">
    <v-layout justify-center justify-center column class="main-layout">
        <v-scale-transition mode="out-in">
          <v-alert
            class="notification"
            v-if="notification.is"
            v-model="notification.is"
            dismissible
            :type="notification.level">
            {{ notification.text }}
          </v-alert>
        </v-scale-transition>
      <v-layout align-center justify-center column class="input-layout">
        <form data-vv-scope="userInfo" style="width: 100%">
          <v-flex xs12 class="inputFlex">
            <v-text-field
              class="textField"
              color="rgb(56, 150, 29)"
              prepend-icon="person"
              :label="$t('index.username')"
              type="text"
              v-validate="{ required: editedUser.email.length === 0 }"
              data-vv-name="username"
              :data-vv-as="$t('index.username')"
              :error-messages="errors.collect('userInfo.username')"
              v-model="editedUser.username"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="inputFlex">
            <v-text-field
              class="textField"
              color="rgb(56, 150, 29)"
              prepend-icon="alternate_email"
              :label="$t('index.email')"
              type="text"
              v-validate="'email'"
              data-vv-name="email"
              :data-vv-as="$t('index.email')"
              :error-messages="errors.collect('userInfo.email')"
              v-model="editedUser.email"
            ></v-text-field>
          </v-flex>
          <v-flex xs12 class="inputFlex">
            <v-text-field
              class="textField"
              color="rgb(56, 150, 29)"
              :label="$t('index.password')"
              prepend-icon="lock"
              type="password"
              v-validate="'min:5|max:20'"
              data-vv-name="passwordChange"
              :data-vv-as="$t('index.password')"
              :error-messages="errors.collect('userInfo.passwordChange')"
              v-model="editedUser.passwordChange">
            </v-text-field>
          </v-flex>
          <v-flex xs12 class="inputFlex">
            <v-text-field
              class="textField"
              color="rgb(56, 150, 29)"
              :label="$t('index.phone')"
              prepend-icon="phone"
              type="text"
              return-masked-value
              mask="+#(###)###-##-##"
              v-validate="{ required: editedUser.email.length === 0, regex: /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/}"
              data-vv-name="phone"
              :data-vv-as="$t('index.phone')"
              :error-messages="errors.collect('userInfo.phone')"
              v-model="editedUser.phone">
            </v-text-field>
          </v-flex>
          <v-flex xs12 class="inputFlex">
            <v-select
              class="textField"
              color="rgb(56, 150, 29)"
              prepend-icon="language"
              :items="languages"
              v-model="editedUser.language"
              :label="$t('index.lang')"
              @input="changeLang()">
            </v-select>
          </v-flex>
          <v-flex xs12 class="inputFlex">
            <v-text-field
              class="textField"
              color="rgb(56, 150, 29)"
              :label="$t('index.role')"
              prepend-icon="assignment_ind"
              type="text"
              disabled
              v-model="editedUser.role">
            </v-text-field>
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
              @click="deleteBtn"><v-icon left>delete</v-icon>{{ $t('index.deleteBtn') }}
            </v-btn>
          </v-flex>
        </form>
      </v-layout>
    </v-layout>
    <v-dialog v-model="deleteDialog" persistent max-width="400">
      <v-card>
        <v-toolbar dark class="error">
          <v-card-title class="deleteTitle">{{ this.$t('index.deleteTitle') }}</v-card-title>
        </v-toolbar>
        <v-card-text style="font-weight: 400; font-size: 12pt; color: rgb(63, 28, 49)">
          {{ this.$t('index.deleteDialog') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click="deleteDialog = false">
            {{ this.$t('adminPage.deleteCancel') }}
          </v-btn>
          <v-btn color="green darken-1" flat @click="deleteUser">
            {{ this.$t('adminPage.deleteOk') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <form data-vv-scope="passwordForm">
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
                    {{ $t('index.completeRegistration') }}
                  </span>
                </div>
              </v-card-title>
              <v-card-text style="padding-left: 20px; padding-right: 20px;">
                <v-text-field
                  ref="password"
                  color="rgb(56, 150, 29)"
                  prepend-icon="lock_open"
                  :label="$t('index.password')"
                  type="password"
                  v-validate="'required|min:5|max:20'"
                  data-vv-name="password"
                  :data-vv-as="$t('index.password')"
                  :error-messages="errors.collect('passwordForm.password')"
                  :append-icon="isPasswordVisible ? 'visibility' : 'visibility_off'"
                  @click:append="() => (isPasswordVisible = !isPasswordVisible)"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  v-model="password">
                </v-text-field>
                <v-text-field
                  color="rgb(56, 150, 29)"
                  prepend-icon="lock"
                  :label="$t('index.confirm')"
                  type="password"
                  v-validate="'required|confirmed:password'"
                  data-vv-name="confirmPassword"
                  :data-vv-as="$t('index.confirm')"
                  :error-messages="errors.collect('passwordForm.confirmPassword')"
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
                      color="rgb(56, 150, 29)">{{ $t('index.continueBtn') }}
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
            </v-card>
          </v-layout>
        </v-layout>
      </v-dialog>
    </form>    
  </v-container>
</template>

<script>
import axios from 'axios'
import sha256 from 'sha256'
import httpCfg from '../config/http'
import languageCfg from '../config/language'
import { Validator } from 'vee-validate'
import signout from '@/assets/scripts/signout'
import Loader from '@/components/Loader'
import errors from '../config/errors'

export default {
  layout: 'default',
  middleware: ['setQueryTokens', 'authenticated'],
  components: { Loader },
  data () {
    return {
      loading: true,
      languages: Object.values(languageCfg.all),
      password: '',
      confirmPassword: '',
      isPasswordVisible: false,
      passwordForm: true,
      deleteDialog: false,
      editedUser: {
        email: '',
        username: '',
        passwordChange: '',
        phone: '',
        role: '',
        language: languageCfg.all[this.$i18n.locale]
      },
      notification: {
        is: false,
        text: '',
        level: ''
      },
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/signup' }
      ],
      role: {
        admin: this.$t('index.admin'),
        guest: this.$t('index.guest')
      }
    }
  },
  methods: {
    async signup_completion () {
      try {
        if (!await this.$validator.validateAll('passwordForm')) {
          return
        }
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
          this.getUserInfo()
          return
        }

        this.$router.push({ path: '/error', query: { statusCode: 500, responses: [setPasswordResponse, userResponse] } })
        // this.$nuxt.error({ statusCode: 500, responses: [setPasswordResponse, userResponse] })
      } catch (error) {
        this.$router.push({ path: '/error', query: { statusCode: 500, responses: [error] } })
        // this.$nuxt.error({ statusCode: 500, error })
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
        if (languageCfg.all[all[i]] === this.editedUser.language) {
          this.$i18n.locale = all[i]
          Validator.localize(all[i], languageCfg.veeValidateMessages[all[i]])
          this.$vuetify.lang.current = all[i]
        }
      }
    },
    async getUserInfo () {
      try {
        let userResponse = await axios({
          method: 'get',
          url: httpCfg.backendURL + '/api/v1/users/current',
          headers: {'authorization': this.$store.getters['user/accessToken']},
          validateStatus: function (status) {
            return status === 200
          }
        })
        if (userResponse.status === 200) {
          this.editedUser = {
            email: userResponse.data.data.email,
            username: userResponse.data.data.username,
            passwordChange: '',
            phone: userResponse.data.data.phone,
            role: userResponse.data.data.isAdmin ? this.role.admin : this.role.guest,
            language: languageCfg.all[userResponse.data.data.data.language] // languageCfg.all[this.$i18n.locale]
          }
          return
        }

        this.$router.push({ path: '/error', query: { statusCode: 500, responses: [userResponse] } })
        // this.$nuxt.error({ statusCode: 500, responses: [userResponse] })
      } catch (error) {
        this.$router.push({ path: '/error', query: { statusCode: 500, responses: [error] } })
        // this.$nuxt.error({ statusCode: 500, error })
      }
    },
    async updateUser () {
      try {
        this.setNotification(false)
        if (!await this.$validator.validateAll('userInfo')) {
          return
        }

        if (JSON.stringify(this.editedUser) === JSON.stringify(this.uneditedUser)) {
          this.setNotification(true, this.$t('index.uneditedUser'), 'warning')
          return
        }
        let updateUserResponse
        let userResponse

        if (!this.editedUser.passwordChange) {
          updateUserResponse = await axios({
            method: 'patch',
            url: httpCfg.backendURL + '/api/v1/users/current',
            headers: {'authorization': this.$store.getters['user/accessToken']},
            data: {
              email: this.editedUser.email ? this.editedUser.email : null,
              username: this.editedUser.username ? this.editedUser.username : null,
              phone: this.editedUser.phone ? this.editedUser.phone : null,
              data: { language: this.$i18n.locale }
            },
            validateStatus: function (status) {
              return status === 200 || status === 400
            }
          })
        } else {
          updateUserResponse = await axios({
            method: 'patch',
            url: httpCfg.backendURL + '/api/v1/users/current',
            headers: {'authorization': this.$store.getters['user/accessToken']},
            data: {
              email: this.editedUser.email ? this.editedUser.email : null,
              username: this.editedUser.username ? this.editedUser.username : null,
              password: sha256(this.editedUser.passwordChange),
              phone: this.editedUser.phone ? this.editedUser.phone : null,
              data: { language: this.$i18n.locale }
            },
            validateStatus: function (status) {
              return status === 200 || status === 400
            }
          })
        }

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
          this.setNotification(true, this.$t('index.save'), 'success')
          return
        }

        for (let i = 0; i < updateUserResponse.data.data.length; i++) {
          if ([errors.NOTHING_CHANGED,
            errors.USERNAME_ALREADY_IN_USE,
            errors.PHONE_ALREADY_IN_USE].includes(updateUserResponse.data.data[i])) {
            this.setNotification(true, this.$t('errors.error' + updateUserResponse.data.data[i]), 'warning')
            return
          }
        }

        this.$router.push({ path: '/error', query: { data: [updateUserResponse.data.data, userResponse] } })
        // this.$nuxt.error({ statusCode: 500, responses: [updateUserResponse, userResponse] })
      } catch (error) {
        this.$router.push({ path: '/error', query: { statusCode: 500, responses: [error] } })
        // this.$nuxt.error({ statusCode: 500, error })
      }
    },
    deleteBtn () {
      this.deleteDialog = true
    },
    async deleteUser () {
      try {
        let deleteUserResponse = await axios({
          method: 'patch',
          url: httpCfg.backendURL + '/api/v1/users/current',
          headers: {'authorization': this.$store.getters['user/accessToken']},
          data: {
            state: 'deleted'
          },
          validateStatus: function (status) {
            return status === 200
          }
        })

        if (deleteUserResponse.status === 200) {
          signout(this.$store, this.$router)
          return
        }

        this.$router.push({ path: '/error', query: { statusCode: 500, responses: [deleteUserResponse] } })
        this.$nuxt.error({ statusCode: 500, responses: deleteUserResponse })
      } catch (error) {
        this.$router.push({ path: '/error', query: { statusCode: 500, responses: [error] } })
        // this.$nuxt.error({ statusCode: 500, error })
      }
    }
  },

  computed: {
    signupCompletion () {
      return this.$store.getters['user/state'] === 'registered'
    }
  },

  async mounted () {
    this.setNotification(false)
    if (this.$store.getters['user/state'] === 'active') {
      await this.getUserInfo()
    }
    this.loading = false
  }
}
</script>

<style scoped>
  .main-container {
    min-height: calc(100vh - 60px)
  }

  .main-layout {
    max-width: 400px;
  }

  .alert-layout {
    top: 30px;
    position: absolute;
    width: 400px;
    max-height: 10vh;
  }

  .notification {
    width: 100%;
    height: 100%;
    font-size: 12pt;
  }

  .input-layout {
    position: relative;
    width: 100%;
    max-height: 510px;
  }

  .inputFlex {
    width: 100%;
  }

  .Btn {
    width: 100%;
  }

  .v-btn {
    margin-left: 0;
    margin-bottom: 5px;
  }

  .deleteTitle {
    font-size: 15pt;
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

    .alert-layout {
      position: relative;
      top: 0;
      width: 100%;
      max-height: 10vh;
    }
  }
</style>