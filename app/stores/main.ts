import { acceptHMRUpdate, defineStore } from 'pinia'

const delay = (t: number) => new Promise(r => setTimeout(r, t))
// just to ignore the not used error
delay(0)

// main is the name of the store. It is unique across your application
// and will appear in devtools
export const useMainStore = defineStore('main', {
  // State: Holds the reactive data (count).
  // a function that returns a fresh state
  state: () => {
    return {
      counter: 0,
      name: 'Eduardo',
      isAdmin: true,
      items: ['a', 'b', 'c'],
      hasChanged: false,
    }
  },

  // Getters: Computed properties derived from the state (doubleCount).
  getters: {
    // getters receive the state as first parameter
    doubleCounter: state => state.counter * 2,

    // use getters in other getters
    doublePlusOne(): number {
      return this.doubleCounter + 1
    },
  },

  // Actions: Methods to modify the state (increment, incrementBy).
  actions: {
    increment(amount = 1) {
      if (typeof amount !== 'number') {
        amount = 1
      }
      // this.incrementedTimes++
      this.counter += amount
    },

    randomizeCounter() {
      this.counter = Math.round(100 * Math.random())
    },
    reset() {
      this.counter = 0
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMainStore, import.meta.hot))
}
