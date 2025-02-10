// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // Your custom configs here
  {
    ignores: [
      '**/fixtures',
      '**/public',
      '**/.obsidian',
    ],
  },
).overrideRules({
  'vue/no-v-html': 'off',
  'vue/require-prop-types': 'off',
  'vue/no-unused-vars': 'off',
  'vue/max-attributes-per-line': ['warn', { singleline: 3 }],
  '@typescript-eslint/no-explicit-any': 'off',
  '@typescript-eslint/no-unused-vars': 'off',
  '@typescript-eslint/no-extraneous-class': 'off',
  '@typescript-eslint/no-empty-object-type': 'off',
  'no-console': 'off',
  'format/prettier': 'off',
  'unused-imports/no-unused-vars': 'off',
  'regexp/no-super-linear-backtracking': ['error', {
    report: 'certain',
  }],
})
