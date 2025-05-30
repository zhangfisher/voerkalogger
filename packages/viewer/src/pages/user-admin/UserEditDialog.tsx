// UserFormDialog.tsx
import { UserEntity } from '@/api/user.types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { useState } from 'react';
import { UserEditForm } from './UserEditForm';
export interface UserEditProps {
  user: UserEntity;
  onSubmit: (values: any) => void;
}

export const UserEditDialog: React.FC<UserEditProps> = ({ user, onSubmit }) => {
  const [open, setOpen] = useState(false);
  function onSubmitSuccess() {
    setOpen(false);
    onSubmit();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Edit className="text-blue-500"></Edit>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-2 w-full">
        <DialogHeader>
          <DialogTitle>{'编辑用户'}</DialogTitle>
        </DialogHeader>
        {/* {JSON.stringify(form)} */}
        <UserEditForm user={user} onSubmitSuccess={onSubmitSuccess}></UserEditForm>
      </DialogContent>
    </Dialog>
  );
};
