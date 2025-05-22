
import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";

// Define the schema for group data
const groupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  ageRange: z.string().min(1, "Age range is required"),
  coachName: z.string().min(2, "Coach name is required"),
  sessions: z.string().min(1, "At least one session is required"),
});

export type GroupFormValues = z.infer<typeof groupSchema>;

type GroupDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: GroupFormValues) => void;
  defaultValues?: Partial<GroupFormValues>;
  title: string;
};

export const GroupDialog: React.FC<GroupDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {
    name: "",
    description: "",
    ageRange: "",
    coachName: "",
    sessions: "",
  },
  title,
}) => {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues,
  });

  const handleSubmit = (values: GroupFormValues) => {
    onSubmit(values);
    form.reset();
    onOpenChange(false);
    toast({
      title: "Success",
      description: `Group ${title === "Edit Group" ? "updated" : "created"} successfully`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Group name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Group description" 
                      className="h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ageRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age Range</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 13-15" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="coachName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coach</FormLabel>
                  <FormControl>
                    <Input placeholder="Coach name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sessions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sessions</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter sessions, one per line" 
                      className="h-20" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="sm:justify-end">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-swimming-600 hover:bg-swimming-700"
              >
                {title === "Edit Group" ? "Save Changes" : "Create Group"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
