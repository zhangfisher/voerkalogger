/**
 * @author
 * @file ContactItem.tsx
 * @fileBase ContactItem
 * @path projects\web-client\src\pages\contact\ContactItem.tsx
 * @from
 * @desc
 * @example
 */

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

import { Phone } from 'lucide-react';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { cn } from '@/lib/utils';
import { useCallModule } from '@/app/modules/call/hooks/useCallModule';
import { useModuleStore } from '@voerka/react';
import { toast } from 'sonner';
import { updateContact } from '@/api/contact';
import { UserModule } from '@/app/modules/user';
import { Badge } from '@/components/ui/badge';

export interface Contact {
    id: string;
    title?: string;
    avatar?: string;
    tags: string[];
    groups: string;
    role: string;
}
export interface ContactItemProps {
    contact: Contact;
    onStarChange?: Function;
    className?: string;
}
export const ContactBar: React.FC<ContactItemProps> = ({ contact, onStarChange, className }) => {
    const callStore = useModuleStore('call');
    const [isOn] = callStore.useReactive('on');
    const callingManager = useCallModule();
    async function toggleStar() {
        try {
            const tags = contact?.tags?.includes?.('star')
                ? contact?.tags?.filter?.((tag) => tag !== 'star')
                : [...(contact?.tags || []), 'star'];
            await updateContact(contact.id, {
                tags,
            });
            contact.tags = tags;
            toast.success(`切换${contact.title}星标成功`);
            onStarChange?.(contact);
        } catch (error) {
            toast.error(`切换${contact.title}星标失败`, {
                description: error?.message,
            });
        }
    }
    function callOut(id: string) {
        callingManager?.call(id);
    }
    return (
        <div
            className={cn(
                'flex flex-row items-center justify-between p-2 space-x-2 rounded-md bg-card text-card-foreground @container text-xl',
                className,
            )}>
            {/* <div className=""> */}
            <Avatar>
                {/* 用户 */}
                <AvatarImage src={contact.avatar} />
                <AvatarFallback>{contact.title?.substring(0, 2)}</AvatarFallback>
            </Avatar>
            {/* </div> */}
            <div className="flex flex-col flex-1 min-w-0 @xl:flex-row">
                <h2 className="truncate" title={contact.title}>
                    {contact.title}
                </h2>
            </div>
            <div className="flex flex-col flex-1 min-w-0 @xl:flex-row">
                <h2 className="truncate" title={contact.id}>
                    {contact.id}
                </h2>
            </div>
            {/* 用户分组 */}
            <div className="flex flex-1 min-w-0 @xl:flex-row">
                <Badge className="min-w-0 truncate" variant="secondary" title={contact.groups}>
                    {contact.groups.split('/').join(' / ')}
                </Badge>
            </div>
            {/* 星标 */}
            <Button
                title={`切换收藏${contact.title}`}
                variant={'ghost'}
                onClick={() => toggleStar()}>
                {contact.tags?.includes?.('star') ? (
                    <StarFilled className="text-yellow-500" />
                ) : (
                    <StarOutlined />
                )}
            </Button>
            <div>
                <Button
                    title={`打电话给${contact.title}`}
                    disabled={!isOn}
                    variant="ghost"
                    onClick={() => callOut(contact.id)}>
                    <Phone className="text-green-500"></Phone>
                </Button>
            </div>
        </div>
    );
};
