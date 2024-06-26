// components/contexts/UserContext.tsx
import { createContext, ReactNode, useContext, useReducer, useEffect } from 'react';
import { User } from 'firebase/auth';
import { useAuth } from '~/lib/firebase'; // Import the useAuth hook
import { onAuthStateChanged } from 'firebase/auth';

type AuthActions = { type: 'SIGN_IN', payload: { user: User } } | { type: 'SIGN_OUT' };

type AuthState = {
  state: 'SIGNED_IN';
  currentUser: User;
} | {
  state: 'SIGNED_OUT';
} | {
  state: 'UNKNOWN';
};

const AuthReducer = (state: AuthState, action: AuthActions): AuthState => {
  switch (action.type) {
    case 'SIGN_IN':
      return {
        state: 'SIGNED_IN',
        currentUser: action.payload.user,
      };
    case 'SIGN_OUT':
      return {
        state: 'SIGNED_OUT',
      };
    default:
      return state;
  }
};

type AuthContextProps = {
  state: AuthState;
  dispatch: (value: AuthActions) => void;
};

export const AuthContext = createContext<AuthContextProps>({
  state: { state: 'UNKNOWN' },
  dispatch: () => {},
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(AuthReducer, { state: 'UNKNOWN' });
  const auth = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: 'SIGN_IN', payload: { user } });
      } else {
        dispatch({ type: 'SIGN_OUT' });
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuthState = () => useContext(AuthContext);

const useSignIn = () => {
  const { dispatch } = useContext(AuthContext);
  return {
    signIn: (user: User) => {
      dispatch({ type: 'SIGN_IN', payload: { user } });
    },
  };
};

const useSignOut = () => {
  const { dispatch } = useContext(AuthContext);
  return {
    signOut: () => {
      dispatch({ type: 'SIGN_OUT' });
    },
  };
};

export { useAuthState, useSignIn, useSignOut, AuthProvider };
