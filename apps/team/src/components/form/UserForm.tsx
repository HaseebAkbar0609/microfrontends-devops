"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { ControllerRenderProps } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

type UserFormValues = z.infer<typeof schema>;

interface UserFormProps {
  onSubmit: (data: UserFormValues) => void;
  defaultValues?: Partial<UserFormValues>;
  isLoading?: boolean;
}

export default function UserForm({
  onSubmit,
  defaultValues,
  isLoading = false,
}: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-md mx-auto p-6 border rounded-lg shadow-sm bg-white space-y-6"
      >
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }: { field: ControllerRenderProps<UserFormValues, "name"> }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }: { field: ControllerRenderProps<UserFormValues, "email"> }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={form.formState.isSubmitting || isLoading}>
          {form.formState.isSubmitting || isLoading ? "Saving..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
