import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { UserProfile } from './types';

interface AuthState {
  ready: boolean;
  user: User | null;
  profile: UserProfile | null;
  /** Profil belgesi henüz okunmadıysa false. */
  profileLoaded: boolean;
}

const AuthContext = createContext<AuthState>({ ready: false, user: null, profile: null, profileLoaded: false });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ ready: false, user: null, profile: null, profileLoaded: false });

  useEffect(() => {
    let unsubProfile: (() => void) | undefined;
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      unsubProfile?.();
      if (!user) {
        setState({ ready: true, user: null, profile: null, profileLoaded: true });
        return;
      }
      setState({ ready: true, user, profile: null, profileLoaded: false });
      unsubProfile = onSnapshot(
        doc(db, 'users', user.uid),
        (snap) =>
          setState({
            ready: true,
            user,
            profile: snap.exists() ? { uid: snap.id, ...(snap.data() as Omit<UserProfile, 'uid'>) } : null,
            profileLoaded: true,
          }),
        () => setState({ ready: true, user, profile: null, profileLoaded: true }),
      );
    });
    return () => {
      unsubProfile?.();
      unsubAuth();
    };
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
