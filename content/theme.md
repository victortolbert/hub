---
title: Theme
thumbnail:
url:
date: 2025-02-04
---

Theming takes a CSS-first configuration approach, you now customize your theme with CSS variables inside a `@theme` directive to define your project's custom design tokens, like fonts, colors, and breakpoints:

```css [main.css]
@import "tailwindcss";
@import "@nuxt/ui-pro";

@theme {
  --font-sans: 'Avenir Condensed', sans-serif;

  --color-skyrizi-dark-blue: #0e1d34;
  --color-skyrizi-blue: #00a3df;
  --color-skyrizi-blue-60: #66c8ec;
  --color-skyrizi-blue-30: #b2e3f5;
  --color-skyrizi-plum: #b41955;
  --color-skyrizi-slate-gray: #50535a;
  --color-skyrizi-slate-gray-55: #9fa0a4;
  --color-skyrizi-slate-gray-25: #d3d4d5;
  --color-skyrizi-gray: #e9eae8;
  --color-skyrizi-royal-blue: #004c97;
  --color-skyrizi-dark-navy-blue: #0e1d34;
  --color-skyrizi-mint-green: #6abc8d;
  --color-skyrizi-pine-green: #248a6b;
  --color-skyrizi-sandy-yellow: #f39200;
  --color-skyrizi-vermillion: #e84127;
  --color-skyrizi-fortify-green: #4dabb0;
  --color-skyrizi-motivate-blue: #0074bb;
  --color-skyrizi-advance-purple: #5f6dd1;
}
```

## Colors

| Color       | Default | Description                                                 |
| ----------- | ------- | ----------------------------------------------------------- |
| `primary`   | green   | Main brand color, used as the default color for components. |
| `secondary` | blue    | Secondary color to complement the primary color.            |
| `success`   | green   | Used for success states.                                    |
| `info`      | blue    | Used for informational states.                              |
| `warning`   | yellow  | Used for warning states.                                    |
| `error`     | red     | Used for form error validation states.                      |
| `neutral`   | slate   | Neutral color for backgrounds, text, etc.                   |
