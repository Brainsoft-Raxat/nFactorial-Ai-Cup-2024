import { lazy, Suspense, useEffect } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter, useNavigate } from 'react-router-dom';
import { getChats } from '~/lib/firestoreService';
import Layout from '~/components/shared/Layout'; // Ensure Layout includes Sidebar and Header
import RequireAuth from './RequireAuth'; // Import RequireAuth component
import { useAuthState } from '~/components/contexts/UserContext';

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const Page404Screen = lazy(() => import('~/components/screens/404'));
const ChatScreen = lazy(() => import('~/components/screens/Chat')); // Ensure this path is correct
const LoginScreen = lazy(() => import('~/components/screens/Login')); // Create and import Login screen

function RedirectToFirstChat() {
  const { state } = useAuthState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      if (state.state === 'SIGNED_IN') {
        const chats = await getChats(state.currentUser.uid);
        if (chats.length > 0) {
          navigate(`/chat/${chats[0].id}`);
        } else {
          navigate('/chat');
        }
      }
    };

    fetchChats();
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
  const routes: RouteObject[] = [
    {
      path: '/',
      element: <Layout />, // Use Layout to ensure Sidebar and Header are included
      children: [
        {
          index: true,
          element: (
            <RequireAuth>
              <RedirectToFirstChat />
            </RequireAuth>
          ),
        },
        {
          path: 'chat',
          element: (
            <RequireAuth>
              <ChatScreen />
            </RequireAuth>
          ),
        },
        {
          path: 'chat/:chatId',
          element: (
            <RequireAuth>
              <ChatScreen />
            </RequireAuth>
          ),
        },
        {
          path: 'login',
          element: <LoginScreen />,
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
