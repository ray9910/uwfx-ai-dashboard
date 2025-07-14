'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    onAuthStateChanged, 
    User, 
    signOut as firebaseSignOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword,
    updateEmail,
    updatePassword,
    updateProfile,
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import type { SignUpForm, SignInForm, UpdateEmailForm, UpdatePasswordForm } from '@/types';
import { doc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: SignInForm) => Promise<any>;
  signUp: (data: SignUpForm) => Promise<any>;
  signOut: () => Promise<void>;
  updateUserEmail: (data: UpdateEmailForm) => Promise<void>;
  updateUserPassword: (data: UpdatePasswordForm) => Promise<void>;
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
    const currentUser = userCredential.user;
    
    // After user is created in Auth, update their profile and create their doc in Firestore
    if (currentUser) {
        // Update Firebase Auth profile
        await updateProfile(currentUser, {
            displayName: data.displayName
        });

        // Create user document in Firestore
        await setDoc(doc(db, "users", currentUser.uid), {
            displayName: data.displayName,
            email: currentUser.email,
            credits: 0, // Starting credits
            subscriptionStatus: "inactive",
            planName: null,
            createdAt: new Date()
        });
        
        // Refresh the user state to include the new profile info
        setUser({...currentUser, displayName: data.displayName});
    }
    return userCredential;
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    router.push('/');
  };

  const updateUserEmail = async (data: UpdateEmailForm) => {
    if (!auth.currentUser) throw new Error("User not found");
    await updateEmail(auth.currentUser, data.email);
  }

  const updateUserPassword = async (data: UpdatePasswordForm) => {
    if (!auth.currentUser) throw new Error("User not found");
    await updatePassword(auth.currentUser, data.password);
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateUserEmail,
    updateUserPassword,
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
