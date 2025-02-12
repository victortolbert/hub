<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'

const fetcher = async () =>
  await fetch('/data/examples.json').then(response =>
    response.json(),
  )

const { data, suspense } = useQuery({ queryKey: ['test'], queryFn: fetcher })

await suspense()
</script>

<template>
  <div>
    <pre>{{ data }}</pre>
  </div>
</template>
