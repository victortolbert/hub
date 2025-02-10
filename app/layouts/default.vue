<template>
  <div>
    <!-- <hub-header /> -->
    <slot />
  </div>
</template>

<style>
:root {
  --ui-container: var(--container-7xl);
  --brand-color: #006;
  /* --default-font-family: 'Avenir Condensed', 'Avenir Next Condensed', sans-serif; */

  --space-1: 2px;
  --space-2: 4px;
  --space-3: 8px;
  --space-4: 12px;
  --space-5: 16px;
  --space-6: 20px;
  --space-7: 28px;
  --space-8: 32px;
  --space-9: 64px;
  --space-10: 72px;
  --radius-0: 2px;
  --radius-1: 4px;
  --radius-2: 6px;
  --radius-3: 9px;
  --radius-4: 11px;

  --layer-background: 100;
  --layer-grid: 150;
  --layer-canvas: 200;
  --layer-shapes: 300;
  --layer-overlays: 400;
  --layer-following-indicator: 1000;

  --primary: #193052;
  --secondary: #193052;
  --humira: #95004d;
  --quaternary: #95004d;

  --skyrizi-blue: #00a3df;
  --skyrizi-blue-60: #66c8ec;
  --skyrizi-blue-30: #b2e3f5;
  --skyrizi-plum: #b41955;
  --skyrizi-slate-gray: #50535a;
  --skyrizi-slate-gray-55: #9fa0a4;
  --skyrizi-slate-gray-25: #d3d4d5;
  --skyrizi-gray: #e9eae8;
  --skyrizi-royal-blue: #004c97;
  --skyrizi-dark-navy-blue: #0e1d34;
  --skyrizi-mint-green: #6abc8d;
  --skyrizi-pine-green: #248a6b;
  --skyrizi-sandy-yellow: #f39200;
  --skyrizi-vermillion: #e84127;
  --skyrizi-fortify-green: #4dabb0;
  --skyrizi-motivate-blue: #0074bb;
  --skyrizi-advance-purple: #5f6dd1;

  --white: #fff;
  --black: #000;
  --orange: #e87200;
  --merlot: #a8224f;
  --dk-merlot: #7c0435;
  --lt-gray: #5e5e5e;
  --gray: #dbdada;
  --slate: #6d6e70;
  --font-sans: 'AvenirNext-Regular';
  --font-sans-condensed: 'Avenir Condensed';
  --font-regular: 400;
  --font-medium: 500;
  --font-demibold: 600;
  --font-bold: 700;

  --tabs-header-background: #d9d9d9;
  --tabs-header-border-radius: 4px;
  --tabs-header-height: 35px;
  --rounded-full: 9999px;

  --button-text-color: white;
  --button-font-size: 12px;
  --button-font-weight: 700;

  --header-height: 52px;

  --shiki-foreground: #eeeeee;
  --shiki-background: #333333;
  --shiki-token-constant: #660000;
  --shiki-token-string: #770000;
  --shiki-token-comment: #880000;
  --shiki-token-keyword: #990000;
  --shiki-token-parameter: #aa0000;
  --shiki-token-function: #bb0000;
  --shiki-token-string-expression: #cc0000;
  --shiki-token-punctuation: #dd0000;
  --shiki-token-link: #ee0000;

  /* Only required if using lang: 'ansi' */
  --shiki-ansi-black: #000000;
  --shiki-ansi-black-dim: #00000080;
  --shiki-ansi-red: #bb0000;
  --shiki-ansi-red-dim: #bb000080;
  --shiki-ansi-green: #00bb00;
  --shiki-ansi-green-dim: #00bb0080;
  --shiki-ansi-yellow: #bbbb00;
  --shiki-ansi-yellow-dim: #bbbb0080;
  --shiki-ansi-blue: #0000bb;
  --shiki-ansi-blue-dim: #0000bb80;
  --shiki-ansi-magenta: #ff00ff;
  --shiki-ansi-magenta-dim: #ff00ff80;
  --shiki-ansi-cyan: #00bbbb;
  --shiki-ansi-cyan-dim: #00bbbb80;
  --shiki-ansi-white: #eeeeee;
  --shiki-ansi-white-dim: #eeeeee80;
  --shiki-ansi-bright-black: #555555;
  --shiki-ansi-bright-black-dim: #55555580;
  --shiki-ansi-bright-red: #ff5555;
  --shiki-ansi-bright-red-dim: #ff555580;
  --shiki-ansi-bright-green: #00ff00;
  --shiki-ansi-bright-green-dim: #00ff0080;
  --shiki-ansi-bright-yellow: #ffff55;
  --shiki-ansi-bright-yellow-dim: #ffff5580;
  --shiki-ansi-bright-blue: #5555ff;
  --shiki-ansi-bright-blue-dim: #5555ff80;
  --shiki-ansi-bright-magenta: #ff55ff;
  --shiki-ansi-bright-magenta-dim: #ff55ff80;
  --shiki-ansi-bright-cyan: #55ffff;
  --shiki-ansi-bright-cyan-dim: #55ffff80;
  --shiki-ansi-bright-white: #ffffff;
  --shiki-ansi-bright-white-dim: #ffffff80;

  /* --ui-container: var(--container-5xl); */
  /* --ui-radius: var(--radius-sm); */

  /* --ui-text-dimmed: var(--ui-color-neutral-400); */
  /* --ui-text-muted: var(--ui-color-neutral-500); */
  /* --ui-text-toned: var(--ui-color-neutral-600); */
  /* --ui-text: var(--ui-color-neutral-700); */
  /* --ui-text-highlighted: var(--ui-color-neutral-900); */

  /* --ui-bg: var(--color-white); */
  /* --ui-bg-muted: var(--ui-color-neutral-50); */
  /* --ui-bg-elevated: var(--ui-color-neutral-100); */
  /* --ui-bg-accented: var(--ui-color-neutral-200); */
  /* --ui-bg-inverted: var(--ui-color-neutral-900); */

  /* --ui-border: var(--ui-color-neutral-200); */
  /* --ui-border-muted: var(--ui-color-neutral-200); */
  /* --ui-border-accented: var(--ui-color-neutral-300); */
  /* --ui-border-inverted: var(--ui-color-neutral-900); */
}

html {
  scrollbar-gutter: stable;
  scrollbar-gutter: stable both-edges;
}

html {
  overflow-y: scroll;
  scrollbar-gutter: stable;
  tab-size: 2;
}

#__nuxt {
  height: 100vh;
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}
.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}

.page-enter-active,
.page-leave-active {
  transition: all 0.2s;
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(5px);
}

.rotate-enter-active,
.rotate-leave-active {
  transition: all 0.4s;
}
.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate3d(1, 1, 1, 15deg);
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
.animate-text-slide {
  animation: text-slide 15s cubic-bezier(0.83, 0, 0.17, 1) infinite;
}

@keyframes text-slide {
  0%,
  100% {
    transform: translateY(0%);
  }

  16% {
    transform: translateY(-16.66%);
  }

  32% {
    transform: translateY(-33.33%);
  }

  48% {
    transform: translateY(-50%);
  }

  64% {
    transform: translateY(-66.66%);
  }

  80% {
    transform: translateY(-83.33%);
  }
}

.is-invalid {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

.swing {
  transition: all 0.75s ease;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
