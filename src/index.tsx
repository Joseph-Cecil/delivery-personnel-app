import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/custom/layout.js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.js";
import ThemeSwitch from "@/components/theme-switch.js";
import { TopNav } from "@/components/top-nav.js";
import { UserNav } from "@/components/user-nav.js";
import { useGetAllShopOrders } from "./api/ShopApi.js"; // Ensure the correct path
import { useGetAllStaticOrders } from "./api/StaticOrderApi.js";
import { useNotification } from "./NotificationContext.js";
import { requestNotificationPermission, showNotification } from "./NotificationService.js";

export default function Dashboard() {
  const [prevShopOrderCount, setPrevShopOrderCount] = useState(0);
  const [prevStaticOrderCount, setPrevStaticOrderCount] = useState(0);
  const { AdminOrders, isLoading: shopOrdersLoading } = useGetAllShopOrders();
  const { staticOrders, isLoading: staticOrdersLoading } = useGetAllStaticOrders();
  const { addNotification, playSound } = useNotification();
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    registerServiceWorker();
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (!shopOrdersLoading && !staticOrdersLoading) {
      const currentShopOrderCount = AdminOrders.length;
      const currentStaticOrderCount = staticOrders.length;

      if (currentShopOrderCount > prevShopOrderCount) {
        playSound();
        addNotification({ type: 'order', message: 'New shop order placed!' });
        showNotification('New Shop Order');
      }

      if (currentStaticOrderCount > prevStaticOrderCount) {
        playSound();
        addNotification({ type: 'order', message: 'New static order placed!' });
        showNotification('New Static Order');
      }

      setPrevShopOrderCount(currentShopOrderCount);
      setPrevStaticOrderCount(currentStaticOrderCount);
    }
  }, [
    AdminOrders,
    staticOrders,
    shopOrdersLoading,
    staticOrdersLoading,
    prevShopOrderCount,
    prevStaticOrderCount,
    addNotification,
    playSound
  ]);

  const getStatusIconPath = (status: string) => {
    switch (status) {
      case "placed":
        return "M5 12L19 12M5 12L11 18M5 12L11 6"; // Example path
      case "inProgress":
        return "M12 5v14m-7-7h14"; // Example path
      case "outForDelivery":
        return "M3 12h18M3 12l7-7M3 12l7 7"; // Example path
      case "paid":
        return "M12 3v18M6 9l6 6M18 9l-6 6"; // Example path
      case "delivered":
        return "M5 13l4 4L19 7"; // Example path
      default:
        return "M5 12L19 12M5 12L11 18M5 12L11 6"; // Default example path
    }
  };

  const handleCardClick = (orderId: string) => {
    navigate(`/order/${orderId}`);
  };

  // Filter orders with status 'paid'
  const completedShopOrders = AdminOrders?.filter(order => order.status === "placed") || [];
  const completedStaticOrders = staticOrders?.filter(order => order.status === "placed") || [];

  return (
    <Layout>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="mb-2 flex items-center justify-between space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        </div>
        <Tabs orientation="vertical" defaultValue="shop-orders" className="space-y-4">
          <div className="w-full overflow-x-auto pb-2">
            <TabsList>
              <TabsTrigger value="shop-orders">Shop - Orders</TabsTrigger>
              <TabsTrigger value="static-orders">Static - Orders</TabsTrigger>
              <TabsTrigger value="completed-orders">Completed - Orders</TabsTrigger>
            </TabsList>
          </div>

          {/* Shop Orders */}
          <TabsContent value="shop-orders" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {shopOrdersLoading ? (
                <p>Loading...</p>
              ) : (
                AdminOrders.map((order, index) => (
                  <Card key={index} onClick={() => handleCardClick(order._id)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {order.restaurant?.restaurantName || "Unknown Restaurant"}
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d={getStatusIconPath(order.status)} />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {order.deliveryDetails?.areaName || "Unknown Area"}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ghc{order.totalAmount} from last month
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Static Orders */}
          <TabsContent value="static-orders" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {staticOrdersLoading ? (
                <p>Loading...</p>
              ) : (
                staticOrders.map((order, index) => (
                  <Card key={index} onClick={() => handleCardClick(order._id)}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {order.staticOrder}
                      </CardTitle>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                      >
                        <path d="M5 12L19 12M5 12L11 18M5 12L11 6" />
                      </svg>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{order.location}</div>
                      <p className="text-xs text-muted-foreground">
                        {order.phoneNumber}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
                    {/* Completed Orders */}
                    <TabsContent value="completed-orders" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {completedShopOrders.map((order, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {order.restaurant?.restaurantName || "Unknown Restaurant"}
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d={getStatusIconPath(order.status)} />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {order.deliveryDetails?.areaName || "Unknown Area"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Ghc{order.totalAmount} from last month
                    </p>
                  </CardContent>
                </Card>
              ))}
              {completedStaticOrders.map((order, index) => (
                <Card key={index} onClick={() => handleCardClick(order._id)}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      {order.staticOrder}
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-muted-foreground"
                    >
                      <path d="M5 12L19 12M5 12L11 18M5 12L11 6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{order.location}</div>
                    <p className="text-xs text-muted-foreground">
                      {order.phoneNumber}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </Layout.Body>
      <audio ref={audioRef} src="path_to_notification_sound.mp3" />
    </Layout>
  );
}

const topNav = [
  {
    title: "Orders",
    href: "dashboard/overview",
    isActive: true,
  },
  {
    title: "Static Orders",
    href: "dashboard/customers",
    isActive: false,
  },
  {
    title: "Completed Orders",
    href: "dashboard/products",
    isActive: false,
  },
  {
    title: "Settings",
    href: "dashboard/settings",
    isActive: false,
  },
];



const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/ServiceWorker.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  }
};
// import React, { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Layout } from "@/components/custom/layout";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import ThemeSwitch from "@/components/theme-switch";
// import { TopNav } from "@/components/top-nav";
// import { UserNav } from "@/components/user-nav";
// import { useGetAllShopOrders } from "./api/ShopApi"; // Ensure the correct path
// import { useGetAllStaticOrders } from "./api/StaticOrderApi";
// import { useNotification } from "./NotificationContext";
// import { requestNotificationPermission } from './NotificationService';

// const registerServiceWorker = () => {
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/sw.js').then(function(registration) {
//       console.log('ServiceWorker registration successful with scope: ', registration.scope);
//     }, function(err) {
//       console.log('ServiceWorker registration failed: ', err);
//     });
//   }
// };

// export default function Dashboard() {
//   const [prevShopOrderCount, setPrevShopOrderCount] = useState(0);
//   const [prevStaticOrderCount, setPrevStaticOrderCount] = useState(0);
//   const { AdminOrders, isLoading: shopOrdersLoading } = useGetAllShopOrders();
//   const { staticOrders, isLoading: staticOrdersLoading } = useGetAllStaticOrders();
//   const { addNotification, playSound } = useNotification();
//   const navigate = useNavigate();
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   useEffect(() => {
//     registerServiceWorker();
//     requestNotificationPermission();
//   }, []);

//   useEffect(() => {
//     if (!shopOrdersLoading && !staticOrdersLoading) {
//       const currentShopOrderCount = AdminOrders.length;
//       const currentStaticOrderCount = staticOrders.length;

//       if (currentShopOrderCount > prevShopOrderCount) {
//         playSound();
//         addNotification({ type: 'order', message: 'New shop order placed!' });
//       }

//       if (currentStaticOrderCount > prevStaticOrderCount) {
//         playSound();
//         addNotification({ type: 'order', message: 'New static order placed!' });
//       }

//       setPrevShopOrderCount(currentShopOrderCount);
//       setPrevStaticOrderCount(currentStaticOrderCount);
//     }
//   }, [
//     AdminOrders,
//     staticOrders,
//     shopOrdersLoading,
//     staticOrdersLoading,
//     prevShopOrderCount,
//     prevStaticOrderCount,
//     addNotification,
//     playSound
//   ]);

//   const getStatusIconPath = (status: string) => {
//     switch (status) {
//       case "placed":
//         return "M5 12L19 12M5 12L11 18M5 12L11 6"; // Example path
//       case "inProgress":
//         return "M12 5v14m-7-7h14"; // Example path
//       case "outForDelivery":
//         return "M3 12h18M3 12l7-7M3 12l7 7"; // Example path
//       case "paid":
//         return "M12 3v18M6 9l6 6M18 9l-6 6"; // Example path
//       case "delivered":
//         return "M5 13l4 4L19 7"; // Example path
//       default:
//         return "M5 12L19 12M5 12L11 18M5 12L11 6"; // Default example path
//     }
//   };

//   const handleCardClick = (orderId: string) => {
//     navigate(`/order/${orderId}`);
//   };

//   // Filter orders with status 'paid'
//   const completedShopOrders = AdminOrders?.filter(order => order.status === "placed") || [];
//   const completedStaticOrders = staticOrders?.filter(order => order.status === "placed") || [];

//   return (
//     <Layout>
//       <Layout.Header>
//         <TopNav links={topNav} />
//         <div className="ml-auto flex items-center space-x-4">
//           <ThemeSwitch />
//           <UserNav />
//         </div>
//       </Layout.Header>

//       <Layout.Body>
//         <div className="mb-2 flex items-center justify-between space-y-2">
//           <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
//         </div>
//         <Tabs orientation="vertical" defaultValue="shop-orders" className="space-y-4">
//           <div className="w-full overflow-x-auto pb-2">
//             <TabsList>
//               <TabsTrigger value="shop-orders">Shop - Orders</TabsTrigger>
//               <TabsTrigger value="static-orders">Static - Orders</TabsTrigger>
//               <TabsTrigger value="completed-orders">Completed - Orders</TabsTrigger>
//             </TabsList>
//           </div>

//           {/* Shop Orders */}
//           <TabsContent value="shop-orders" className="space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               {shopOrdersLoading ? (
//                 <p>Loading...</p>
//               ) : (
//                 AdminOrders.map((order, index) => (
//                   <Card key={index} onClick={() => handleCardClick(order._id)}>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle className="text-sm font-medium">
//                         {order.restaurant?.restaurantName || "Unknown Restaurant"}
//                       </CardTitle>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         className="h-4 w-4 text-muted-foreground"
//                       >
//                         <path d={getStatusIconPath(order.status)} />
//                       </svg>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold">
//                         {order.deliveryDetails?.areaName || "Unknown Area"}
//                       </div>
//                       <p className="text-xs text-muted-foreground">
//                         Ghc{order.totalAmount} from last month
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </TabsContent>

//           {/* Static Orders */}
//           <TabsContent value="static-orders" className="space-y-4">
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//               {staticOrdersLoading ? (
//                 <p>Loading...</p>
//               ) : (
//                 staticOrders.map((order, index) => (
//                   <Card key={index} onClick={() => handleCardClick(order._id)}>
//                     <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                       <CardTitle className="text-sm font-medium">
//                         {order.staticOrder}
//                       </CardTitle>
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth="2"
//                         className="h-4 w-4 text-muted-foreground"
//                       >
//                         <path d="M5 12L19 12M5 12L11 18M5 12L11 6" />
//                       </svg>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="text-2xl font-bold">{order.location}</div>
//                       <p className="text-xs text-muted-foreground">
//                         {order.phoneNumber} from last month
//                       </p>
//                     </CardContent>
//                   </Card>
//                 ))
//               )}
//             </div>
//           </TabsContent>

          // {/* Completed Orders */}
          // <TabsContent value="completed-orders" className="space-y-4">
          //   <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          //     {completedShopOrders.map((order, index) => (
          //       <Card key={index}>
          //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          //           <CardTitle className="text-sm font-medium">
          //             {order.restaurant?.restaurantName || "Unknown Restaurant"}
          //           </CardTitle>
          //           <svg
          //             xmlns="http://www.w3.org/2000/svg"
          //             viewBox="0 0 24 24"
          //             fill="none"
          //             stroke="currentColor"
          //             strokeLinecap="round"
          //             strokeLinejoin="round"
          //             strokeWidth="2"
          //             className="h-4 w-4 text-muted-foreground"
          //           >
          //             <path d={getStatusIconPath(order.status)} />
          //           </svg>
          //         </CardHeader>
          //         <CardContent>
          //           <div className="text-2xl font-bold">
          //             {order.deliveryDetails?.areaName || "Unknown Area"}
          //           </div>
          //           <p className="text-xs text-muted-foreground">
          //             Ghc{order.totalAmount} from last month
          //           </p>
          //         </CardContent>
          //       </Card>
          //     ))}
          //     {completedStaticOrders.map((order, index) => (
          //       <Card key={index} onClick={() => handleCardClick(order._id)}>
          //         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          //           <CardTitle className="text-sm font-medium">
          //             {order.staticOrder}
          //           </CardTitle>
          //           <svg
          //             xmlns="http://www.w3.org/2000/svg"
          //             viewBox="0 0 24 24"
          //             fill="none"
          //             stroke="currentColor"
          //             strokeLinecap="round"
          //             strokeLinejoin="round"
          //             strokeWidth="2"
          //             className="h-4 w-4 text-muted-foreground"
          //           >
          //             <path d="M5 12L19 12M5 12L11 18M5 12L11 6" />
          //           </svg>
          //         </CardHeader>
          //         <CardContent>
          //           <div className="text-2xl font-bold">{order.location}</div>
          //           <p className="text-xs text-muted-foreground">
          //             {order.phoneNumber}
          //           </p>
          //         </CardContent>
          //       </Card>
          //     ))}
          //   </div>
          // </TabsContent>
//         </Tabs>
//       </Layout.Body>
//       <audio ref={audioRef} src="path_to_notification_sound.mp3" />
//     </Layout>
//   );
// }

// const topNav = [
//   {
//     title: "Orders",
//     href: "dashboard/overview",
//     isActive: true,
//   },
//   {
//     title: "Static Orders",
//     href: "dashboard/customers",
//     isActive: false,
//   },
//   {
//     title: "Completed Orders",
//     href: "dashboard/products",
//     isActive: false,
//   },
//   {
//     title: "Settings",
//     href: "dashboard/settings",
//     isActive: false,
//   },
// ];
