// components/router/Router.tsx
import { lazy, Suspense, useEffect } from 'react';
import { Outlet, RouteObject, useRoutes, BrowserRouter, useNavigate } from 'react-router-dom';
import { getChats } from '~/lib/firestoreService';
import Layout from '~/components/shared/Layout'; // Ensure Layout includes Sidebar and Header

const Loading = () => <p className="p-4 w-full h-full text-center">Loading...</p>;

const IndexScreen = lazy(() => import('~/components/screens/Index'));
const Page404Screen = lazy(() => import('~/components/screens/404'));
const ChatScreen = lazy(() => import('~/components/screens/Chat')); // Ensure this path is correct

function RedirectToFirstChat() {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      const chats = await getChats();
      if (chats.length > 0) {
        navigate(`/chat/${chats[0].id}`);
      } else {
        navigate('/chat');
      }
    };

    fetchChats();
  }, [navigate]);

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
          element: <RedirectToFirstChat />,
        },
        {
          path: 'chat',
          element: <ChatScreen />,
        },
        {
          path: 'chat/:chatId',
          element: <ChatScreen />,
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
