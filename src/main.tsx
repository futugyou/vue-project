import './index.css'

import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './Route'

import microApp from '@micro-zoe/micro-app'

// microApp.start()
microApp.start({
  plugins: {
    modules: {
      // 注意这里 子应用的name值
      "openai": [{
        loader(code) {
          // 这里 basename 需要和子应用vite.config.js中base的配置保持一致
          code = code.replace(/(from|import)(\s*['"])(\/openai\/)/g, all => {
            return all.replace('/openai/', `${import.meta.env.REACT_APP_OPENAI_SERVER}` + 'openai/')
          })
          console.log(code)
          return code
        }
      }]
    }
  }
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>,
)
