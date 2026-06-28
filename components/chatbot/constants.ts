export const quickStartSuggestions = [
  { label: '🍳 Remix Resep Apa?', prompt: 'Apa itu Remix dan bagaimana cara membuat resep dari bahan sisa?' },
  { label: '📸 Fitur Picker', prompt: 'Apa fungsi Remix Picker dan bagaimana cara memindai bahan makanan?' },
  { label: '🎮 Remix Game', prompt: 'Remix Game apa? Bagaimana cara bermain game anti limbah makanan?' },
];

export const initialWelcomeMessage = {
  id: 1,
  text: 'Halo! 👋 Saya asisten Foodremix. Saya di sini untuk membantu Anda mengenal platform kami yang bertema mengurangi limbah makanan.\n\nAda yang ingin Anda ketahui tentang Foodremix?',
  sender: 'bot' as const,
};

export const TYPING_DELAY_MS = 1200;
