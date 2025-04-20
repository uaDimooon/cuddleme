import OpenAI from 'openai';
import { getIntentFromPrompt } from './prompts.js';
import { db } from '../config/db.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const handleNaturalRequest = async (_, { input }) => {
   try {
    console.log('Received input:', input);
    const intent = await getIntentFromPrompt(input);
    console.log('Parsed intent:', intent);

  if (intent.intent === 'fetch_bookings') {
    const result = await db.query(
      `SELECT booking.*, dog.name AS dog_name FROM booking
       JOIN dog ON booking.dog_id = dog.id
       WHERE CURRENT_DATE = DATE(start_time)`
    );
    console.log('Bookings result:', result.rows);

    if (result.rows.length === 0) {
      return 'No bookings for today.';
    }

    return result.rows.map(b => `Booking: ${b.dog_name} from ${b.start_time} to ${b.end_time}`).join('\n');
  }

  if (intent.intent === 'create_booking' && intent.dogName) {
    const dogRes = await db.query('SELECT id FROM dog WHERE name = $1 LIMIT 1', [intent.dogName]);
    if (dogRes.rows.length === 0) return `No dog named ${intent.dogName} found.`;

    const sitterId = '6809254f-0b57-4d1a-8381-d8e4bed0dfd5'; // Replace with actual user
    const dogId = dogRes.rows[0].id;
    const startTime = new Date().toISOString();
    const endTime = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();

    await db.query(
      'INSERT INTO booking (dog_id, sitter_id, start_time, end_time) VALUES ($1, $2, $3, $4)',
      [dogId, sitterId, startTime, endTime]
    );

    return `Booking created for ${intent.dogName}.`;
  }

  return "Sorry, I couldn't understand your request.";
} catch(err) {
    console.error('Error in handleNaturalRequest:', err);
    throw new Error('Unexpected error in natural request handler');
}
};
