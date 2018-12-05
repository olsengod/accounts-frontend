<template>
  <v-container fluid fill-height align-center justify-center v-if="loading" class="main-container">
    <Loader />
  </v-container>
  <v-container v-else fluid align-center class="main-container">
    <v-layout align-center justify-center column class="main-layout">
      <v-toolbar color="white">
        <v-toolbar-title class="hidden-xs-only">{{ $t('adminPage.userList') }}</v-toolbar-title>
        <v-spacer class="hidden-xs-only"></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="search"
          :label="$t('adminPage.search')"
          hide-details
          color="rgb(56, 150, 29)"
          style="padding: 0"
        ></v-text-field>
        <form data-vv-scope="userInfo">
          <v-dialog v-model="editDialog" persistent max-width="500px">
            <v-scale-transition mode="out-in">
              <v-alert
                class="notification"
                v-if="editNotification.is"
                v-model="editNotification.is"
                dismissible
                :type="editNotification.level">
                {{ editNotification.text }}
              </v-alert>
            </v-scale-transition>
            <v-card>
              <v-card-title  style="margin-top: 10px; padding-right: 20px; padding-left: 20px; padding-bottom: 0">
                <span style="font-weight: 400; font-size: 18pt; color: rgb(63, 28, 49)">
                  {{ $t('adminPage.editTitle') }}
                </span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout column wrap>
                    <v-flex xs12 sm6 md4 class="inputFlex">
                      <v-text-field
                        class="textField"
                        color="rgb(56, 150, 29)"
                        prepend-icon="perm_identity"
                        label="Id"
                        type="text"
                        v-validate="'required'"
                        data-vv-name="Id"
                        data-vv-as="Id"
                        :error-messages="errors.collect('userInfo.Id')"
                        disabled
                        v-model="editedUser.id"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4 class="inputFlex">
                      <v-text-field
                        class="textField"
                        color="rgb(56, 150, 29)"
                        prepend-icon="person"
                        :label="$t('adminPage.userName')"
                        type="text"
                        v-validate="{ required: editedUser.email.length === 0, min: 5, max: 30}"
                        data-vv-name="userName"
                        :data-vv-as="$t('adminPage.userName')"
                        :error-messages="errors.collect('userInfo.userName')"
                        v-model="editedUser.username"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4 class="inputFlex">
                      <v-text-field
                        class="textField"
                        color="rgb(56, 150, 29)"
                        prepend-icon="alternate_email"
                        :label="$t('adminPage.email')"
                        type="text"
                        v-validate="'email'"
                        data-vv-name="email"
                        :data-vv-as="$t('adminPage.email')"
                        :error-messages="errors.collect('userInfo.email')"
                        v-model="editedUser.email"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4 class="inputFlex">
                      <v-text-field
                        class="textField"
                        color="rgb(56, 150, 29)"
                        :label="$t('adminPage.phone')"
                        prepend-icon="phone"
                        return-masked-value
                        mask="+#(###)###-##-##"
                        type="text"
                        v-validate="{regex: /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/}"
                        data-vv-name="phone"
                        :data-vv-as="$t('adminPage.phone')"
                        :error-messages="errors.collect('userInfo.phone')"
                        v-model="editedUser.phone">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4>
                      <v-select
                        color="rgb(56, 150, 29)"
                        prepend-icon="assignment_ind"
                        :items="Object.values(role)"
                        v-model="editedUser.role"
                        :label="$t('adminPage.role')">
                      </v-select>
                    </v-flex>
                    <v-flex v-if="editedUser.state === $t('adminPage.registered')" xs12 sm6 md4>
                      <v-text-field
                        class="textField"
                        color="rgb(56, 150, 29)"
                        prepend-icon="loop"
                        :label="$t('adminPage.state')"
                        type="text"
                        disabled
                        v-model="editedUser.state"
                      ></v-text-field>
                    </v-flex>
                    <v-flex v-else xs12 sm6 md4>
                      <v-select
                        color="rgb(56, 150, 29)"
                        prepend-icon="loop"
                        :items="Object.values(editState)"
                        v-model="editedUser.state"
                        :label="$t('adminPage.state')">
                      </v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="rgb(56, 150, 29)" flat @click="closeEdit">{{ this.$t('adminPage.cancel') }}</v-btn>
                <v-btn color="rgb(56, 150, 29)" flat @click="editUser">{{ this.$t('adminPage.save') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </form>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="userList"
        class="elevation-1 table"
        style="width: 100%"
        :search="search"
        :rows-per-page-items="rowsPerPage"
        pagination.sync="pagination"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.role }}</td>
          <td>{{ props.item.state }}</td>
          <td>
            <v-tooltip bottom>
              <v-icon
                small
                class="mr-2"
                @click="editBtn(props.item)"
                color="primary"
                slot="activator"
              >
                edit
              </v-icon>
              <span>{{ $t('adminPage.editTitle') }}</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-icon
                small
                @click="deleteBtn(props.item)"
                color="error"
                slot="activator"
              >
                cancel
              </v-icon>
              <span>{{ $t('adminPage.deleteTitle') }}</span>
            </v-tooltip>
          </td>
        </template>
      </v-data-table>
    </v-layout>
    <v-layout align-center justify-center column style="max-width: 400px">
      <v-dialog v-model="deleteDialog" persistent max-width="400">
        <v-scale-transition mode="out-in">
          <v-alert
            class="notification"
            v-if="deleteNotification.is"
            v-model="deleteNotification.is"
            dismissible
            :type="deleteNotification.level">
            {{ deleteNotification.text }}
          </v-alert>
        </v-scale-transition>
        <v-card>
          <v-toolbar dark class="error">
            <v-card-title class="headline">{{ $t('adminPage.deleteTitle') }}</v-card-title>
          </v-toolbar>
          <v-card-text style="font-weight: 400; font-size: 12pt; color: rgb(63, 28, 49)">
            {{ this.$t('adminPage.deleteDialog') }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="closeDelete">
              {{ this.$t('adminPage.deleteCancel') }}
            </v-btn>
            <v-btn color="green darken-1" flat @click="deleteUser">
              {{ this.$t('adminPage.deleteOk') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import axios from 'axios'
import httpCfg from '../config/http'
import Loader from '@/components/Loader'
import errors from '../config/errors'
// import { Validator } from 'vee-validate'

export default {
  layout: 'default',
  middleware: ['autologin', 'authenticated'],
  components: { Loader },
  data () {
    return {
      loading: true,
      deleteDialog: false,
      userList: [],
      pageSize: 20,
      editedIndex: -1,
      deletedIndex: -1,
      editDialog: false,
      search: '',
      loadingTable: true,
      // pagination: {},
      totalUsers: 0,
      // pagination: { rowsPerPage: 20 },
      rowsPerPage: [20],
      deleteNotification: {
        is: false,
        text: '',
        level: ''
      },
      editNotification: {
        is: false,
        text: '',
        level: ''
      },
      headers: [
        {
          text: 'Id',
          align: 'left',
          sortable: false,
          value: 'id'
        },
        { text: this.$t('adminPage.email'), value: 'email' },
        { text: this.$t('adminPage.userName'), value: 'username' },
        { text: this.$t('adminPage.phone'), value: 'phone' },
        { text: this.$t('adminPage.role'), value: 'role' },
        { text: this.$t('adminPage.state'), value: 'state' },
        { text: this.$t('adminPage.actions'), value: 'name', sortable: false }
      ],
      editedUser: {
        id: '',
        email: '',
        username: '',
        phone: '',
        role: '',
        state: ''
      },
      defaultUser: {
        id: '',
        email: '',
        username: '',
        phone: '',
        role: '',
        state: ''
      },
      role: {
        admin: this.$t('adminPage.admin'),
        guest: this.$t('adminPage.guest')
      },
      state: {
        active: this.$t('adminPage.active'),
        registered: this.$t('adminPage.registered'),
        deleted: this.$t('adminPage.deleted')
      },
      editState: {
        active: this.$t('adminPage.active'),
        deleted: this.$t('adminPage.deleted')
      }
    }
  },
  methods: {
    async getUsers () {
      try {
        let getUsersResponse = await axios({
          method: 'get',
          // url: httpCfg.backendURL + '/api/v1/users?offset=' + this.userList.length +
          //   '&limit=' + (this.userList.length + this.pageSize),
          url: httpCfg.backendURL + '/api/v1/users?offset=' + 0 +
            '&limit=' + 100,
          headers: {'authorization': this.$store.getters['user/accessToken']},
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })
        if (getUsersResponse.status === 200) {
          for (let i = 0; i < 100; i++) {
            if (i === getUsersResponse.data.data.length) break
            this.userList.push({
              id: getUsersResponse.data.data[i].id,
              email: getUsersResponse.data.data[i].email,
              username: getUsersResponse.data.data[i].username,
              phone: getUsersResponse.data.data[i].phone,
              role: getUsersResponse.data.data[i].isAdmin ? this.role.admin : this.role.guest,
              state: this.state[getUsersResponse.data.data[i].state]
            })
          }
          // for (let i = 0; i < 100; i++) {
          //   // if (i === getUsersResponse.data.data.length) break
          //   this.userList.push({
          //     id: 'LOL',
          //     email: 'LOL',
          //     username: 'LOL',
          //     phone: 'LOL',
          //     role: 'LOL',
          //     state: 'LOL'
          //   })
          // }
          return
        }

        this.$nuxt.error({ statusCode: 500, responses: getUsersResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },

    editBtn (user) {
      this.setNotification('edit', false)
      this.editedIndex = this.userList.indexOf(user)
      this.editedUser = Object.assign({}, user)
      this.editDialog = true
    },

    deleteBtn (user) {
      this.setNotification('delete', false)
      this.deletedIndex = this.userList.indexOf(user)
      this.deleteDialog = true
    },

    setNotification (notification, is, text, level) {
      switch (notification) {
        case 'edit':
          this.editNotification.is = is
          this.editNotification.text = text
          this.editNotification.level = level
          break
        case 'delete':
          this.deleteNotification.is = is
          this.deleteNotification.text = text
          this.deleteNotification.level = level
          break
      }
    },

    async deleteUser () {
      try {
        this.setNotification('delete', false)
        if (this.userList[this.deletedIndex].state === this.state.deleted) {
          this.setNotification('delete', true, this.$t('adminPage.deleteAlready'), 'info')
          return
        } else if (this.userList[this.deletedIndex].state === this.state.registered) {
          this.setNotification('delete', true, this.$t('adminPage.deleteRegistered'), 'warning')
          return
        }
        let deleteUserResponse = await axios({
          method: 'patch',
          url: httpCfg.backendURL + '/api/v1/users/' + this.userList[this.deletedIndex].id,
          headers: {'authorization': this.$store.getters['user/accessToken']},
          data: {
            state: 'deleted'
          },
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })
        if (deleteUserResponse.status === 200) {
          // Object.assign(this.userList[this.editedIndex], this.editedUser)
          this.userList[this.deletedIndex].state = this.state.deleted
          this.closeDelete()
          return
        }

        this.$nuxt.error({ statusCode: 500, responses: deleteUserResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },

    async editUser () {
      try {
        this.setNotification('edit', false)
        if (!await this.$validator.validateAll('userInfo')) {
          return
        }
        let editUserResponse
        if (this.editedUser.state !== this.$t('adminPage.registered')) {
          editUserResponse = await axios({
            method: 'patch',
            url: httpCfg.backendURL + '/api/v1/users/' + this.editedUser.id,
            headers: {'authorization': this.$store.getters['user/accessToken']},
            data: {
              email: this.editedUser.email ? this.editedUser.email : null,
              username: this.editedUser.username ? this.editedUser.username : null,
              phone: this.editedUser.phone ? this.editedUser.phone : null,
              isAdmin: this.editedUser.role === this.role.admin,
              state: this.getKeyByValue(this.editState, this.editedUser.state)
            },
            validateStatus: function (status) {
              return status === 200 || status === 400
            }
          })
        } else {
          editUserResponse = await axios({
            method: 'patch',
            url: httpCfg.backendURL + '/api/v1/users/' + this.editedUser.id,
            headers: {'authorization': this.$store.getters['user/accessToken']},
            data: {
              email: this.editedUser.email,
              username: this.editedUser.username,
              phone: this.editedUser.phone,
              isAdmin: this.editedUser.role === this.role.admin
            },
            validateStatus: function (status) {
              return status === 200 || status === 400
            }
          })
        }

        if (editUserResponse.status === 200) {
          Object.assign(this.userList[this.editedIndex], this.editedUser)
          this.closeEdit()
          return
        }

        for (let i = 0; i < editUserResponse.data.data.length; i++) {
          if ([errors.NOTHING_CHANGED].includes(editUserResponse.data.data[i])) {
            this.setNotification('edit', true, this.$t('errors.error' + editUserResponse.data.data[i]), 'warning')
            return
          }
        }

        this.$nuxt.error({ statusCode: 500, responses: editUserResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },

    closeEdit () {
      this.setNotification('edit', false)
      this.editDialog = false
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      }, 300)
    },

    closeDelete () {
      this.setNotification('delete', false)
      this.deleteDialog = false
      setTimeout(() => {
        this.deletedIndex = -1
      }, 300)
    },

    getKeyByValue (object, value) {
      return Object.keys(object).find(key => object[key] === value)
    }
  },

  async mounted () {
    await this.getUsers()
    this.$vuetify.lang.current = this.$i18n.locale
    this.loading = false
  }
}
</script>

<style scoped>
  .main-container {
    height: calc(100vh - 60px)
  }

  .main-layout {
    /*max-width: 400px;*/
  }

  .notification {
    font-size: 12pt;
  }

  .table {
    margin-bottom: 20px;
  }
</style>