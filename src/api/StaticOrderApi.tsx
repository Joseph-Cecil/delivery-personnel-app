import { StaticOrders } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllStaticOrders = () => {
  const getAllStaticOrdersRequest = async (): Promise<StaticOrders[]> => {
    const response = await fetch(`${API_BASE_URL}/api/make-request/admin-static-orders/`, {
      method: "GET"
    });

    if (!response.ok) {
      throw new Error("Failed to get all static orders");
    }
    

    return response.json();
  };

  const { data: staticOrders = [], isLoading } = useQuery(
    "fetchAllStaticOrders",
    getAllStaticOrdersRequest,
    {
        staleTime: 5000,
        refetchInterval: 1000,
        refetchOnWindowFocus: true
    }
  );

  return { staticOrders, isLoading };
};



