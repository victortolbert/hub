<script setup>
useSeoMeta({
  title: 'Hub',
  description: '',
})
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <div>
      <NuxtPage />
    </div>
  </div>
</template>
