if (import.meta.env.PROD) {
    import('./tools/honeycomb').then(({ HoneycombSDK }) => {
        HoneycombSDK.start()
    })
}

let injectAnalytics: () => void = () => { }

let injectReady: Promise<void> | null = null

export function lazyInjectAnalytics() {
    if (!import.meta.env.PROD) return

    if (!injectReady) {
        injectReady = import('@vercel/analytics').then(({ inject }) => {
            injectAnalytics = inject
            inject()
        })
    } else {
        injectReady.then(() => injectAnalytics())
    }
}
