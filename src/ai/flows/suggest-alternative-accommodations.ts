'use server';

/**
 * @fileOverview An AI agent that suggests alternative accommodations.
'use server';

/**
 * @fileOverview An AI agent that suggests alternative accommodations.
 *
 * - suggestAlternativeAccommodations - A function that handles the suggestion process.
 * - SuggestAlternativeAccommodationsInput - The input type for the suggestAlternativeAccommodations function.
 * - SuggestAlternativeAccommodationsOutput - The return type for the suggestAlternativeAccommodations function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { Hotel } from '@/lib/types';

const SuggestAlternativeAccommodationsInputSchema = z.object({
  location: z.string().describe('The location of the desired accommodation.'),
  priceRange: z.string().describe('The desired price range for the accommodation.'),
  amenities: z.string().describe('The desired amenities for the accommodation.'),
  unavailableAccommodation: z.string().describe('The name of the unavailable accommodation.'),
});
export type SuggestAlternativeAccommodationsInput = z.infer<
  typeof SuggestAlternativeAccommodationsInputSchema
>;

const SuggestAlternativeAccommodationsOutputSchema = z.object({
  alternativeAccommodations: z
    .string()
    .describe('A list of alternative accommodations based on the provided criteria.'),
});
export type SuggestAlternativeAccommodationsOutput = z.infer<
  typeof SuggestAlternativeAccommodationsOutputSchema
>;

export async function suggestAlternativeAccommodations(
  input: SuggestAlternativeAccommodationsInput
): Promise<SuggestAlternativeAccommodationsOutput> {
  return suggestAlternativeAccommodationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeAccommodationsPrompt',
  input: {
    schema: z.object({
      ...SuggestAlternativeAccommodationsInputSchema.shape,
      availableHotelsContext: z.string()
    })
  },
  output: { schema: SuggestAlternativeAccommodationsOutputSchema },
  prompt: `The user's preferred accommodation, {{{unavailableAccommodation}}}, is unavailable. 
  
  Here is a list of REAL available hotels in the database:
  {{{availableHotelsContext}}}
  
  Suggest alternative accommodations in {{{location}}} based on the following criteria:
  Price Range: {{{priceRange}}}
  Amenities: {{{amenities}}}
  
  IMPORTANT: You must ONLY suggest hotels from the "REAL available hotels" list provided above. Do not hallucinate or make up hotels. If no hotels match perfectly, suggest the closest matches from the list.`,
});

const suggestAlternativeAccommodationsFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeAccommodationsFlow',
    inputSchema: SuggestAlternativeAccommodationsInputSchema,
    outputSchema: SuggestAlternativeAccommodationsOutputSchema,
  },
  async input => {
    // RAG: Fetch available hotels from Firestore
    const hotelsRef = collection(db, 'hotels');
    // In a real app, we might do more complex filtering here (e.g. vector search or advanced queries)
    // For now, we fetch approved hotels and let the LLM filter/rank them.
    const q = query(hotelsRef, where('status', '==', 'approved'));
    const querySnapshot = await getDocs(q);

    const hotels = querySnapshot.docs.map(doc => {
      const data = doc.data() as Hotel;
      return {
        name: data.name,
        location: data.location,
        description: data.description,
        facilities: data.facilities,
        category: data.category
      };
    });

    const availableHotelsContext = JSON.stringify(hotels, null, 2);

    const { output } = await prompt({
      ...input,
      availableHotelsContext
    });
    return output!;
  }
);
