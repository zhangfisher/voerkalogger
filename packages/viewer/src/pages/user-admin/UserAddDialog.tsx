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
import { Edit, Plus } from 'lucide-react';
import { useState } from 'react';
import { UserAddForm } from './UserAddForm';
export interface UserAddProps {
  onSubmit: (values: any) => void;
}

export const UserAddDialog: React.FC<UserAddProps> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false);
  function onSubmitSuccess() {
    setOpen(false);
    onSubmit();
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-primary" variant="ghost">
          <Plus></Plus>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-2 w-full">
        <DialogHeader>
          <DialogTitle>添加用户</DialogTitle>
        </DialogHeader>
        {/* {JSON.stringify(form)} */}
        <UserAddForm onSubmitSuccess={onSubmitSuccess}></UserAddForm>
      </DialogContent>
    </Dialog>
  );
};
