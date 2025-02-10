/**
 * Jira notation reference
 * https://jira.atlassian.com/secure/WikiRendererHelpAction.jspa?section=all
 *
 * Markdown reference
 * https://www.markdownguide.org/basic-syntax/
 *
 */

/**
 * Types for the converter options and results
 */
interface ConverterOptions {
  preserveNewlines?: boolean
  removeEmptyLines?: boolean
}

interface ConversionResult {
  content: string
  warnings?: string[]
}

/**
 * Composable for converting between Jira markup and Markdown
 * @param options Optional configuration for the converter
 * @returns Object with conversion methods
 */
export function useJiraMarkdownConverter(options: ConverterOptions = {}) {
  const warnings: string[] = []

  /**
   * Converts Jira markup to Markdown
   * @param input Jira formatted text
   * @returns Markdown formatted text with any conversion warnings
   */
  const toMarkdown = (input: string): ConversionResult => {
    if (!input)
      return { content: '', warnings: [] }

    let result = input
    warnings.length = 0 // Reset warnings

    // Convert blockquotes
    result = result.replace(/^bq\.(.*)$/gm, '> $1\n')

    // Convert emphasis marks (* and _)
    result = result.replace(/([*_])(.*?)\1/g, (_match, wrapper, content) => {
      const to = wrapper === '*' ? '**' : '*'
      return `${to}${content}${to}`
    })

    // Convert multi-level lists
    result = result.replace(/^([#\-+*]+) (.*)$/gm, (_match, level, content) => {
      const len = level.length > 1 ? (level.length - 1) * 4 + 2 : 2
      const prefix = level[level.length - 1] === '#' ? '1.' : '-'
      return `${' '.repeat(len - 2) + prefix} ${content}`
    })

    // Convert headers (h1. to h6.)
    result = result.replace(/^h([0-6])\.(.*)$/gm, (_match, level, content) => {
      return '#'.repeat(Number.parseInt(level)) + content
    })

    // Convert code blocks and inline code
    result = result.replace(/\{code:([a-z]+)\}([\s\S]*?)\{code\}/g, '```$1\n$2\n```')
    result = result.replace(/\{code\}([\s\S]*?)\{code\}/g, '```\n$1\n```')
    result = result.replace(/\{\{([^}]+)\}\}/g, '`$1`')

    // Convert text effects
    result = result.replace(/\?\?((?:[^?]|\\.)+)\?\?/g, '<cite>$1</cite>')
    result = result.replace(/\+([^+]*)\+/g, '<ins>$1</ins>')
    result = result.replace(/\^([^^]*)\^/g, '<sup>$1</sup>')
    result = result.replace(/~([^~]*)~/g, '<sub>$1</sub>')
    result = result.replace(/-([^-]*)-/g, '~~$1~~')

    // Convert quotes
    result = result.replace(/\{quote\}([\s\S]*?)\{quote\}/g, (_match, content) => {
      return content.split(/\r?\n/g)
        .map((line: string) => `> ${line}`)
        .join('\n')
    })

    // Convert images
    result = result.replace(/!([^|\s]+)\|([^\n!]*)alt=([^\n!,]+)(,([^\n!]*))?!/g, '![$3]($1)')
    result = result.replace(/!([^|\s]+)\|([^\n!]*)!/g, '![]($1)')
    result = result.replace(/!([^\s!]+)!/g, '![]($1)')

    // Convert links
    result = result.replace(/\[([^|]+)\|(.+?)\]/g, '[$1]($2)')
    result = result.replace(/\[(.+?)\]([^(]+)/g, '<$1>$2')

    // Convert tables
    const lines: string[] = result.split(/\r?\n/)
    const processedLines: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      const headerSeparators = line.match(/\|\|/g)

      if (headerSeparators) {
        const processedLine = line.replace(/\|\|/g, '|')
        processedLines.push(processedLine)

        // Add header separator line
        const headerLine = `|${'---|'.repeat(headerSeparators.length - 1)}`
        processedLines.push(headerLine)
      }
      else {
        processedLines.push(line)
      }
    }

    result = processedLines.join('\n')

    // Handle options
    if (!options.preserveNewlines) {
      result = result.replace(/\n{3,}/g, '\n\n')
    }

    if (options.removeEmptyLines) {
      result = result.replace(/^\s*[\r\n]/gm, '')
    }

    return { content: result, warnings }
  }

  /**
   * Converts Markdown to Jira markup
   * @param input Markdown formatted text
   * @returns Jira formatted text with any conversion warnings
   */
  const toJira = (input: string): ConversionResult => {
    if (!input)
      return { content: '', warnings: [] }

    let result = input
    warnings.length = 0 // Reset warnings

    // Store code blocks to prevent processing their contents
    const codeBlocks: { [key: string]: string } = {}
    let codeBlockCounter = 0

    // Extract code blocks
    result = result.replace(/```(\w+)?\n([\s\S]+?)```/g, (_match, lang, code) => {
      const placeholder = `__CODE_BLOCK_${codeBlockCounter}__`
      codeBlocks[placeholder] = `{code${lang ? `:${lang}` : ''}}${code}\{code\}`
      codeBlockCounter++
      return placeholder
    })

    // Convert headers
    result = result.replace(/^(#{1,6})([^\n]*)$/gm, (_match, level, content) => {
      return `h${level.length}.${content.trimLeft()}`
    })

    // Convert emphasis
    result = result.replace(/(\*\*|__)(.*?)\1/g, (_match, _wrapper, content) => `*${
      content
    }*`)
    result = result.replace(/(\*|_)(.*?)\1/g, (_match, _wrapper, content) => `_${
      content
    }_`)

    // Convert lists
    result = result.replace(/^(\s*)-\s+(\S.*)$/gm, (_match, space, content) => {
      const level = Math.floor(space.length / 2) || 1
      return `${'*'.repeat(level)} ${content}`
    })

    result = result.replace(/^(\s*)(\d+)\.\s+(\S.*)$/gm, (_match, space, _num, content) => {
      const level = Math.floor(space.length / 2) || 1
      return `${'#'.repeat(level)} ${content}`
    })

    // Convert blockquotes
    result = result.replace(/^>\s+(\S.*)$/gm, 'bq. $1')

    // Convert inline code
    result = result.replace(/`([^`]+)`/g, '{{$1}}')

    // Convert links
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '[$1|$2]')

    // Convert images
    result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      return alt ? `!${src}|alt=${alt}!` : `!${src}!`
    })

    // Convert tables
    const lines: string[] = result.split('\n')
    const processedLines: string[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.match(/^\|.*\|$/)) {
        // Skip separator lines (---|---|...)
        if (!line.match(/^\|-+\|$/)) {
          processedLines.push(line.replace(/\|/g, '||'))
        }
      }
      else {
        processedLines.push(line)
      }
    }

    result = processedLines.join('\n')

    // Restore code blocks
    Object.entries(codeBlocks).forEach(([placeholder, code]) => {
      result = result.replace(placeholder, code)
    })

    // Handle options
    if (!options.preserveNewlines) {
      result = result.replace(/\n{3,}/g, '\n\n')
    }

    if (options.removeEmptyLines) {
      result = result.replace(/^\s*[\r\n]/gm, '')
    }

    return { content: result, warnings }
  }

  return {
    toMarkdown,
    toJira,
  }
}

// Example usage in a Vue component:
/*
<script setup lang="ts">
import { ref } from 'vue'
import { useJiraMarkdownConverter } from '~/composables/useJiraMarkdownConverter'

const { toMarkdown, toJira } = useJiraMarkdownConverter({
  preserveNewlines: true,
  removeEmptyLines: false
})

const jiraText = ref('')
const markdownText = ref('')

const convertToMarkdown = () => {
  const { content, warnings } = toMarkdown(jiraText.value)
  markdownText.value = content
  if (warnings.length) {
    console.warn('Conversion warnings:', warnings)
  }
}

const convertToJira = () => {
  const { content, warnings } = toJira(markdownText.value)
  jiraText.value = content
  if (warnings.length) {
    console.warn('Conversion warnings:', warnings)
  }
}
</script>
*/
