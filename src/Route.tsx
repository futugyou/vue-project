import React, { lazy, Suspense } from 'react'
import { createBrowserRouter, RouteObject, BrowserRouter, Route } from 'react-router-dom'

const OpenaiWeb = lazy(() => import('./pages/OpenaiWeb'))
const App = lazy(() => import('./App'))

const router = createBrowserRouter([
  {
    path: "/",
    index: true,
    element: <App />,
  },

  {
    path: "/openai",
    element: <OpenaiWeb />,
  }
])

export { router } 