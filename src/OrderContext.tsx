import React, { createContext, useContext          } from 'react';
import { useGetAllShopOrders } from './api/ShopApi';
import { useGetAllStaticOrders } from './api/StaticOrderApi';

const OrderContext = createContext(null);

export const OrderProvider = ({ children }) => {
  const { AdminOrders, isLoading: shopOrdersLoading } = useGetAllShopOrders();
  const { staticOrders, isLoading: staticOrdersLoading } = useGetAllStaticOrders();

  const isLoading = shopOrdersLoading || staticOrdersLoading;

  return (
    <OrderContext.Provider value={{ AdminOrders, staticOrders, isLoading }}>
      {children}
    </OrderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => {
  return useContext(OrderContext);
};
