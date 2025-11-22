import { config } from 'dotenv';
config();

console.log("Current Directory:", process.cwd());
console.log("GOOGLE_API_KEY present:", !!process.env.GOOGLE_API_KEY);
console.log("GEMINI_API_KEY present:", !!process.env.GEMINI_API_KEY);

// Use dynamic import to ensure dotenv config runs BEFORE the flow (and Genkit) is initialized
(async () => {
    await import('@/ai/flows/suggest-alternative-accommodations');
})();