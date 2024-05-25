// components/router/Router.tsx
import { lazy, Suspense, useEffect } from 'react';
import { RouteObject, useRoutes, BrowserRouter, useNavigate } from 'react-router-dom';
import { getChats } from '~/lib/firestoreService';
import Layout from '~/components/shared/Layout'; // Ensure Layout includes Sidebar and Header
import { useAuthState } from '~/components/contexts/UserContext';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const Page404Screen = lazy(() => import('~/components/screens/404'));
const ChatScreen = lazy(() => import('~/components/screens/Chat')); // Ensure this path is correct
const LoginScreen = lazy(() => import('~/components/screens/Login')); // Ensure this path is correct

function RedirectToFirstChat() {
  const navigate = useNavigate();
  const { state } = useAuthState();

  useEffect(() => {
    if (state.state === 'SIGNED_IN') {
      const fetchChats = async () => {
        const chats = await getChats(state.currentUser!.uid);
        if (chats.length > 0) {
          navigate(`/chat/${chats[0].id}`);
        } else {
          navigate('/chat');
        }
      };

      fetchChats();
    } else if (state.state === 'SIGNED_OUT') {
      navigate('/login');
    }
  }, [navigate, state]);

  return <Loading />;
}

export const Router = () => {
  return (
    <BrowserRouter>
      <InnerRouter />
    </BrowserRouter>
  );
};

const InnerRouter = () => {
  const { state } = useAuthState();
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />, // Use Layout to ensure Sidebar and Header are included
      children: [
        {
          index: true,
          element: state.state === 'SIGNED_IN' ? <RedirectToFirstChat /> : <LoginScreen />,
        },
        {
          path: 'chat',
          element: state.state === 'SIGNED_IN' ? <ChatScreen /> : <LoginScreen />,
        },
        {
          path: 'chat/:chatId',
          element: state.state === 'SIGNED_IN' ? <ChatScreen /> : <LoginScreen />,
        },
        {
          path: 'login',
          element: state.state === 'SIGNED_IN' ? <RedirectToFirstChat /> : <LoginScreen />,
        },
        {
          path: '*',
          element: <Page404Screen />,
        },
      ],
    },
  ];
  const element = useRoutes(routes);
  return (
    <div>
      <Suspense fallback={<Loading />}>{element}</Suspense>
    </div>
  );
};