<template>
  <v-container>
    <v-layout align-center justify-center column class="main-layout">
      <v-flex xs12>
        <v-form>
          <v-text-field
            style="color: rgb(60, 176, 30)"
            color="rgb(56, 150, 29)"
            :label="$t('index.user')"
            type="text"
            v-validate="'required'"
            data-vv-name="userName"
            :error-messages="errors.collect('userName')"
            v-model="userName">
          </v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12>
        <v-form>
          <v-text-field
            style="color: rgb(60, 176, 30)"
            color="rgb(56, 150, 29)"
            :label="$t('index.surname')"
            type="text"
            v-validate="'required'"
            data-vv-name="surname"
            :error-messages="errors.collect('surname')"
            v-model="surname">
          </v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12>
        <v-form>
          <v-text-field
            style="color: rgb(60, 176, 30)"
            color="rgb(56, 150, 29)"
            :label="$t('index.name')"
            type="text"
            v-validate="'required'"
            data-vv-name="name"
            :error-messages="errors.collect('name')"
            v-model="name">
          </v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12>
        <v-form>
          <v-text-field
            style="color: rgb(60, 176, 30)"
            color="rgb(56, 150, 29)"
            :label="$t('index.patronymic')"
            type="text"
            v-validate="'required'"
            data-vv-name="patronymic"
            :error-messages="errors.collect('patronymic')"
            v-model="patronymic">
          </v-text-field>
        </v-form>
      </v-flex>
      <v-flex xs12>
        <v-btn
          dark
          class="saveBtn"
          color="rgb(56, 150, 29)">{{ $t('index.save') }}
        </v-btn>
      </v-flex>
    </v-layout>
    <v-dialog v-model="dialog" persistent max-width="400">
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
    </v-dialog>
  </v-container>
</template>

<script>
// import { mapState } from 'vuex'
export default {
  layout: 'default',
  middleware: ['autologin', 'authenticated'],
  data () {
    return {
      userName: '',
      surname: '',
      name: '',
      patronymic: '',
      signupCompletion: false,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/signup' }
      ]
    }
  },
  created () {
    console.log(this.store.getters['user/state'])
    switch (this.store.getters['user/state']) {
      case 'active':
        break
      case 'registered':
        this.signupCompletion = true
        break
      case 'deleted':
        this.$router.push('/error.vue')
        break
    }
  }
  // computed: {
  //   ...mapState(['user'])
  // }
}
</script>

<style scoped>
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