
import React from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  parentName: z.string().min(2, { message: "Your name is required" }),
  athleteName: z.string().min(2, { message: "Athlete name is required" }),
  willParticipate: z.enum(["yes", "no", "maybe"], { 
    required_error: "Please select if your athlete will participate" 
  }),
  canJudge: z.boolean().default(false),
  willDrive: z.boolean().default(false),
  seatsAvailable: z.string().optional()
    .refine((val) => !val || !isNaN(Number(val)), {
      message: "Number of seats must be a valid number",
    }),
});

export interface ParticipationForm {
  id: number;
  competitionId: number;
  parentName: string;
  athleteName: string;
  willParticipate: string;
  canJudge: boolean;
  willDrive: boolean;
  seatsAvailable?: string;
  submittedAt: Date;
}

interface ParticipationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (form: ParticipationForm) => void;
  competitionId: number;
  competitionTitle: string;
}

export function ParticipationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  competitionId,
  competitionTitle
}: ParticipationFormDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentName: "",
      athleteName: "",
      willParticipate: "yes",
      canJudge: false,
      willDrive: false,
      seatsAvailable: ""
    },
  });

  const watchWillDrive = form.watch("willDrive");

  function handleSubmit(values: z.infer<typeof formSchema>) {
    const submission: ParticipationForm = {
      id: Date.now(),
      competitionId,
      ...values,
      submittedAt: new Date()
    };
    
    onSubmit(submission);
    onOpenChange(false);
    form.reset();
    
    toast({
      title: "Form Submitted",
      description: "Thank you for your response!",
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Participation Form</DialogTitle>
          <DialogDescription>
            Please fill out this form for the competition: <strong>{competitionTitle}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="parentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Parent/Guardian Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="athleteName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Athlete Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Athlete Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="willParticipate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Will your athlete participate?</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="yes" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Yes, will participate
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="no" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          No, cannot participate
                        </FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="maybe" />
                        </FormControl>
                        <FormLabel className="font-normal">
                          Maybe / Not sure yet
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="canJudge"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I can volunteer as a judge/official
                    </FormLabel>
                    <FormDescription>
                      Check this if you're available to help as a judge or official
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="willDrive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      I can drive to the competition
                    </FormLabel>
                    <FormDescription>
                      Check this if you can provide transportation
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {watchWillDrive && (
              <FormField
                control={form.control}
                name="seatsAvailable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of additional seats available</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0"
                        placeholder="How many athletes can you transport?" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Submit Response</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ParticipationFormDialog;
