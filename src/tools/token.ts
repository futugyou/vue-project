export const getToken = () => {
    let token = ''

    if (window.__MICRO_APP_ENVIRONMENT__) {
        const data = window.microApp?.getData()
        if (data?.Authorization) {
            token = data.Authorization
        }
    } else {
        // TODO: no mirco sub app env
        token = localStorage.getItem('faketoken') ?? ""
    }

    return token
}

export const logout = () => {
    if (window.__MICRO_APP_ENVIRONMENT__) {
        window.microApp.dispatch({
            Logout: true,
            CreateAt: Date()
        })
    } else {
        // TODO: no mirco sub app env
        localStorage.setItem('faketoken', '')
    }
}