// components/screens/Login.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from '~/components/contexts/UserContext';
import { SignInButton } from '~/components/domain/auth/SignInButton';

const Login = () => {
  const { state } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    if (state.state === 'SIGNED_IN') {
      navigate('/chat'); // Redirect to the chat page or another desired route
    }
  }, [state, navigate]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Please Sign In</h1>
        <SignInButton />
      </div>
    </div>
  );
};

export default Login;
