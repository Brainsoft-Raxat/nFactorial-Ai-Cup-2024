// components/root/App.tsx
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from '~/components/contexts/UserContext';
import { setupFirebase } from '~/lib/firebase';
import { useEffect } from 'react';
import Main from '~/components/root/Main';

export const App = () => {
  useEffect(() => {
    setupFirebase();
  }, []);

  return (
    <HelmetProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
