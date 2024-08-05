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
        element: <ThemeSwitch />,
      }
    ]
  }
]);

export default router;
