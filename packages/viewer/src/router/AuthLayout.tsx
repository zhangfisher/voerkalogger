/**
 * @author
 * @file AuthLayout.jsx
 * @fileBase AuthLayout
 * @path src\router\AuthLayout.jsx
 * @from
 * @desc
 * @todo
 *
 *
 * @done
 * @example
 */

import { UserModule } from '@/app';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useModuleStore, useModule } from '@voerka/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
interface AuthLayoutProps {
    children: any;
}

function AuthLayout({ children }: AuthLayoutProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const userModule = useModule<UserModule>('user');
    const userStore = useModuleStore('user');
    // @ts-ignore
    const [user] = userStore.useReactive('user');
    useEffect(() => {
        async function doAuth() {
            if (!user) {
                try {
                    const user = await userModule.initUser();
                    if (!user) {
                        navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
                            replace: true,
                        });
                    }
                } catch (error) {
                    navigate(`/login?redirect=${encodeURIComponent(location.pathname)}`, {
                        replace: true,
                    });
                }
            }
        }
        doAuth();
    }, [user]);
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner></LoadingSpinner>
            </div>
        );
    }
    return children;
}
export default AuthLayout;
