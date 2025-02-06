<script setup>
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
  <UApp>
    <div
      class="bg-black min-h-[100dvh] overflow-x-auto relative"
      :class="{
        'flex flex-col md:block': $router.currentRoute.value.fullPath !== '/',
      }"
    >
      <NuxtRouteAnnouncer />

      <NuxtLoadingIndicator />

      <div>
        <NuxtPage />

        <ImageThumbnailList
          :class="$router.currentRoute.value.fullPath !== '/'
            ? 'opacity-100 z-[9999]'
            : 'opacity-0 z-[-1]'"
        />
      </div>
    </div>
  </UApp>
</template>
