import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster.js'
import { ThemeProvider } from '@/components/theme-provider.js'
import App from '@/App.tsx'
import '@/index.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { OrderProvider } from './OrderContext.tsx'
import { NotificationProvider } from './NotificationContext.tsx'  // Add this line


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <OrderProvider>
          <NotificationProvider> {/* Add this line */}
            <RouterProvider router={App} />
          </NotificationProvider> {/* Add this line */}
        </OrderProvider>
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
)
