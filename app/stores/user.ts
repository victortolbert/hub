import { defineStore } from 'pinia'

interface State {
  name: string
  isAdmin: boolean
  userList: UserInfo[]
  user: UserInfo | null
  firstName: string
  lastName: string
  userId: number | null
}

export const useUserStore = defineStore('user', {
  state: (): State => ({
    name: 'Eduardo',
    isAdmin: true,
    // for initially empty lists
    userList: [] as UserInfo[],
    // for data that is not yet loaded
    user: null as UserInfo | null,
    firstName: '',
    lastName: '',
    userId: null,
  }),

  actions: {
    async registerUser(login, password) {
      try {
        // this.userData = await api.post({ login, password })
        // showTooltip(`Welcome back ${this.userData.name}!`)
      }
      catch (error) {
        // showTooltip(error)
        // let the form component display the error
        return error
      }
    },

    /**
     * Attempt to login a user
     */
    async login(user: string, password: string) {
      const userData = await apiLogin(user, password)

      this.$patch({
        name: user,
        ...userData,
      })
    },
    logout() {
      this.$patch({
        name: '',
        isAdmin: false,
      })

      // we could do other stuff like redirecting the user
    },

    // no context as first argument, use `this` instead
    async loadUser(id: number) {
      if (this.userId !== null)
        throw new Error('Already logged in')
      // const res = await api.user.load(id)
      // this.updateUser(res)
    },

    // mutations can now become actions, instead of `state` as first argument use `this`
    updateUser(payload) {
      this.firstName = payload.firstName
      this.lastName = payload.lastName
      this.userId = payload.userId
    },

    // easily reset state using `$reset`
    clearUser() {
      this.$reset()
    },
  },

  getters: {
    test(state) {
      return state.name.toUpperCase()
    },

    // firstName getter removed, no longer needed
    fullName: state => `${state.firstName} ${state.lastName}`,

    loggedIn: state => state.userId !== null,

    // must define return type because of using `this`
    // fullUserDetails (state): FullUserDetails {
    //   // import from other stores
    //   const authPreferencesStore = useAuthPreferencesStore()
    //   const authEmailStore = useAuthEmailStore()
    //   return {
    //     ...state,
    //     // other getters now on `this`
    //     fullName: this.fullName,
    //     ...authPreferencesStore.$state,
    //     ...authEmailStore.details
    //   }

    // alternative if other modules are still in Vuex
    // return {
    //   ...state,
    //   fullName: this.fullName,
    //   ...vuexStore.state.auth.preferences,
    //   ...vuexStore.getters['auth/email'].details
    // }

    // getUserById: (state) => {
    //   return (userId: number) => state.userList.find(user => user.id === userId)
    // },

    // getActiveUserById(state) {
    //   const activeUsers = state.userList.filter(user => user.active)
    //   return (userId: number) => activeUsers.find(user => user.id === userId)
    // },
  },
})

export type UserStore = ReturnType<typeof useUserStore>

// let a: WrapStoreWithId<UserStore>

/**
 * Simulate a login
 */
function apiLogin(a: string, p: string) {
  if (a === 'ed' && p === 'ed')
    return Promise.resolve({ isAdmin: true })
  if (p === 'ed')
    return Promise.resolve({ isAdmin: false })
  return Promise.reject(new Error('invalid credentials'))
}

export function logout() {
  const store = useUserStore()

  store.login('e', 'e').then(() => {})

  store.$patch({
    name: '',
    isAdmin: false,
  })

  // we could do other stuff like redirecting the user
}

interface UserInfo {
  id: number
  name: string
  age: number
  active: boolean
}
