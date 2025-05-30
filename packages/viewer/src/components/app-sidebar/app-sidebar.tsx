/*
 * @FilePath: \voerka-phone\projects\web-client\src\components\app-sidebar\app-sidebar.tsx
 * @Author: zk.su
 * @Date: 2025-02-25 15:18:13
 * @LastEditTime: 2025-04-15 12:01:24
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { SidebarFooter } from '@/components/ui/sidebar';
import { useModuleStore } from '@voerka/react';
import { useRequest } from 'alova/client';
import { FlaskConical, Info, NotepadText, Settings } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import MenuItem from './MenuItem';
import { cn } from '@/lib/utils';
const testItems = import.meta.env.DEV
    ? [
          {
              title: 'Test',
              url: '/test',
              icon: FlaskConical,
          },
      ]
    : [];
const normalItems = [
    {
        title: '日志',
        url: '/log',
        icon: NotepadText,
    },

    // {
    //   title: "配置",
    //   url: "/calling",
    //   icon: calling,
    // },
];
const contentItems = [...normalItems, ...testItems];
export function AppSidebar() {
    const location = useLocation();

    const navigate = useNavigate();

    //获取未读数量
    return (
        <div className="flex flex-col items-center h-full text-xl shadow-md bg-sidebar">
            <div className="flex flex-col items-center flex-1">
                <div className="flex flex-col p-2 center">
                    {/* 通讯录 */}
                    {contentItems.map((item, index) => {
                        return (
                            <MenuItem
                                as-child
                                key={index}
                                className={cn({
                                    'bg-primary/10 dark:bg-primary/10 active:bg-primary/20 dark:active:bg-primary/20':
                                        location.pathname.startsWith(item.url) || (item.url === '/contacts' && location.pathname === '/'), // 特殊处理
                                })}
                                isActive={location.pathname.startsWith(item.url)}>
                                <Link key={item.url} to={item.url} title={item.title}>
                                    <item.icon className="!size-5" />
                                </Link>
                            </MenuItem>
                        );
                    })}
                </div>
            </div>
            <SidebarFooter className="center">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn({
                                'bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground':
                                    location.pathname.startsWith('/settings') || location.pathname.startsWith('/about'),
                            })}>
                            <Settings className="!size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        <DropdownMenuItem
                            onClick={() => navigate('/settings')}
                            className={cn('w-auto', {
                                'bg-primary hover:bg-primary/90 text-primary-foreground': location.pathname.startsWith('/settings'),
                            })}>
                            <Settings />
                            配置
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => navigate('/about')}
                            className={cn('w-auto', {
                                'bg-primary hover:bg-primary/90 text-primary-foreground': location.pathname.startsWith('/about'),
                            })}>
                            <Info />
                            关于
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </div>
    );
}
