import { CreateWireTransferSchema } from "@/schemas/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { AmountInput } from "@/components/amount-input";
import { DatePicker } from "@/components/date-picker";
import { Select } from "@/components/select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { convertAmountToMiliunits } from "@/lib/utils";
import { formatISO } from "date-fns";

export const formSchema = z.object({
  date: z.coerce.date(),
  amount: z.string(),
  accountBankSourceId: z.string(),
  accountBankTargetId: z.string(),
  categorieId: z.string().optional(),
  notes: z.string().optional(),
  payee: z.string(),
});
export const apiSchema = CreateWireTransferSchema;

export type FormValues = z.infer<typeof formSchema>;
export type ApiValues = z.infer<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  categoryOptions?: { label: string; value: string }[];
  onCreateCategory: (name: string) => void;
  accountOptions?: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
};

export const WireForm = ({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  categoryOptions,
  onCreateCategory,
  accountOptions,
  onCreateAccount,
}: Props) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (formValues: FormValues) => {
    const amount = parseFloat(formValues.amount);
    const miliunits = convertAmountToMiliunits(amount);
    onSubmit({
      ...formValues,
      date: new Date(formatISO(formValues.date, { representation: "date" })),
      amount: miliunits,
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 pt-4"
      >
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountBankSourceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Source</FormLabel>
              <FormControl>
                <Select
                  onChange={field.onChange}
                  onCreate={onCreateAccount}
                  value={field.value}
                  options={accountOptions}
                  placeholder="Select an account"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountBankTargetId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Target</FormLabel>
              <FormControl>
                <Select
                  onChange={field.onChange}
                  onCreate={onCreateAccount}
                  value={field.value}
                  options={accountOptions}
                  placeholder="Select an account"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categorieId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  onChange={field.onChange}
                  onCreate={onCreateCategory}
                  value={field.value}
                  options={categoryOptions}
                  placeholder="Select an category"
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  {...field}
                  placeholder="Add a payee"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  disabled={disabled}
                  {...field}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  disabled={disabled}
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Optional notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={disabled} className="w-full">
          {id ? "Save Changes" : "Create Transaction"}
        </Button>
        {!!id && (
          <Button
            variant="destructive"
            type="button"
            onClick={handleDelete}
            disabled={disabled}
            className="w-full"
          >
            <Trash className="mr-2 size-4" />
            Delete
          </Button>
        )}
      </form>
    </Form>
  );
};
