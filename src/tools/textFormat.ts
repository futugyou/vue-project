import yaml from 'js-yaml'
import { XMLParser, XMLBuilder } from 'fast-xml-parser'

export const detectFormat = (str: string): 'json' | 'yaml' | 'xml' | 'unknown' => {
    try {
        JSON.parse(str)
        return 'json'
    } catch { }

    try {
        yaml.load(str)
        return 'yaml'
    } catch { }

    const parser = new XMLParser({ ignoreAttributes: false })
    try {
        parser.parse(str)
        return 'xml'
    } catch { }

    return 'unknown'
}

const isLikelyJsonStructure = (obj: unknown): boolean => {
    return typeof obj === 'object' && obj !== null
}

export const formatContent = (str: string): { format: string, formatted: string } => {
    if (str == "") {
        return { format: 'unknown', formatted: str }
    }

    try {
        const parsed = JSON.parse(str)
        if (isLikelyJsonStructure(parsed)) {
            const formatted = JSON.stringify(parsed, null, 2)
            if (formatted != "") {
                return { format: 'json', formatted: formatted }
            }
        }
    } catch { }

    try {
        const parser = new XMLParser({ ignoreAttributes: false, trimValues: true, })
        const obj = parser.parse(str)
        const keys = Object.keys(obj)
        const hasSingleRoot = keys.length === 1 && typeof obj[keys[0]] === 'object'
        const looksLikeXML = str.trim().startsWith('<') && str.trim().endsWith('>') && hasSingleRoot
        if (looksLikeXML) {
            const builder = new XMLBuilder({
                ignoreAttributes: false,
                format: true,
                indentBy: '  ',
                attributesGroupName: false,
            })

            const formatted = builder.build(obj)
            if (formatted != "") {
                return { format: 'xml', formatted: formatted }
            }
        }
    } catch { }

    try {
        const parsed = yaml.load(str)
        if (isLikelyJsonStructure(parsed)) {
            const formatted = yaml.dump(parsed, { noRefs: true })
            if (formatted != "") {
                return { format: 'yaml', formatted: formatted }
            }
        }
    } catch { }

    return { format: 'unknown', formatted: str }
}
