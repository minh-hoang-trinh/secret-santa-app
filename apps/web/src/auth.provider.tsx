import { Navigate } from '@tanstack/react-router';
import { FC, useContext, createContext, ReactNode, useState } from 'react';

export type UsersContextType = {
  getToken: () => string | null;
  currentUser: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
};

export const AuthContext = createContext<UsersContextType>({
  getToken: () => {
    throw new Error('Context not initialized');
  },
  currentUser: null,
  login: () => {
    throw new Error('Context not initialized');
  },
  logout: () => {
    throw new Error('Context not initialized');
  },
  isLoggedIn: false,
});

export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const getToken = () => {
    return token;
  };

  const getUsername = () => {
    return username;
  };

  const logout = async () => {
    setToken(null);
    setUsername(null);
  };

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return false;
    }

    const token = (await response.json()).access_token;

    setToken(token);
    setUsername(username);

    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        getToken,
        login,
        logout,
        currentUser: username,
        isLoggedIn: token != null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const withProtectedRoute = (Component: FC) => {
  return () => {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
      return <Navigate to="/login" />;
    }

    return <Component />;
  };
};
