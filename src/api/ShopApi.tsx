import { AdminOrder } from "@/types";
import { useQuery } from "react-query";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useGetAllShopOrders = () => {
    const getAllShopOrdersRequest = async (): Promise<AdminOrder[]> => {
        const response = await  fetch(`${API_BASE_URL}/api/admin-order/orders`, {
            method: "GET"
        });

        if(!response.ok){
            throw new Error("Failed to get all Shop Orders");
        }

        return response.json();
    
    };

    const {data: AdminOrders = [], isLoading} = useQuery(
        "fetchAllShopOrders",
        getAllShopOrdersRequest,
        {
            staleTime:5000,
            refetchInterval: 1000,
            refetchOnWindowFocus: true
        }
    );

    return {AdminOrders, isLoading};
};