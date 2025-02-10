<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { menu } = useUiStore()
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <!-- <aside class="fixed min-w-64 border-r border-[var(--ui-border)]"> -->
            <!-- <u-content-navigation :navigation="navigation" highlight /> -->
            <u-navigation-menu
              highlight
              color="neutral"
              orientation="vertical"
              :items="[
                {
                  label: 'Guide',
                  icon: 'i-lucide-book-open',
                  to: '/guide',
                },
                {
                  label: 'Jira Issues',
                  icon: 'i-lucide-book-open',
                  to: '/issues',
                },
              ]"
              class="data-[orientation=horizontal]:border-b border-[var(--ui-border)] data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-48"
            />
            <color-mode-button />
          <!-- </aside> -->

            <!-- <template #top>
              <div class="flex flex-col gap-2 w-[calc(100%+1.25rem)] -mx-2.5">
                <FrameworkSelect />
                <ModuleSelect />
              </div>
            </template> -->

            <!-- <UContentNavigation :navigation="navigation" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }">
              <template #link-title="{ link }">
                <span class="inline-flex items-center gap-0.5">
                  {{ link.title }}

                  <sup v-if="link.module === 'ui-pro'" class="text-[8px] font-medium text-(--ui-primary)">PRO</sup>
                </span>
              </template>
            </UContentNavigation> -->
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
