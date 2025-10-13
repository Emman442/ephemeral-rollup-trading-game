'use server';

/**
 * @fileOverview A flow to generate short, engaging animations highlighting leaderboard rank changes using generative AI.
 *
 * - animateLeaderboard - A function that handles the generation of leaderboard animation.
 * - AnimateLeaderboardInput - The input type for the animateLeaderboard function.
 * - AnimateLeaderboardOutput - The return type for the animateLeaderboard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnimateLeaderboardInputSchema = z.object({
  leaderboardState: z.array(
    z.object({
      rank: z.number().describe('The current rank of the user.'),
      avatar: z.string().optional().describe('URL or data URI of the user avatar.'),
      wallet: z.string().describe('The wallet address of the user.'),
      equity: z.number().describe('The current equity of the user.'),
      pnl: z.number().describe('The profit and loss of the user.'),
    })
  ).describe('The current state of the leaderboard.'),
  animationType: z.enum(['slide', 'fade']).describe('The type of animation to use for rank changes.'),
});

export type AnimateLeaderboardInput = z.infer<typeof AnimateLeaderboardInputSchema>;

const AnimateLeaderboardOutputSchema = z.object({
  animationDataUri: z.string().describe('A data URI containing the animation of the leaderboard rank changes.'),
  description: z.string().describe('A description of the animation generated.'),
});

export type AnimateLeaderboardOutput = z.infer<typeof AnimateLeaderboardOutputSchema>;

export async function animateLeaderboard(input: AnimateLeaderboardInput): Promise<AnimateLeaderboardOutput> {
  return animateLeaderboardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'animateLeaderboardPrompt',
  input: {schema: AnimateLeaderboardInputSchema},
  output: {schema: AnimateLeaderboardOutputSchema},
  prompt: `You are an expert in creating engaging animations for leaderboards in a trading competition.

  Based on the current state of the leaderboard and the desired animation type, generate a short animation that highlights the rank changes.
  The animation should be visually appealing and exciting, making the leaderboard feel more dynamic.

  Here's the current state of the leaderboard:
  {{#each leaderboardState}}
  Rank: {{rank}}, Wallet: {{wallet}}, Equity: {{equity}}, P&L: {{pnl}}
  {{/each}}

  Animation Type: {{animationType}}

  Create a description of the animation and, if possible, a data URI representing the animation (e.g., GIF, video).
  If creating the actual animation is not feasible, provide a detailed description of what the animation would look like.

  Focus on making the leaderboard feel competitive and engaging.  Describe keyframes in detail as if the animation will be handed to a video editor.
  Include the use of subtle movements, color changes, and visual effects to emphasize the changes in rank and equity.
  `,
});

const animateLeaderboardFlow = ai.defineFlow(
  {
    name: 'animateLeaderboardFlow',
    inputSchema: AnimateLeaderboardInputSchema,
    outputSchema: AnimateLeaderboardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
