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
              @click="editUser(props.item)"
              color="primary"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteUser(props.item)"
              color="error"
            >
              cancel
            </v-icon>
          </td>
        </template>
      </v-data-table>
    </v-layout>    
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
      userList: [],
      pageSize: 20,
      editedIndex: -1,
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
        deleted: this.$t('adminPage.deleted')
      }
    }
  },
  methods: {
    async getUsers () {
      try {
        // let userResponse
        let getUsersResponse = await axios({
          method: 'get',
          url: httpCfg.backendURL + '/api/v1/users?offset=' + 0 + '&limit=' + 2,
          headers: {'authorization': this.$store.getters['user/accessToken']},
          validateStatus: function (status) {
            return status === 200 || status === 400
          }
        })

        if (getUsersResponse.status === 200) {
          for (let i = 0; i < this.pageSize; i++) {
            this.userList.push({
              id: getUsersResponse.data.data.id,
              email: getUsersResponse.data.data.email,
              username: getUsersResponse.data.data.username,
              phone: getUsersResponse.data.data.phone,
              role: getUsersResponse.data.data.isAdmin ? this.role.admin : this.role.operator,
              state: this.state[getUsersResponse.data.data.state]
            })
            // this.userList[i].id = getUsersResponse.data.data.id
            // this.userList[i].email = getUsersResponse.data.data.email
            // this.userList[i].username = getUsersResponse.data.data.username
            // this.userList[i].phone = getUsersResponse.data.data.phone
            // this.userList[i].state = getUsersResponse.data.data.state
            // this.userList[i].role = getUsersResponse.data.data.isAdmin ? role.admin : role.operator
            // getUsersResponse.data.data
          }
          // this.userList.concat(getUsersResponse.data.data)
          return
        }

        this.$nuxt.error({ statusCode: 500, responses: getUsersResponse })
      } catch (error) {
        this.$nuxt.error({ statusCode: 500, error })
      }
    },

    editUser (user) {
      this.editedIndex = this.userList.indexOf(user)
      this.editedUser = Object.assign({}, user)
      this.dialog = true
    },

    deleteUser (user) {
      const index = this.userList.indexOf(user)
      confirm('Are you sure you want to delete this user?') && this.userList.splice(index, 1)
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