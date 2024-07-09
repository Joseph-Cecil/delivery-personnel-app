import React from "react";
import { useParams } from "react-router-dom";
import { useOrders } from "../OrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { AdminOrders, staticOrders, isLoading } = useOrders();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const adminOrder = AdminOrders.find((order) => order._id === orderId);
  const staticOrder = staticOrders.find((order) => order._id === orderId);

  if (!adminOrder && !staticOrder) {
    return <div>Order not found</div>;
  }

  const order = adminOrder || staticOrder;
  const isAdminOrder = !!adminOrder;

  return (
    <div style={{marginTop:"50%", marginLeft:'10%', marginRight:'10%'}}>
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                      {isAdminOrder ? order.restaurant.restaurantName : order.staticOrder}
                      </CardTitle>
                      
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        <span className="font-bold">Your Order</span>
          <ul>
             {isAdminOrder ? (
               order.cartItems.map((item, key) => (
                 <li key={key}>
                   {item.name} x {item.quantity}
                 </li>
               ))
             ) : (
               <li>{order.staticOrder}</li>
             )}
           </ul>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Total: Ghc{order.totalAmount} .00
                      </p>
                    </CardContent>
                  </Card>
    </div>
    </div>
 
    // <div className="space-y-8">
    //   <div className="flex items-center">
    //     <div className="ml-4 space-y-1">
    //       <p className="text-sm font-medium leading-none">
    //         {isAdminOrder ? order.restaurant.restaurantName : order.staticOrder}
    //       </p>
    //       <Separator />
    //       <span className="font-bold">Your Order</span>
    //       <ul>
    //         {isAdminOrder ? (
    //           order.cartItems.map((item, key) => (
    //             <li key={key}>
    //               {item.name} x {item.quantity}
    //             </li>
    //           ))
    //         ) : (
    //           <li>{order.staticOrder}</li>
    //         )}
    //       </ul>
    //       <Separator />
    //       <div className="flex flex-col"></div>
    //       <Separator />
    //       <p className="text-sm text-muted-foreground">
    //         {isAdminOrder
    //           ? `${order.deliveryDetails.areaName}, ${order.deliveryDetails.streetName}, ${order.deliveryDetails.houseNumber}`
    //           : order.location}
    //       </p>
    //     </div>
    //     <div className="ml-auto font-medium">
    //       Phone Number: {isAdminOrder ? order.deliveryDetails.phoneNumber : order.phoneNumber}
    //     </div>
        
    //     <div className="ml-auto font-medium">Status: {order.status}</div>
    //   </div>
    // </div>
  );
};

export default OrderDetails;
