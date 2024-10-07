import { CLIArguments } from "../types";
import { fileName } from "../types/renameFiles";
import { cleanFileNameExtension, httpRequest } from "../utils";
import dotenv from 'dotenv';
dotenv.config();
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const generateFileName = async (content: string, baseFileName:fileName, args: CLIArguments): Promise<string> => {
  try {
    const maxFileNameLength = process.env.MAX_FILENAME_LENGTH ? parseInt(process.env.MAX_FILENAME_LENGTH , 10) : 10;
    const data = {
      model: 'gpt-4',
      messages: [
        {
            role: 'system',
            content: `You are an AI tasked with generating concise, descriptive file names based on the provided content. Use the "${args.namingConvention}" naming convention. If the current file name "${baseFileName}" is already appropriate, return it as it is without anything else . Otherwise, suggest a more suitable name that adheres to the convention.Ensure the suggested name is around ${maxFileNameLength} characters long`
        },
        {
            role: 'user',
            content: `The current file name is "${baseFileName}". Please evaluate the suitability of this name based on the content provided below. If it's already appropriate then please donot explicitly update that , if it is making sense according to the content provided then we should not suggest a new name and return the current file name only , we should only suggest a new name if the file name is irrelevant to the content present in it. Otherwise, suggest a more suitable name that adheres to the "${args.namingConvention}" convention and the new suggested file name should be around ${maxFileNameLength} characters long. Content: ${content}`,
        }
    ],    
      max_tokens: 50,
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
