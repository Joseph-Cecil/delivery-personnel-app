import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster.js';
import { ThemeProvider } from '@/components/theme-provider.js';
import router from '@/App.tsx';
import '@/index.css';
import { QueryClient, QueryClientProvider } from 'react-query';
import { OrderProvider } from './OrderContext.tsx';
import { NotificationProvider } from './NotificationContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <QueryClientProvider client={queryClient}>
        <OrderProvider>
          <NotificationProvider>
            <React.Suspense fallback={<div>Loading...</div>}>
              <RouterProvider router={router} />
            </React.Suspense>
          </NotificationProvider>
        </OrderProvider>
      </QueryClientProvider>
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>
);
