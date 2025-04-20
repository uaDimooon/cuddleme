import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function getIntentFromPrompt(input) {
  const response = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a helpful assistant who classifies user requests.' },
      { role: 'user', content: input }
    ],
    model: 'gpt-3.5-turbo',
    temperature: 0.2
  });

  const content = response.choices[0].message.content;

  // Rudimentary intent detection (for now, you can improve)
  if (/book.*\bmax\b/i.test(input)) {
    return { intent: 'create_booking', dogName: 'Max' };
  }

  if (/who.*booked.*today/i.test(input)) {
    return { intent: 'fetch_bookings' };
  }

  return { intent: 'unknown' };
}
