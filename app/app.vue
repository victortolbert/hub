<script setup>
// Modern, Beautiful, Awesome, Better
const { menu } = useUiStore()
const { getImages } = useFile()

const title = 'Hub'
const description = 'A Nuxt template to build your full-stack image gallery application on the edge.'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogSiteName: 'NuxtHub image gallery template',
  ogImage: 'https://image-gallery.nuxt.dev/social-card.png',
  twitterCard: 'summary_large_image',
})

await getImages()
</script>

<template>
  <u-app class="w-full">
    <nuxt-layout>
      <div
        class="min-h-[100dvh] overflow-x-auto relative"
        :class="{
          'flex flex-col md:block': $router.currentRoute.value.fullPath !== '/examples/image-gallery',
        }"
      >
        <nuxt-route-announcer />
        <nuxt-loading-indicator />
        <div class="flex w-full gap-16">
          <main class="flex-1">
            <nuxt-page />
          </main>
          <!-- <ImageThumbnailList
            :class="$router.currentRoute.value.fullPath !== '/examples/image-gallery'
              ? 'opacity-100 z-[9999]'
              : 'opacity-0 z-[-1]'"
          /> -->
        </div>
      </div>
    </nuxt-layout>
  </u-app>
</template>
