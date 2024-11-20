import { Directive, DirectiveBinding, inject } from 'vue'
import { ValidateManager } from '@/tools/validate'

type ValidateManagerType = ReturnType<typeof ValidateManager>
export const validateDirective: Directive = {
    beforeMount(el, binding, vnode) {
        const { value } = binding
        const { manager, id, title, options }: { manager: ValidateManagerType, id: string, title: string, options: any } = value
        if (!manager) {
            console.warn('ValidateManager is not provided.')
            return
        }

        // not work
        // el.rules = manager.createRule(title, options)
        // el.ref = (e: any) => manager.setInputRef(e, id)
    },
    mounted(el: HTMLElement, binding: DirectiveBinding) {

    },
}