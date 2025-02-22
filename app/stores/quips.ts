import { acceptHMRUpdate, defineStore } from 'pinia'
import { ref, unref } from 'vue'
import type { Joke } from '../api/jokes'
import { getRandomJoke } from '../api/jokes'

export const useQuip = defineStore('quip', {
  state: () => ({
    current: null as null | Joke,
    jokes: [] as Joke[],
    // hello: true,
  }),
  actions: {
    async fetchJoke() {
      if (
        this.current
        // if the request below fails, avoid adding it twice
        && !this.jokes.includes(this.current)
      ) {
        this.jokes.push(this.current)
      }

      // NOTE: Avoid patching an object because it's recursive
      // this.$patch({ current: await getRandomJoke() })
      this.current = await getRandomJoke()
    },
  },
})

export const useQuipSetup = defineStore('jokes-setup', () => {
  const current = ref<null | Joke>(null)
  const history = ref<Joke[]>([])

  async function fetchJoke() {
    const cur = unref(current.value)
    if (
      cur
      // if the request below fails, avoid adding it twice
      && !history.value.find(joke => joke.id === cur.id)
    ) {
      history.value.push(cur)
    }

    current.value = await getRandomJoke()
    return current.value
  }

  return { current, history, fetchJoke }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useQuip, import.meta.hot))
  // import.meta.hot.accept(acceptHMRUpdate(useQuipSetup, import.meta.hot))
}
