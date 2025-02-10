import { z } from '@nuxt/content'

export const docs = z.object({
  framework: z.string().optional(),
  module: z.string().optional(),
  navigation: z.object({
    title: z.string().optional(),
  }),
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    to: z.string(),
    target: z.string().optional(),
  })),
})

export const blog = z.object({
  title: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  date: z.date(),
})

export const components = z.object({
  name: z.string(),
  thumbnail: z.string(),
  url: z.string(),
})

export const authors = z.object({
  name: z.string(),
  avatar: z.string(),
  url: z.string(),
})

export const people = z.object({
  name: z.string(),
  data: z.object({
    name: z.string(),
    email: z.string(),
    image: z.string(),
  }),
})

export const issues = z.object({
  issueKey: z.string(),
  summary: z.string(),
  status: z.string(),
  created: z.date(),
  updated: z.date(),
  assignee: z.string(),
  components: z.string(),
  labels: z.string(),
  sprint: z.string(),
})

export const content = z.object({
  framework: z.string().optional(),
  module: z.string().optional(),
  navigation: z.object({
    title: z.string().optional(),
  }),
  links: z.array(z.object({
    label: z.string(),
    icon: z.string(),
    avatar: z.object({
      src: z.string(),
      alt: z.string(),
    }).optional(),
    to: z.string(),
    target: z.string().optional(),
  })),
})
