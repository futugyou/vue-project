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

export const formatContent = (str: string): { format: string, formatted: string } => {
    try {
        const formatted = JSON.stringify(JSON.parse(str), null, 2)
        return { format: 'json', formatted: formatted }
    } catch { }

    try {
        const parser = new XMLParser({ ignoreAttributes: false })
        const obj = parser.parse(str)
        const builder = new XMLBuilder({ format: true, indentBy: '  ' })
        return { format: 'xml', formatted: builder.build(obj) }
    } catch { }

    try {
        const objFromYaml = yaml.load(str)
        return { format: 'yaml', formatted: yaml.dump(objFromYaml, { noRefs: true }) }
    } catch { }

    return { format: 'unknown', formatted: str }
}
