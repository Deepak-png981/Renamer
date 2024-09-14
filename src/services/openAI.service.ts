import { cleanFileNameExtension, httpRequest } from "../utils";
import dotenv from 'dotenv';
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


export const generateFileName = async (content: string): Promise<string> => {
  try {
    const data = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an AI that generates concise and descriptive file names based on content.'
        },
        {
          role: 'user',
          content: `Hi I need a file name for the following content , please provide a concise and descriptive file name that will help me recongnize the content inside the file quickly and easily , it should be short and easy to remember. Content: ${content}`,
        }
      ],
      max_tokens: 10,
    };

    const response = await httpRequest(
      'https://api.openai.com/v1/chat/completions',
      'POST',
      data,
      {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      }
    );
    const fileName = response.choices[0]?.message?.content?.trim();
    return cleanFileNameExtension(fileName);
  } catch (error) {
    console.error('Error generating filename from content:', error);
    throw error;
  }
};
