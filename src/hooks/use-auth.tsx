"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import type { User } from "@/lib/types";
import { getUserById } from "@/lib/data";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import Loader from "@/components/ui/loader";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => void;
  // No signup here, that's a separate action
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    let unsubscribeSnapshot: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (unsubscribeSnapshot) {
        (unsubscribeSnapshot as () => void)();
        unsubscribeSnapshot = null;
      }

      if (firebaseUser) {
        // Subscribe to real-time user updates
        const userRef = doc(db, "users", firebaseUser.uid);
        unsubscribeSnapshot = onSnapshot(
          userRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const updatedUser = {
                id: docSnap.id,
                ...data,
                // safe handle timestamp
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
              } as User;
              setUser(updatedUser);
            } else {
              console.error("User document does not exist for UID:", firebaseUser.uid);
              setUser(null);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Error fetching user snapshot:", error);
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnapshot) {
        (unsubscribeSnapshot as () => void)();
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      // The onAuthStateChanged listener will handle fetching/setting the user
      // But we find getting the user immediately can be useful for the return value
      const firebaseUser = credential.user;
      // We can fetch once here just to return it, even though the listener will also fire
      const fetchedUser = await getUserById(firebaseUser.uid);
      return fetchedUser || null;
    } catch (error) {
      console.error("Login failed:", error);
      return null;
    }
  };

  const logout = () => {
    signOut(auth);
    // State clear handled by listener
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="h-screen w-screen flex items-center justify-center bg-background">
          <Loader />
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
