import axios from 'axios';
import { OPENAI_API_KEY } from '@env';

export async function askAppAI(question) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are Masjid Finder's built-in AI assistant.
You can answer any question the user asks — Islamic, technical, or general.
If the question is about the Masjid Finder app, explain it clearly.
If it's about something else, give a correct and polite answer.
Always reply in the same language the user used (Arabic or English).`,
          },
          { role: 'user', content: question },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI Error:', error.response?.data || error.message);
    return '⚠️ Sorry, I could not answer that right now. Please try again.';
  }
}
