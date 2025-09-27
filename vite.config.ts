import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import topLevelAwait from 'vite-plugin-top-level-await'
import { visualizer } from 'rollup-plugin-visualizer'
import faroUploader from '@grafana/faro-rollup-plugin'

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '')

// https://vitejs.dev/config/
export default defineConfig({
  envPrefix: "VUE_APP_",
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag: any) =>
            /^micro-app/.test(tag) || tag.startsWith('drive-picker'),
        },
      },
    }),
    vueJsx(),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: i => `__tla_${i}`,
    }),
    visualizer({ open: true, filename: 'dist/stats.html' }),
    faroUploader({
      appName: env.FARO_APP_NAME,
      endpoint: env.FARO_ENDPOINT,
      appId: env.FARO_APP_ID,
      stackId: env.FARO_STACK_ID,
      verbose: true,
      apiKey: env.FARO_API_KEY,
      gzipContents: true,
    })
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: [".cloudstudio.work"],
    cors: {
      origin: "*",
      methods: "*",
      allowedHeaders: "*",
      exposedHeaders: "*"
    }
  }
})
