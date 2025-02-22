import { acceptHMRUpdate, defineStore } from 'pinia'

const delay = (t: number) => new Promise(r => setTimeout(r, t))

export const useTally = defineStore('tally', {
  state: () => ({
    counter: 2,
    incrementedTimes: 0,
    decrementedTimes: 0,
    numbers: [] as number[],
  }),

  getters: {
    double: state => state.counter * 2,
  },

  actions: {
    increment(amount = 1) {
      if (typeof amount !== 'number') {
        amount = 1
      }
      this.incrementedTimes++
      this.counter += amount
    },

    changeMe() {
      console.log('change me to test HMR')
    },

    async fail() {
      const n = this.n
      await delay(1000)
      this.numbers.push(n)
      await delay(1000)
      if (this.n !== n) {
        throw new Error('Someone changed n!')
      }

      return n
    },

    async decrementToZero(interval: number = 300, usePatch = true) {
      if (this.n <= 0)
        return

      while (this.n > 0) {
        if (usePatch) {
          this.$patch({
            n: this.n - 1,
            decrementedTimes: this.decrementedTimes + 1,
          })
          // this.$patch(state => {
          //   state.n--
          //   state.decrementedTimes++
          // })
        }
        else {
          this.n -= 1
        }
        await delay(interval)
      }
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTally, import.meta.hot))
}
