if (import.meta.env.PROD && !window.__MICRO_APP_ENVIRONMENT__) {
    import('./tools/honeycomb').then(({ HoneycombSDK }) => {
        HoneycombSDK.start()
    })
}

let injectAnalytics: () => void = () => { }

let injectReady: Promise<void> | null = null

export function lazyInjectAnalytics() {
    if (!import.meta.env.PROD || window.__MICRO_APP_ENVIRONMENT__) return

    if (!injectReady) {
        injectReady = import('@vercel/analytics').then(({ inject }) => {
            injectAnalytics = inject
            inject()
        })
    } else {
        injectReady.then(() => injectAnalytics())
    }
}
