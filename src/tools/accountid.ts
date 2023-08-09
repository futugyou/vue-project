
export const defaultAccountId = () => {
    let account = JSON.parse(localStorage.getItem('defaultAccount') ?? '{}')
    if (account.id != undefined && account.id != "") {
        return account.id as string
    }

    return "aws-account-id-magic-code"
}