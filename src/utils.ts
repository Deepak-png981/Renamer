import { basename, extname, resolve } from "path";
import logger from "../logger";
import { fileName } from "./types/renameFiles";
import { generateFileNameFromContent } from "./services/openAI.service";
import { CLIArguments } from "./types";
import { handleError } from "./error/errorHandler";
import fs ,{ promises as fsPromises } from 'fs';

const { access, readFile, rename } = fsPromises;


export const httpRequest = async (
    url: string,
    method: string,
    body: any = null,
    headers: Record<string, string> = {}
): Promise<any> => {
    try {
        logger.debug(`HTTP Request: ${method} ${url}`);
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        logger.error(`HTTP Request failed: ${error}`);
        throw error;
    }
};

export const sanitizeFileName = (fileName: fileName): fileName => {
    return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();    
};


export async function processFile(filePath: string, args: CLIArguments): Promise<'renamed' | 'skipped' | 'error'> {
    try {
        
        try {
            await access(filePath);
        } catch {
            logger.error(`File does not exist at path: ${filePath}`);
            return 'skipped';
        }

        if (extname(filePath) !== '.txt') {
            logger.info(`Skipping unsupported file type: ${basename(filePath)}`);
            return 'skipped';
        }

        const content = await readFile(filePath, 'utf-8');
        if (!content) {
            logger.warn(`File ${basename(filePath)} is empty, skipping rename.`);
            return 'skipped';
        }

        const suggestedFileName = await generateFileNameFromContent(content);
        if (!suggestedFileName) {
            logger.error(`Failed to generate a new file name for ${basename(filePath)}`);
            return 'skipped';
        }

        const newFileName = sanitizeFileName(suggestedFileName);
        if (!newFileName) {
            logger.error(`Sanitized file name is invalid for ${basename(filePath)}`);
            return 'skipped';
        }

        const directoryPath = resolve(filePath, '..');
        const newFilePath = resolve(directoryPath, `${newFileName}.txt`);

        if (filePath === newFilePath) {
            logger.info(`File ${basename(filePath)} already has the correct name, skipping rename.`);
            return 'skipped';
        }

        if(fs.existsSync(newFilePath)) {
            logger.error(`A file named ${newFileName}.txt already exists. Skipping rename for ${basename(filePath)}.`);
            return 'skipped';
        }
        

        await rename(filePath, newFilePath);
        logger.info(`Renamed ${basename(filePath)} to ${newFileName}.txt`);
        return 'renamed';
    } catch (error) {
        logger.error(`Failed to rename file ${basename(filePath)}:`, handleError(error, args.debug));
        return 'error';
    }
}