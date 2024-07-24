import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import useCreateAccount from "@/features/accountBank/api/use-create-account";
import {
  AccountForm,
  FormValues,
} from "@/features/accountBank/components/account-form";
import { useNewAccount } from "@/features/accountBank/hooks/use-new-account";
import { useCurrentUser } from "@/hooks/use-current-user";

export const NewAccountSheet = () => {
  const user = useCurrentUser();
  const { isOpen, onClose } = useNewAccount();
  const mutation = useCreateAccount();

  const onSubmit = (formValues: FormValues) => {
    mutation.mutate(formValues, {
      onSuccess: () => {
        onClose();
      },
    });
  };
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Account</SheetTitle>
          <SheetDescription>
            Create a new account to track your transactions
          </SheetDescription>
        </SheetHeader>
        <AccountForm
          onSubmit={onSubmit}
          defaultValues={{ name: "", userId: user?.id ? user.id : "" }}
          disabled={mutation.isPending}
        />
      </SheetContent>
    </Sheet>
  );
};
