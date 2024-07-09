export type StaticOrders = {
    _id: string;
    status: string;
    map(arg0: (order: { title: string | number | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<unknown>> | Iterable<import("react").ReactNode>; svgPath: string; value: string | number | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<unknown>> | Iterable<import("react").ReactNode>; percentage: string | number | boolean | import("react").ReactPortal | import("react").ReactElement<unknown, string | import("react").JSXElementConstructor<unknown>> | Iterable<import("react").ReactNode>; }, index: import("react").Key) => import("react").JSX.Element): import("react").ReactNode;
    staticOrder: string;
    name:string;
    phoneNumber: string;
    location: string;
    deliveryLocation: string;
    additionalInfo: string;
    isLoading: boolean
};


export type User = {
    _id: string;
    email: string;
    name: string;
    phoneNumber: string;
    areaName: string;
    streetName: string;
    houseNumber: string
}

export type MenuItem = {
    _id:string;
    name: string;
    price: number;
}

export type Restaurant = {
    _id: string;
    user: string;
    restaurantName: string;
    areaName: string;
    location: string;
    estimateDeliveryTime: number;
    cuisines: string[];
    menuItems: MenuItem[];
    imageUrl: string;
    lastUpdated: string;
}

export type OrderStatus = "placed" | "inProgress" | "outForDelivery" | "paid" | "delivered"

export type AdminOrder = {
    _id: string;
    restaurant: Restaurant;
    user: User;
    cartItems: {
        menuItemId: string;
        name: string;
        quantity: string;
    }[];
    deliveryDetails: {
        name: string;
        phoneNumber: string;
        areaName: string;
        streetName: string;
        houseNumber: string;
    };
    totalAmount: number;
    status: OrderStatus;
    createdAt: string;
    restaurantId: string;
}


