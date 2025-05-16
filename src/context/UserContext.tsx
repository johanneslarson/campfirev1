import React, { createContext, useState } from 'react';
import { getUserProfile, UserProfile } from '../services/data';

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
}

// Create the context with default values
export const UserContext = createContext<UserContextType>({
  user: {
    name: "",
    email: "",
    isArtist: false
  },
  setUser: () => {}
});

// Provider component
export const UserProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(getUserProfile());
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 