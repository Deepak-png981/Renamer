import { readdirSync, readFileSync, renameSync } from 'fs';
import { resolve, extname, basename } from 'path';
import { generateFileNameFromContent } from './services/openAI.service';

export const renameFilesInDirectory = (directoryPath: string) => {
  const files = readdirSync(directoryPath);
  
  files.forEach(async (file) => {
    if (extname(file) === '.txt') {
      const filePath = resolve(directoryPath, file);
      const content = readFileSync(filePath, 'utf-8');
      const newFileName = await generateFileNameFromContent(content);
      
      const newPath = resolve(directoryPath, `${newFileName}.txt`);
      renameSync(filePath, newPath);
      console.log(`Renamed ${file} to ${newFileName}.txt`);
    }
  });
};

export const renameSingleFile = async (filePath: string) => {
  if (extname(filePath) !== '.txt') {
    console.log('This tool currently only supports .txt files.');
    return;
  }

  const content = readFileSync(filePath, 'utf-8');
  const newFileName = await generateFileNameFromContent(content);
  
  const directoryPath = resolve(filePath, '..');
  const newPath = resolve(directoryPath, `${newFileName}.txt`);
  renameSync(filePath, newPath);
  console.log(`Renamed ${basename(filePath)} to ${newFileName}.txt`);
};
