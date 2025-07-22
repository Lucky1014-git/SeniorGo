import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the shape of your user info object
type UserInfoType = {
  [key: string]: any;
};

// Define the context type
type UserContextType = {
  userInfo: UserInfoType | null;
  setUserInfo: (user: UserInfoType) => void;
  getUserInfo: () => UserInfoType | null;
};

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  // Add getUserInfo function
  const getUserInfo = () => userInfo;

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo, getUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to access the user context
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
