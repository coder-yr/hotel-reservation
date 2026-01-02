
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Star, Send } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { createReview } from "@/lib/data";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const addReviewFormSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating." }).max(5),
  comment: z.string().min(10, {
    message: "Comment must be at least 10 characters.",
  }).max(500, {
    message: "Comment cannot be longer than 500 characters."
  }),
});

type AddReviewFormValues = z.infer<typeof addReviewFormSchema>;

interface AddReviewFormProps {
  hotelId: string;
  onReviewAdded: () => void;
}

export function AddReviewForm({ hotelId, onReviewAdded }: AddReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm<AddReviewFormValues>({
    resolver: zodResolver(addReviewFormSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AddReviewFormValues) => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Not logged in' });
      return;
    }

    try {
      await createReview({
        ...data,
        hotelId,
        userId: user.id,
        userName: user.name,
        userAvatar: `https://i.pravatar.cc/150?u=${user.id}`,
        userCountry: "Unknown"
      });
      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });
      form.reset();
      setHoverRating(0); // Reset visual state
      onReviewAdded();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardHeader className="bg-slate-50/50 pb-4">
        <CardTitle className="text-xl font-semibold">Write a Review</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">How was your stay?</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={cn(
                            "transition-all duration-200 transform hover:scale-110 focus:outline-none",
                            (hoverRating || field.value) >= star
                              ? "text-yellow-400"
                              : "text-slate-200"
                          )}
                          onClick={() => field.onChange(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                        >
                          <Star className={cn("w-8 h-8", (hoverRating || field.value) >= star ? "fill-current" : "")} />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-slate-500 font-medium w-20">
                        {hoverRating ? (
                          hoverRating === 5 ? "Excelent!" :
                            hoverRating === 4 ? "Good" :
                              hoverRating === 3 ? "Average" :
                                hoverRating === 2 ? "Poor" : "Terrible"
                        ) : (field.value ? (
                          field.value === 5 ? "Excellent!" :
                            field.value === 4 ? "Good" :
                              field.value === 3 ? "Average" :
                                field.value === 2 ? "Poor" : "Terrible"
                        ) : "")}
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">Tell us about your experience</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What did you like? What could be improved?"
                      className="resize-none h-32 text-base focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full sm:w-auto">
              {form.formState.isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Review
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
