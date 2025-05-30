/**
 * @author
 * @file Avatar.tsx
 * @fileBase Avatar
 * @path projects\web-client\src\pages\user-admin\Avatar.tsx
 * @from
 * @desc
 * @example
 */
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { uploadAvatar } from '@/api/user';
import { useRef } from 'react';
export interface AvatarUploaderProps {
    value: any;
    onValueChange: (value: any) => void;
}
export const AvatarUploader: React.FC<AvatarUploaderProps> = ({ value, onValueChange }) => {
    async function handleAvatarInputChange(file: any) {
        if (!file) {
            return;
        }
        try {
            if (file.size > 2 * 1024 * 1024) {
                throw new Error('头像大小不能超过2M');
            }
            const result = await uploadAvatar(file);
            onValueChange(result);
            toast.success('头像上传成功');
        } catch (error: any) {
            toast.error('头像上传失败', {
                description: error.message,
            });
            onValueChange('');
            // 清空
        }
    }
    const inputRef = useRef(null);

    const handleAvatarClick = () => {
        inputRef.current.click();
    };

    return (
        <div className="grid justify-items-center">
            <Avatar className="w-24 h-24" onClick={handleAvatarClick} title="点击更换头像">
                <AvatarImage src={value} key={value} />
                <AvatarFallback>头像</AvatarFallback>
            </Avatar>
            <Input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleAvatarInputChange(e.target.files?.[0])}
            />
        </div>
    );
};

// 默认导出
export default AvatarUploader;
