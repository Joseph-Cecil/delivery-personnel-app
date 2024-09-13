import { createBrowserRouter } from "react-router-dom";
import GeneralError from './pages/errors/general-error.js';
import React from "react";

// eslint-disable-next-line react-refresh/only-export-components
const AppShell = React.lazy(() => import('./components/AppShell.js'));
const IndexComponent = React.lazy(() => import('./index.js'));
// eslint-disable-next-line react-refresh/only-export-components
const OrderDetails = React.lazy(() => import('./components/OrderDetails.js'));
// eslint-disable-next-line react-refresh/only-export-components
const ThemeSwitch = React.lazy(() => import('./components/theme-switch.js'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        element: <IndexComponent />,
      },
      {
        path: 'order/:orderId',
        element: <OrderDetails />,
      },
      {
        path: 'tasks',

        lazy: async () => {
          try {
            const Component = (await import('./index')).default;
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

export default router;
