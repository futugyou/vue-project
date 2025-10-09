
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk'
import { TracingInstrumentation } from '@grafana/faro-web-tracing'

export const initFaro = () => {
    if (!import.meta.env.PROD || window.__MICRO_APP_ENVIRONMENT__) return

    initializeFaro({
        url: import.meta.env.VUE_APP_GRAFANA_CLOUD_URL,
        app: {
            name: 'vue',
            version: '1.0.0',
            environment: 'production'
        },
        instrumentations: [
            // @ts-ignore
            ...getWebInstrumentations(),
            // @ts-ignore
            new TracingInstrumentation(),
        ],
    })
}
