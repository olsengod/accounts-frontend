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
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'default',
  // middleware: ['autologin', 'authenticated'],
  data () {
    return {
      userName: '',
      surname: '',
      name: '',
      patronymic: '',
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'bubble_chart', title: 'Inspire', to: '/signup' }
      ]
    }
  },
  created () {
    console.log(this.user.state)
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
