<!--  A catch-all page to fetch contents based on route path. -->
<script lang="ts" setup>
const props = defineProps<{
  title?: string
}>()

definePageMeta({
  title: 'Catch all page',
  layout: 'default',
})

const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('content').path(route.path).first()
})

function enableCustomLayout() {
  setPageLayout('catalog')
}

const open = ref(false)

defineShortcuts({
  o: () => open.value = !open.value,
})

const menu = ref([{
  label: 'Profile',
  icon: 'i-lucide-user',
}, {
  label: 'Billing',
  icon: 'i-lucide-credit-card',
}, {
  label: 'Settings',
  icon: 'i-lucide-cog',
}])

const items = ref([
  {
    label: 'Home',
    to: '/',
  },
  {
    label: 'Guide',
    to: '/guide',
  },
  {
    label: 'Theme',
    to: '/theme',
  },
  {
    label: 'Icons',
    to: '/icons',
  },
  {
    label: 'Templates',
    to: '/templates',
  },
  {
    label: 'Layout',
    to: '/layout',
  },
  {
    label: 'Components',
    to: '/components',
  },
  {
    label: 'Examples',
    to: '/examples',
  },
  // {
  //   label: 'Typography',
  //   to: '/typography',
  // },
  // {
  //   label: 'Blog',
  //   to: '/blog',
  // },
])
</script>

<template>
  <UContainer>
    <header>
      <UBreadcrumb :items="items">
        <template #separator>
          <span class="mx-2 text-[var(--ui-text-muted)]">•</span>
        </template>
      </UBreadcrumb>
    </header>

    <div class="w-full">
      <section v-if="page" class="w-full mt-8 max-w-[65ch]">
        <ContentRenderer :value="page" />
      </section>

      <section v-else class="mt-8 p-8 w-full m-auto">
        <!-- Page not found -->
        <BeforeAfter />

        <!-- <TwentyTwenty
          class="w-full"
          before="//dummyimage.com/1024x768/E8117F/FFFFFF?text=Before"
          after="//dummyimage.com/1024x768/CCCCCC/FFFFFF?text=After"
        /> -->
        <!-- <pre>{{ theAuthor }}</pre> -->
        <!-- <button>
          <UIcon name="" class="animate-bounce animate" />
        </button> -->

        <!-- [state=open]:text-[var(--ui-text-highlighted)]  -->
        <!-- [state=open]:rotate-180  -->

        <!-- <UDropdownMenu v-model:open="open" :items="menu" :ui="{ content: 'w-48' }">
          <UButton
            label="Open"
            color="neutral"
            variant="outline"
            :trailing-icon="open ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
            :ui="{
              trailingIcon: '',
            }"
          />
        </UDropdownMenu> -->

        <!-- <div class="py-[calc(--spacing(4)-1px)]">
          <UButton @click="enableCustomLayout">
            Update layout
          </UButton>
        </div> -->
      </section>
    </div>
  </UContainer>
</template>
