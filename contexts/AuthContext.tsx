import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: string;
  user?: User;
  token?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  signIn: (credentials: SignInCredentials) => Promise<AuthResponse>;
  signUp: (credentials: SignUpCredentials) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
  setUser: (user: User | null) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Storage keys
const STORAGE_KEYS = {
  USER_TOKEN: "@auth_token",
  USER_DATA: "@user_data",
} as const;

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isGuest: false,
  signIn: async () => ({ success: false, error: "Not implemented" }),
  signUp: async () => ({ success: false, error: "Not implemented" }),
  signOut: async () => {},
  updateUser: async () => {},
  setUser: () => {},
});

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      if (token && userData) {
        const parsedUser: User = JSON.parse(userData);
        setUser(parsedUser);

        // Optional: Validate token with server
        // await validateToken(token);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
      // Clear potentially corrupted data
      await clearAuthData();
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (
    credentials: SignInCredentials
  ): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      // Replace with your actual API endpoint
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const { user: userData, token } = data;

        // Save to secure storage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData)
        );

        setUser(userData);

        return {
          success: true,
          user: userData,
          token,
        };
      } else {
        return {
          success: false,
          error: data.message || "Invalid credentials",
        };
      }
    } catch (error) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    credentials: SignUpCredentials
  ): Promise<AuthResponse> => {
    try {
      setIsLoading(true);

      // Validate inputs
      if (!isValidEmail(credentials.email)) {
        return { success: false, error: "Please enter a valid email address" };
      }

      if (credentials.password.length < 6) {
        return {
          success: false,
          error: "Password must be at least 6 characters",
        };
      }

      // Replace with your actual API endpoint
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        const { user: userData, token } = data;

        // Save to secure storage
        await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
        await AsyncStorage.setItem(
          STORAGE_KEYS.USER_DATA,
          JSON.stringify(userData)
        );

        setUser(userData);

        return {
          success: true,
          user: userData,
          token,
        };
      } else {
        return {
          success: false,
          error: data.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Sign up error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Network error occurred",
      };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setIsLoading(true);

      // Optional: Call logout endpoint to invalidate token on server
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      if (token) {
        try {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/logout`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.warn("Logout endpoint failed:", error);
          // Continue with local logout even if server call fails
        }
      }

      await clearAuthData();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userData: Partial<User>): Promise<void> => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const updatedUser: User = { ...user, ...userData };

      // Update local storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(updatedUser)
      );

      // Update state
      setUser(updatedUser);

      // Optional: Sync with server
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      if (token) {
        try {
          await fetch(`${process.env.EXPO_PUBLIC_API_URL}/auth/profile`, {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
        } catch (error) {
          console.warn("Profile update sync failed:", error);
        }
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  };

  const clearAuthData = async (): Promise<void> => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.USER_TOKEN,
        STORAGE_KEYS.USER_DATA,
      ]);
    } catch (error) {
      console.error("Error clearing auth data:", error);
    }
  };

  // Helper function for email validation
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Expose setUser function for guest login
  const handleSetUser = (userData: User | null): void => {
    setUser(userData);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isGuest: user?.id?.startsWith("guest-") || false,
    signIn,
    signUp,
    signOut,
    updateUser,
    setUser: handleSetUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Export types for use in other components
export type { AuthContextType };
