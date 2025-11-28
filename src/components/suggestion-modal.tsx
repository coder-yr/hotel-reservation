"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { SuggestAlternativeAccommodationsOutput } from "@/ai/flows/suggest-alternative-accommodations"
import { Wand2 } from "lucide-react"

interface SuggestionModalProps {
  isOpen: boolean
  onClose: () => void
  suggestions: SuggestAlternativeAccommodationsOutput
}

export function SuggestionModal({ isOpen, onClose, suggestions }: SuggestionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <Wand2 className="h-6 w-6 text-primary" />
            Alternative Suggestions
          </DialogTitle>
          <DialogDescription>
            Your selected room is unavailable. Here are some AI-powered alternatives based on your preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted/50 p-4 rounded-lg space-y-3 max-h-[300px] overflow-y-auto">
            {suggestions.alternativeAccommodations.split(',').map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-background p-3 rounded-md shadow-sm border border-border/50">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                  {i + 1}
                </div>
                <span className="text-sm font-medium text-foreground">{item.trim()}</span>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Close</Button>
          <Button onClick={onClose} className="bg-accent text-accent-foreground hover:bg-accent/90">Book an Alternative</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
