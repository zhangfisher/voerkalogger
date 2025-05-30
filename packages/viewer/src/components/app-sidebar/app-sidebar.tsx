/*
 * @FilePath: \voerka-phone\projects\web-client\src\components\app-sidebar\app-sidebar.tsx
 * @Author: zk.su
 * @Date: 2025-02-25 15:18:13
 * @LastEditTime: 2025-04-15 12:01:24
 * @LastEditors: zk.su
 * @Description:
 * @TODO:
 */
import { findUnreadCallCount } from '@/api/call-read';
import { cn, UserModule } from '@/app';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarFooter } from '@/components/ui/sidebar';
import { useModuleStore } from '@voerka/react';
import { useRequest } from 'alova/client';
import {
  Contact,
  FlaskConical,
  Info,
  NotepadText,
  Phone,
  Settings,
  UserPen,
  Users
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Button } from '../ui/button';
import { UserPanel } from '../user-panel';
import CallStatusCornerBadge from './call-status-corner-badge';
import CountBadge from './count-badge';
import MenuItem from './MenuItem';
import WrapBadge from './wrap-badge';
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
        title: '通讯录',
        url: '/contacts',
        icon: Contact,
    },
    {
        title: '最近通话',
        url: '/call',
        icon: Phone,
    },
    // {
    //   title: "收藏",
    //   url: "/favorite",
    //   icon: Star,
    // },
    // {
    //   title: "用户分组",
    //   url: "/group",
    //   icon: Users,
    // },
    // {
    //   title: "关于",
    //   url: "/about",
    //   icon: Ampersand,
    // },

    // {
    //   title: "配置",
    //   url: "/calling",
    //   icon: calling,
    // },
];
const contentItems = [...normalItems, ...testItems];
export function AppSidebar() {
    const userStore = useModuleStore<UserModule>('user');
    const [id] = userStore.useReactive('user.id');
    const [username] = userStore.useReactive('user.title');
    const [avatar] = userStore.useReactive('user.avatar');
    const [isAdmin] = userStore.useReactive('isAdmin');
    // const [username] = useReactive("user.name");
    const location = useLocation();
    // console.log(`location.pathname`, location.pathname);
    // const [currentPath, setCurrentPath] = useState(
    //     location.pathname === '/' ? '/contacts' : location.pathname,
    // );
    const navigate = useNavigate();
    const { data: unreadCount, send: getUnreadCount } = useRequest(findUnreadCallCount, {
        immediate: true,
        force: true,
    });
    useEffect(() => {
        getUnreadCount();
    }, [location.pathname.startsWith('/call')]);
    //获取未读数量
    return (
        <div className="flex flex-col items-center h-full text-xl shadow-md bg-sidebar">
            <div className="flex flex-col gap-2 p-2 center">
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <CallStatusCornerBadge>
                            <Avatar>
                                {/* 用户 */}
                                <AvatarImage src={avatar} />
                                <AvatarFallback>
                                    {('' + (username || id)).substring(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                        </CallStatusCornerBadge>
                        {/* <Button variant="ghost">
              <Menu></Menu>
            </Button> */}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        <UserPanel></UserPanel>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="flex flex-col items-center flex-1">
                <div className="flex flex-col p-2 center">
                    {/* 通讯录 */}
                    {contentItems.map((item, index) => {
                        if (item.url.startsWith('/call')) {
                            return (
                                <WrapBadge
                                    key={index}
                                    badge={
                                        !location.pathname.startsWith(item.url) &&
                                        unreadCount > 0 && <CountBadge value={unreadCount} />
                                    }>
                                    <MenuItem
                                        as-child
                                        isActive={location.pathname.startsWith(item.url)}>
                                        <Link key={item.url} to={item.url} title={item.title}>
                                            <item.icon className="!size-5" />
                                        </Link>
                                    </MenuItem>
                                </WrapBadge>
                            );
                        }
                        return (
                            <MenuItem
                                as-child
                                key={index}
                                className={cn({
                                    'bg-primary/10 dark:bg-primary/10 active:bg-primary/20 dark:active:bg-primary/20':
                                        location.pathname.startsWith(item.url) ||
                                        (item.url === '/contacts' && location.pathname === '/'), // 特殊处理
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
                {/* <ThemeModeToggle></ThemeModeToggle> */}
                {isAdmin && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button
                                variant="ghost"
                                size="icon"
                                className={cn({
                                    'bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground':
                                        location.pathname.startsWith('/admin/user') ||
                                        location.pathname.startsWith('/admin/call'),
                                })}>
                                <UserPen className="!size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="right">
                            <DropdownMenuItem
                                onClick={() => navigate('/admin/user')}
                                className={cn('w-auto', {
                                    'bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground':
                                        location.pathname.startsWith('/admin/user'),
                                })}>
                                <Users />
                                用户管理
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => navigate('/admin/call')}
                                className={cn('w-auto', {
                                    'bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground':
                                        location.pathname.startsWith('/admin/call'),
                                })}>
                                <Phone />
                                通话记录管理
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {isAdmin && (
                    <MenuItem as-child isActive={location.pathname.startsWith('/admin/log')}>
                        <Link to={'/admin/log'} title={'日志'}>
                            <NotepadText className="!size-5" />
                        </Link>
                    </MenuItem>
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn({
                                'bg-primary hover:bg-primary/90 text-primary-foreground hover:text-primary-foreground':
                                    location.pathname.startsWith('/settings') ||
                                    location.pathname.startsWith('/about'),
                            })}>
                            <Settings className="!size-5" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right">
                        <DropdownMenuItem
                            onClick={() => navigate('/settings')}
                            className={cn('w-auto', {
                                'bg-primary hover:bg-primary/90 text-primary-foreground':
                                    location.pathname.startsWith('/settings'),
                            })}>
                            <Settings />
                            配置
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => navigate('/about')}
                            className={cn('w-auto', {
                                'bg-primary hover:bg-primary/90 text-primary-foreground':
                                    location.pathname.startsWith('/about'),
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
