import { defineCollection, defineContentConfig } from '@nuxt/content'
import { authors, blog, content, components, issues, people } from './schema'

export default defineContentConfig({
  collections: {
    authors: defineCollection({
      type: 'data',
      source: 'authors/**.yml',
      schema: authors,
    }),

    blog: defineCollection({
      type: 'page',
      source: 'blog/**',
      schema: blog,
    }),

    components: defineCollection({
      source: 'components/**.yml',
      type: 'data',
      schema: components,
    }),

    issues: defineCollection({
      type: 'data',
      source: 'issues/**.yml',
      schema: issues,
    }),

    people: defineCollection({
      type: 'data',
      source: 'people/**.yml',
      schema: people,
    }),

    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: content,
    }),
  },
})
