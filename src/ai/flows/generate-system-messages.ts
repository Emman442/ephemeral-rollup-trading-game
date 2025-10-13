'use server';

/**
 * @fileOverview An AI agent for generating mock system messages for the trading competition chat panel.
 *
 * - generateSystemMessage - A function that generates a system message.
 * - GenerateSystemMessageInput - The input type for the generateSystemMessage function.
 * - GenerateSystemMessageOutput - The return type for the generateSystemMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSystemMessageInputSchema = z.object({
  roundEndingIn: z.number().optional().describe('Number of seconds until the round ends. If null, the round is not ending.'),
  userName: z.string().optional().describe('The user name of the person who made a trade. If null, no one made a trade.'),
  pnl: z.number().optional().describe('Profit and loss of the trade. Required when a user name is provided.'),
});
export type GenerateSystemMessageInput = z.infer<typeof GenerateSystemMessageInputSchema>;

const GenerateSystemMessageOutputSchema = z.object({
  message: z.string().describe('The generated system message.'),
});
export type GenerateSystemMessageOutput = z.infer<typeof GenerateSystemMessageOutputSchema>;

export async function generateSystemMessage(input: GenerateSystemMessageInput): Promise<GenerateSystemMessageOutput> {
  return generateSystemMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSystemMessagePrompt',
  input: {schema: GenerateSystemMessageInputSchema},
  output: {schema: GenerateSystemMessageOutputSchema},
  prompt: `You are the voice of a real-time trading competition. Generate a short system message for the chat panel.

  If the round is ending soon, announce it.
  If a user made a trade, congratulate them, and announce their P&L.
  Keep it brief and exciting.

  Examples:
  - Round ending in 15 seconds!
  - AlphaWolf just closed a trade +$250 PnL!

  Here's the info:
  Round ending in: {{roundEndingIn}} seconds
  User: {{userName}}
P&L: {{pnl}}
  `,
});

const generateSystemMessageFlow = ai.defineFlow(
  {
    name: 'generateSystemMessageFlow',
    inputSchema: GenerateSystemMessageInputSchema,
    outputSchema: GenerateSystemMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
