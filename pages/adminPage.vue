<template>
  <v-container fluid align-center >
    <v-layout align-center justify-center column class="main-layout">
      <v-toolbar color="white">
        <v-toolbar-title>{{ $t('adminPage.userList') }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <form data-vv-scope="userInfo">
          <v-dialog v-model="dialog" persistent max-width="500px">
            <v-card>
              <v-card-title  style="margin-top: 10px; padding-right: 20px; padding-left: 20px; padding-bottom: 0">
                <span style="font-weight: 400; font-size: 18pt; color: rgb(63, 28, 49)">
                  {{ $t('adminPage.editUser') }}
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
                        :error-messages="errors.collect('Id')"
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
                        v-validate="{ required: editedUser.email.length === 0 }"
                        data-vv-name="userName"
                        :error-messages="errors.collect('userName')"
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
                        :error-messages="errors.collect('email')"
                        v-model="editedUser.email"
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs12 sm6 md4 class="inputFlex">
                      <v-text-field
                        class="textField"
                        color="rgb(56, 150, 29)"
                        :label="$t('adminPage.phone')"
                        prepend-icon="phone"
                        type="text"
                        v-validate="{ required: editedUser.email.length === 0, regex: /^(\+7|7|8)?[\s-]?\(?[489][0-9]{2}\)?[\s-]?[0-9]{3}[\s-]?[0-9]{2}[\s-]?[0-9]{2}$/}"
                        data-vv-name="phone"
                        :error-messages="errors.collect('phone')"
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
                    <v-flex xs12 sm6 md4>
                      <v-select
                        color="rgb(56, 150, 29)"
                        prepend-icon="loop"
                        :items="Object.values(state)"
                        v-model="editedUser.state"
                        :label="$t('adminPage.state')">
                      </v-select>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="rgb(56, 150, 29)" flat @click="close">{{ this.$t('adminPage.cancel') }}</v-btn>
                <v-btn color="rgb(56, 150, 29)" flat @click="save">{{ this.$t('adminPage.save') }}</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </form>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="userList"
        hide-actions
        class="elevation-1"
        style="width: 100%"
      >
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id }}</td>
          <td>{{ props.item.email }}</td>
          <td>{{ props.item.username }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.role }}</td>
          <td>{{ props.item.state }}</td>
          <td class="justify-center layout px-0">
            <v-icon
              small
              class="mr-2"
              @click="editBtn(props.item)"
              color="primary"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteBtn(props.item)"
              color="error"
            >
              cancel
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-layout>
    <v-dialog v-model="deleteConfirm" persistent max-width="350">
      <v-card>
        <v-toolbar dark class="error">
          <v-card-title class="headline">{{ this.$t('adminPage.deleteTitle') }}</v-card-title>
        </v-toolbar>
        <v-card-text style="font-weight: 400; font-size: 12pt; color: rgb(63, 28, 49)">
          {{ this.$t('adminPage.deleteConfirm') }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="deleteConfirm = false">
            {{ this.$t('adminPage.deleteCancel') }}
          </v-btn>
          <v-btn color="green darken-1" flat @click.native="deleteUser">
            {{ this.$t('adminPage.deleteOk') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// import { mapState } from 'vuex'
import axios from 'axios'
import httpCfg from '../config/http'
// import { Validator } from 'vee-validate'

export default {
  layout: 'default',
  middleware: ['autologin', 'authenticated'],
  data () {
    return {
      deleteConfirm: false,
      userList: [],
      pageSize: 20,
      editedIndex: -1,
      deletedUser: {},
      dialog: false,
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
        operator: this.$t('adminPage.operator')
      },
      state: {
        active: this.$t('adminPage.active'),
        registered: this.$t('adminPage.registered'),
        deleted: this.$t('adminPage.deleted')
      },
      deleteDialog: {
        text: '',
        title: ''
      }
    }
  },
  methods: {
    async getUsers () {
      try {
        let getUsersResponse = await axios({
          method: 'get',
          url: httpCfg.backendURL + '/api/v1/users?offset=' + this.userList.length +
            '&limit=' + (this.userList.length + this.pageSize),
          headers: {'authorization': this.$store.getters['user/accessToken']},
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })

        if (getUsersResponse.status === 200) {
          console.log('LOL', getUsersResponse.data.data)
          for (let i = 0; i < this.pageSize; i++) {
            if (i === getUsersResponse.data.data.length) break
            this.userList.push({
              id: getUsersResponse.data.data[i].id,
              email: getUsersResponse.data.data[i].email,
              username: getUsersResponse.data.data[i].username,
              phone: getUsersResponse.data.data[i].phone,
              role: getUsersResponse.data.data[i].isAdmin ? this.role.admin : this.role.operator,
              state: this.state[getUsersResponse.data.data[i].state]
            })
          }
          return
        }

        this.$nuxt.error({ statusCode: 500, responses: getUsersResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },

    editBtn (user) {
      this.editedIndex = this.userList.indexOf(user)
      this.editedUser = Object.assign({}, user)
      this.dialog = true
    },

    deleteBtn (user) {
      this.deletedUser = user
      this.deleteConfirm = true
      console.log('LIIIL')
    },

    async deleteUser () {
      try {
        let deleteUserResponse = await axios({
          method: 'delete',
          url: httpCfg.backendURL + '/api/v1/users/' + this.deletedUser.id,
          headers: {'authorization': this.$store.getters['user/accessToken']},
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })

        if (deleteUserResponse.status === 200) {
          this.deleteConfirm = false
        }

        this.$nuxt.error({ statusCode: 500, responses: deleteUserResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },

    async editUser () {
      try {
        let editUserResponse = await axios({
          method: 'patch',
          url: httpCfg.backendURL + '/api/v1/users/' + this.editedUser.id,
          headers: {'authorization': this.$store.getters['user/accessToken']},
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })

        if (editUserResponse.status === 200) {
          this.userList.splice(this.userList.indexOf(this.deletedUser), 1)
          this.deleteConfirm = false
        }

        this.$nuxt.error({ statusCode: 500, responses: editUserResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },

    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedUser = Object.assign({}, this.defaultUser)
        this.editedIndex = -1
      }, 300)
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.userList[this.editedIndex], this.editedUser)
      } else {
        this.userList.push(this.editedUser)
      }
      this.close()
    }
  },

  computed: {
    // roles () {
    //   return Object.values(this.role)
    // }
  },

  mounted () {
    this.getUsers()
    // this.userList = [
    //   {
    //     id: 'Frozen Yogurt',
    //     email: 159,
    //     username: 6.0,
    //     phone: 24,
    //     role: 'operator',
    //     state: this.$t('adminPage.active')
    //   },
    //   {
    //     id: 'Froz',
    //     email: 159,
    //     username: 6.0,
    //     phone: 24,
    //     role: 'operator',
    //     state: this.$t('adminPage.active')
    //   },
    //   {
    //     id: 'Fro',
    //     email: 159,
    //     username: 6.0,
    //     phone: 24,
    //     role: 'operator',
    //     state: this.$t('adminPage.active')
    //   },
    //   {
    //     id: 'Fr',
    //     email: 159,
    //     username: 6.0,
    //     phone: 24,
    //     role: 'operator',
    //     state: this.$t('adminPage.active')
    //   },
    //   {
    //     id: 'F',
    //     email: 159,
    //     username: 6.0,
    //     phone: 24,
    //     role: 'operator',
    //     state: this.$t('adminPage.active')
    //   }
    // ]
  }
}
</script>

<style scoped>
  .main-layout {
    /*max-width: 400px;*/
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