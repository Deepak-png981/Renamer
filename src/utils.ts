import { basename, extname, resolve } from "path";
import logger from "../logger";
import { fileContent, fileName, filePath } from "./types/renameFiles";
import { CLIArguments } from "./types";
import { handleError } from "./error/errorHandler";
import fs, { promises as fsPromises } from 'fs';
import { processMarkdownFile } from "./markdown";
import { processTextFile } from "./text";

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

async function checkFileExists(filePath: filePath): Promise<boolean> {
    try {
        await access(filePath);
        return true;
    } catch {
        logger.error(`File does not exist at path: ${filePath}`);
        return false;
    }
}

async function readFileContent(filePath: filePath): Promise<fileContent | null> {
    try {
        const content = await readFile(filePath, 'utf-8');
        if (!content) {
            logger.warn(`File ${basename(filePath)} is empty, skipping rename.`); logger
            return null;
        }
        return content;
    } catch (error) {
        logger.error(`Failed to read file ${basename(filePath)}: ${error}`);
        return null;
    }
}

async function determineNewFileName(filePath: filePath, content: fileContent): Promise<fileName | null> {
    const fileExtension = extname(filePath);

    if (fileExtension === '.txt') {
        return await processTextFile(filePath, content);
    } else if (fileExtension === '.md') {
        return await processMarkdownFile(filePath, content);
    } else {
        logger.info(`Skipping unsupported file type: ${basename(filePath)}`);
        return null;
    }
}

async function renameFileIfNecessary(filePath: filePath, newFileName: fileName): Promise<'renamed' | 'skipped'> {

    const fileExtension = extname(filePath);
    
    const directoryPath = resolve(filePath, '..');
    
    const newFilePath = resolve(directoryPath, `${newFileName}${fileExtension}`);
    
    const resolvedFilePath = resolve(filePath);

    if (resolvedFilePath === newFilePath) {
        logger.info(`File ${basename(resolvedFilePath)} already has the correct name, skipping rename.`);
        return 'skipped';
    }

    if (fs.existsSync(newFilePath)) {
        logger.error(`A file named ${newFileName}${fileExtension} already exists. Skipping rename for ${basename(resolvedFilePath)}.`);
        return 'skipped';
    }

    await rename(resolvedFilePath, newFilePath);
    logger.info(`Renamed ${basename(resolvedFilePath)} to ${newFileName}${fileExtension}`);
    return 'renamed';
}

export async function processFile(filePath: filePath, args: CLIArguments): Promise<'renamed' | 'skipped' | 'error'> {
    try {
        
        if (!await checkFileExists(filePath)) return 'skipped';

        
        const content : fileContent | null = await readFileContent(filePath);
        if (!content) return 'skipped';

        
        const newFileName = await determineNewFileName(filePath, content);
        if (!newFileName) return 'skipped';

        
        return await renameFileIfNecessary(filePath, newFileName);
        
    } catch (error) {
        logger.error(`Failed to rename file ${basename(filePath)}:`, handleError(error, args.debug));
        return 'error';
    }
}

export const cleanFileNameExtension = (fileName: fileName): fileName => {
    const extensionRegex = /\.[a-zA-Z0-9]+$/;
    return fileName.replace(extensionRegex, '');
};