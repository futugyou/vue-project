import { ref, watchEffect, type Ref } from 'vue'
import { marked } from 'marked'
import type { Tokenizer, MarkedExtension, Tokens, RendererThis, TokensList } from 'marked'
import mermaid from 'mermaid'

// Type definitions for the Mermaid Marked extension
interface MermaidToken extends Tokens.Generic {
    type: 'mermaid'
    code: string
}

// Configuration for the Mermaid extension
export interface MermaidConfig {
    nodeName?: string
    className?: string
}

// Default configuration
const defaultConfig: MermaidConfig = {
    nodeName: 'div',
    className: 'mermaid',
}

const generateElementId = (prefix = 'svg'): string => {
    const rand = Math.random().toString(36).substring(2, 8)
    return `${prefix}-${Date.now().toString(36)}-${rand}`
}

/**
 * Creates a Marked extension for rendering Mermaid diagrams.
 * @param config Optional configuration to customize the HTML wrapper.
 * @returns A MarkedExtension object.
 */
const createMermaidMarkedExtension = (config?: MermaidConfig): MarkedExtension => {
    const mergedConfig = { ...defaultConfig, ...config }

    // const mermaidReg = /^```mermaid\n([\s\S]*?)\n```$/
    const mermaidReg = /^```mermaid\n([\s\S]*?)\n```(?=\n|$)/;

    return {
        extensions: [{
            name: 'mermaid',
            level: 'block',
            start(this: Tokenizer, src: string) {
                const match = src.match(/^```mermaid\n/)
                return match ? match.index : -1
            },
            tokenizer(src: string, _tokens: TokensList): MermaidToken | void {
                const match = mermaidReg.exec(src)
                if (match) {
                    const code = match[1]!
                    const raw = match[0]!
                    return {
                        type: 'mermaid',
                        raw,
                        code,
                    }
                }
            },
            renderer(this: RendererThis, token: MermaidToken) {
                const mermaidToken = token as MermaidToken

                if (token.ok) {
                    return mermaidToken.html
                } else {
                    return `<${mergedConfig.nodeName} class="${mergedConfig.className}">${mermaidToken.code}</${mergedConfig.nodeName}>`
                }
            }
        }],
        async: true, // needed to tell marked to return a promise
        async walkTokens(token) {
            if (token.type === 'mermaid') {
                try {
                    const renderResult = await mermaid.render(generateElementId(), token.code)
                    token.html = renderResult?.svg
                    token.ok = true
                    return
                } catch {
                    token.html = token.code
                    token.ok = false
                }
            }
        }
    } as MarkedExtension
}

/**
 * A Vue composable to process Markdown content with Mermaid diagrams.
 * It also handles the initialization of Mermaid.js.
 *
 * @param markdownSrc A ref or string containing the markdown source.
 * @param mermaidConfig Optional configuration for the Mermaid extension.
 * @returns A ref containing the rendered HTML.
 */
export const useMarkedMermaid = (markdownSrc: Ref<string> | string, mermaidConfig?: MermaidConfig) => {
    const renderedHtml = ref('')
    const markdownRef = typeof markdownSrc === 'string' ? ref(markdownSrc) : markdownSrc

    // Initialize Mermaid.js (can be configured as needed)
    mermaid.initialize({ startOnLoad: true })

    // Create the Mermaid extension for Marked
    const mermaidExtension = createMermaidMarkedExtension(mermaidConfig)
    
    marked.use({
        async: true,
        pedantic: false,
        gfm: true,
    })
    // Use the extension with Marked
    marked.use(mermaidExtension)

    watchEffect(async () => {
        if (markdownRef.value) {
            const parsedResult = await marked.parse(markdownRef.value)
            renderedHtml.value = parsedResult
        }
    })

    return {
        renderedHtml,
    }
}