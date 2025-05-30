import { lazy } from 'react';
import { Outlet } from 'react-router';
import SuspenseLayout from './SuspenseLayout';
const Root = lazy(() => import('@/pages/root'));
const About = lazy(() => import('@/pages/about'));
const Settings = lazy(() => import('@/pages/settings'));
// 业务
const Log = lazy(() => import('@/pages/log'));

import { testRoutes } from './test-routes';
export const routes = [
    {
        path: '/',
        // index: true,
        element: (
            // 认证与懒加载
            <SuspenseLayout>
                <Outlet></Outlet>
            </SuspenseLayout>
        ),
        children: [
            {
                // index: true,
                path: '/',
                element: <Root></Root>,
                children: [
                    { index: true, element: <Log /> },
                    {
                        path: '/about',
                        element: <About></About>,
                    },
                    {
                        path: '/settings',
                        element: <Settings></Settings>,
                    },
                ],
            },
        ],
        ...testRoutes,
    },
];
