import { createBrowserRouter } from "react-router-dom";
import GeneralError from './pages/errors/general-error';
import React from "react";

const App = createBrowserRouter([
  
  {
    path: '/',
    lazy: async () => {
      try {
        const AppShell = await import('./components/AppShell');
        console.log('AppShell loaded successfully');
        return { Component: AppShell.default };
      } catch (error) {
        console.error('Error loading AppShell:', error);
        throw error;
      }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => {
          try {
            const Component = (await import('./index')).default;
            console.log('Index component loaded successfully');
            return { Component };
          } catch (error) {
            console.error('Error loading index component:', error);
            throw error;
          }
        },
      },
      {
        path: 'order/:orderId',
        lazy: async () => {
          try {
            const Component = (await import('./components/OrderDetails')).default;
            console.log('OrderDetails component loaded successfully');
            return { Component };
          } catch (error) {
            console.error('Error loading OrderDetails component:', error);
            throw error;
          }
        },
      },
      {
        path: 'tasks',
        lazy: async () => {
          try {
            const Component = (await import('./components/theme-switch')).default;
            console.log('ThemeSwitch component loaded successfully');
            return { Component };
          } catch (error) {
            console.error('Error loading ThemeSwitch component:', error);
            throw error;
          }
        },
      }
    ]
  }
]);

export default App;
