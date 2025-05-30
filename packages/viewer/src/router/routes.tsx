import { lazy } from 'react';
import { Outlet } from 'react-router';
import Login from '@/pages/login/index';
import AuthLayout from './AuthLayout';
import SuspenseLayout from './SuspenseLayout';
import NavigateLayout from './NavigateLayout';
// const Home = lazy(() => import("@/pages/home/index"));
const Root = lazy(() => import('@/pages/root/index'));
const Settings = lazy(() => import('@/pages/settings/index'));
const Call = lazy(() => import('@/pages/call/index'));
const Contacts = lazy(() => import('@/pages/contacts/index'));
const Dial = lazy(() => import('@/pages/dial'));
const About = lazy(() => import('@/pages/about'));
// const OperationLog = lazy(() => import('@/pages/operation-log'));
const Log = lazy(() => import('@/pages/log'));
const CallAdmin = lazy(() => import('@/pages/call-admin/index'));
const UserAdmin = lazy(() => import('@/pages/user-admin'));
const Calling = lazy(() => import('@/pages/calling'));
const CallingOut = lazy(() => import('@/pages/calling-out'));
const Favorite = lazy(() => import('@/pages/favorite'));
const ContactsStarMarked = lazy(() => import('@/pages/contacts-starmarked'));
import { testRoutes } from './test-routes';
export const routes = [
  {
    path: '/',
    // index: true,
    element: (
      <NavigateLayout>
        <Outlet></Outlet>
      </NavigateLayout>
    ),
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      // home
      {
        path: '/',
        // index: true,
        element: (
          // 认证与懒加载
          <AuthLayout>
            <SuspenseLayout>
              <Outlet></Outlet>
            </SuspenseLayout>
          </AuthLayout>
        ),
        children: [
          {
            // index: true,
            path: '/',
            element: <Root></Root>,
            children: [
              { index: true, element: <Contacts /> },

              {
                path: '/call',
                element: <Call></Call>,
              },
              {
                path: '/contacts',
                element: <Contacts></Contacts>,
              },
              {
                path: '/contacts/star',
                element: <ContactsStarMarked></ContactsStarMarked>,
              },
              {
                path: '/favorite',
                element: <Favorite></Favorite>,
              },
              {
                path: '/about',
                element: <About></About>,
              },
              {
                path: '/settings',
                element: <Settings></Settings>,
              },
              // 管理功能
              {
                path: '/admin',
                element: <Outlet></Outlet>,
                children: [
                  {
                    path: 'user',
                    element: <UserAdmin></UserAdmin>,
                  },
                  {
                    path: 'call',
                    element: <CallAdmin></CallAdmin>,
                  },
                  // {
                  //   path: 'operation-log',
                  //   element: <OperationLog></OperationLog>,
                  // },
                  {
                    path: 'log',
                    element: <Log></Log>,
                  },
                ],
              },
              {
                path: '/dial',
                element: <Dial></Dial>,
              },
              {
                path: '*',
                element: <Contacts />,
              },
            ],
          },
          // 通话
          {
            path: '/calling',
            element: <Calling></Calling>,
          },
          {
            path: '/calling-out',
            element: <CallingOut></CallingOut>,
          },
        ],
      },
      ...testRoutes,
    ],
  },
];
