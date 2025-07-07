'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    signOut as firebaseSignOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword 
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { SignUpForm, SignInForm } from '@/types';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: SignInForm) => Promise<any>;
  signUp: (data: SignUpForm) => Promise<any>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (data: SignInForm) => {
     return signInWithEmailAndPassword(auth, data.email, data.password);
  };

  const signUp = async (data: SignUpForm) => {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    // After user is created in Auth, create their doc in Firestore
    if (userCredential.user) {
        await setDoc(doc(db, "users", userCredential.user.uid), {
            email: userCredential.user.email,
            credits: 15 // Starting credits
        });
    }
    return userCredential;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
