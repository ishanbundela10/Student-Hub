import { createContext, ReactNode, useEffect, useState } from "react";
import { getCurrentUser } from "../api/auth";
import { User } from "@/types";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchUser = async () => {
        try {
            const res = await getCurrentUser()
            setUser(res.data.data);
        }
        catch (err) {
            setUser(null);
        }
        finally {
            setLoading(false);
        }
    }

    fetchUser();

}, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  )
};
