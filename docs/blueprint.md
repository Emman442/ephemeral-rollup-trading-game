# **App Name**: TradeArena

## Core Features:

- Mock Wallet Connection: Simulate wallet connection using the Solana Wallet Adapter UI to allow users to connect and disconnect virtually.
- Real-Time Price Feed: Display live-updating mock prices for various assets, simulating real-time market data using setInterval randomizer.
- Trading Panel: Provide a trading interface with mock balance, open positions, and P&L calculations, allowing users to simulate buying, selling, and closing positions with leverage.
- Animated Leaderboard: Display a leaderboard with mock user data, animated rank changes, and highlighting the current user’s position, with auto-scrolling for larger lists.
- Round Timer with Modal: Implement a circular countdown timer that visually and numerically displays the time remaining in a round and triggers a Round Over modal when the timer hits zero.
- Live Chat Panel: Implement a real-time chat panel with mock user aliases, timestamps, and simulated system messages to emulate a live trading environment.
- System Message Generator: An LLM tool that periodically generates mock 'system messages' for the chat panel, such as round updates or trade announcements.

## Style Guidelines:

- Primary color: Solana Green (#14F195) for a vibrant, energetic feel.
- Secondary color: Deep Purple (#9945FF) for accents and highlights, complementing the green.
- Background color: Dark charcoal (#0D0D10) to enhance contrast and provide a modern, sleek appearance.
- Font: 'Space Grotesk' (sans-serif) for headings and UI elements, giving a techy, futuristic vibe. If long text is anticipated, use 'Inter' for body
- Use 'lucide-react' icons, with neon color highlights.
- Responsive layout with a 3-column structure on desktop, transitioning to a single column on mobile, incorporating a bottom drawer for chat and sticky trade buttons.
- Subtle animations using Framer Motion for price ticks, leaderboard updates, and modal transitions to create a dynamic and engaging user experience.