export const ValidateManager = () => {
    const inputRefs: Record<string, any> = {}

    const fieldRequiredCheck = (value: any, fieldName: string) => {
        return !!value || `${fieldName} field is required`
    }

    const fieldMaxLengthCheck = (value: any, fieldName: string, length: number) => {
        return !!value && value.length <= length || `${fieldName} field must be less than ${length} characters`
    }

    const fieldMinLengthCheck = (value: any, fieldName: string, length: number) => {
        return !!value && value.length >= length || `${fieldName} field must be greater than ${length} characters`
    }

    const commonRules = {
        Required: (title: string) => [
            (value: string) => fieldRequiredCheck(value, title),
        ],
        RequiredMin: (title: string, min: number) => [
            (value: string) => fieldRequiredCheck(value, title),
            (value: string) => fieldMinLengthCheck(value, title, min),
        ],
        RequiredMax: (title: string, max: number) => [
            (value: string) => fieldRequiredCheck(value, title),
            (value: string) => fieldMaxLengthCheck(value, title, max),
        ],
        RequiredMinMax: (title: string, min: number, max: number) => [
            (value: string) => fieldRequiredCheck(value, title),
            (value: string) => fieldMinLengthCheck(value, title, min),
            (value: string) => fieldMaxLengthCheck(value, title, max),
        ],
    }

    const setInputRef = (el: any, key: string) => {
        if (el) {
            inputRefs[key] = el
        }
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

    return { setInputRef, validateInputs, clearInputs, commonRules }
}
