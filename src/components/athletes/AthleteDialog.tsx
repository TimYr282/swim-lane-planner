
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export interface Athlete {
  id: number;
  name: string;
  age: number;
  group: string;
  specialties: string[];
  image: string;
}

const athleteFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  age: z.coerce.number().int().min(5, {
    message: "Age must be at least 5.",
  }).max(30, {
    message: "Age must not exceed 30.",
  }),
  group: z.string().min(1, {
    message: "Group is required",
  }),
  specialties: z.string().min(1, {
    message: "At least one specialty is required",
  }),
  image: z.string().default("/placeholder.svg"),
});

type AthleteForm = z.infer<typeof athleteFormSchema>;

interface AthleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  athlete?: Athlete;
  onSave: (athlete: Partial<Athlete>) => void;
}

const AthleteDialog = ({ open, onOpenChange, athlete, onSave }: AthleteDialogProps) => {
  const isEditing = !!athlete?.id;
  
  const form = useForm<AthleteForm>({
    resolver: zodResolver(athleteFormSchema),
    defaultValues: {
      name: athlete?.name || '',
      age: athlete?.age || 12,
      group: athlete?.group || 'Junior A',
      specialties: athlete?.specialties?.join(", ") || '',
      image: athlete?.image || '/placeholder.svg',
    }
  });

  const handleSubmit = (data: AthleteForm) => {
    onSave({
      id: athlete?.id,
      ...data,
      specialties: data.specialties.split(',').map(s => s.trim()).filter(Boolean),
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Athlete' : 'Add Athlete'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter athlete name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" min={5} max={30} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="group"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Group</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter group (e.g. Junior A)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="specialties"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Specialties</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter specialties (comma separated)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit">{isEditing ? 'Update' : 'Add'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AthleteDialog;
