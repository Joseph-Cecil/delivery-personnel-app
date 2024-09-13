import React, { createContext, useContext, useState, useRef, ReactNode } from "react";

type Notification = {
  type: string;
  message: string;
};

type NotificationContextType = {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  playSound: () => void;
};

// Define the type for the provider props
type NotificationProviderProps = {
  children: ReactNode;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      notification,
    ]);
    playSound();
  };

  const playSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Audio play failed:", error));
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, playSound }}>
      {children}
      <audio ref={audioRef} src="/mixkit-bell-notification-933.wav" />
    </NotificationContext.Provider>
  );
};
 