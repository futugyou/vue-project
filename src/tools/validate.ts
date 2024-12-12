export const ValidateManager = () => {
    const inputRefs: Record<string, any> = {}

    const requiredRule = (value: any, fieldName: string) => {
        return !!value || `${fieldName} field is required`
    }

    const maxRule = (value: any, fieldName: string, length: number) => {
        return !!value && value.length <= length || `${fieldName} field must be less than ${length} characters`
    }

    const minRule = (value: any, fieldName: string, length: number) => {
        return !!value && value.length >= length || `${fieldName} field must be greater than ${length} characters`
    }

    const commonRules = {
        Required: (title: string) => [
            (value: string) => requiredRule(value, title),
        ],
        RequiredMin: (title: string, min: number) => [
            (value: string) => requiredRule(value, title),
            (value: string) => minRule(value, title, min),
        ],
        RequiredMax: (title: string, max: number) => [
            (value: string) => requiredRule(value, title),
            (value: string) => maxRule(value, title, max),
        ],
        RequiredMinMax: (title: string, min: number, max: number) => [
            (value: string) => requiredRule(value, title),
            (value: string) => minRule(value, title, min),
            (value: string) => maxRule(value, title, max),
        ],
    }

    const setInputRef = (el: any, key: string) => {
        if (el) {
            inputRefs[key] = el
        } else {
            delete inputRefs[key]
        }
    }

    const removeInputRef = (key: string) => {
        delete inputRefs[key]
    }

    const validateInputs = async (): Promise<string[]> => {
        let validateMsg: string[] = []
        for (const key in inputRefs) {
            const input = inputRefs[key]
            if (input) {
                const message: string[] = await input.validate(false)
                if (message && message.length > 0) {
                    validateMsg = [...validateMsg, ...message]
                }
            }
        }
        return validateMsg
    }

    const clearInputs = () => {
        for (const key in inputRefs) {
            delete inputRefs[key]
        }
    }

    const createRule = (title: string, { min, max, required }: { min?: number; max?: number; required?: boolean }) => {
        const rules: ((value: string) => string | boolean)[] = []
        if (required) rules.push((value) => requiredRule(value, title))
        if (min !== undefined) rules.push((value) => minRule(value, title, min))
        if (max !== undefined) rules.push((value) => maxRule(value, title, max))
        return rules
    }

    return {
        removeInputRef,
        setInputRef,
        validateInputs,
        clearInputs,
        commonRules,
        required: commonRules.Required,
        requiredMin: commonRules.RequiredMin,
        requiredMax: commonRules.RequiredMax,
        requiredMinMax: commonRules.RequiredMinMax,
        createRule
    }
}

export type ValidateManagerType = ReturnType<typeof ValidateManager>
