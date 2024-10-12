import path, { basename, extname, resolve } from "path";
import logger from "../logger";
import { fileContent, fileName, filePath } from "./types/renameFiles";
import { CLIArguments } from "./types";
import { handleError } from "./error/errorHandler";
import fs, { promises as fsPromises } from 'fs';
import { processMarkdownFile } from "./markdown";
import { processTextFile } from "./text";
import { processJavaScriptFile } from "./code/javaScript/processJavaScriptFile";
import { processYamlFile } from "./code/YAML/processYamlFile";

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

async function determineNewFileName(filePath: filePath, content: fileContent , args: CLIArguments): Promise<fileName | null> {
    const fileExtension = extname(filePath);
    if (fileExtension === '.txt') {
        return await processTextFile(filePath, content , args);
    } else if (fileExtension === '.md') {
        return await processMarkdownFile(filePath, content , args);
    }
    if (fileExtension === '.ts' || fileExtension === '.js' || fileExtension === '.jsx' || fileExtension === '.tsx') {
        return await processJavaScriptFile(filePath, content , args);
    } else if(fileExtension === '.yml' || fileExtension === '.yaml') {
        return await processYamlFile(filePath, content , args);
    }else {
        logger.info(`Skipping unsupported file type: ${basename(filePath)}`);
        return null;
    }
}

export const writeRenamedInfoToFile = async (renamedInfo: Record<string, { suggested_name: fileName }>, args: CLIArguments) => {
    const filePath = path.isAbsolute(args.output) ? args.output : path.join(process.cwd(), args.output);  
    try {
        await fsPromises.writeFile(filePath, JSON.stringify(renamedInfo, null, 2), 'utf-8');
        logger.info(`Renamed info successfully saved to ${filePath}`);
    } catch (error) {
        logger.error(`Failed to write renamed info to ${filePath}: ${error}`);
    }
}


async function renameFileIfNecessary(filePath: filePath, newFileName: fileName): Promise<{ status: 'renamed' | 'skipped', newFilePath: string | null }> {

    const fileExtension = extname(filePath);
    
    const directoryPath = resolve(filePath, '..');

    const newFileHasExtension = extname(newFileName) === fileExtension;

    const finalFileName = newFileHasExtension ? newFileName : `${newFileName}${fileExtension}`;
    
    const newFilePath = resolve(directoryPath, finalFileName);
    
    const resolvedFilePath = resolve(filePath);

    if (resolvedFilePath === newFilePath) {
        logger.info(`File ${basename(resolvedFilePath)} already has the correct name, skipping rename.`);
        return { status: 'skipped', newFilePath: newFilePath };
    }

    if (fs.existsSync(newFilePath)) {
        logger.error(`A file named ${newFileName}${fileExtension} already exists. Skipping rename for ${basename(resolvedFilePath)}.`);
        return { status: 'skipped', newFilePath: null };
    }

    await rename(resolvedFilePath, newFilePath);
    logger.info(`Renamed ${basename(resolvedFilePath)} to ${newFileName}`);
    return { status: 'renamed', newFilePath };;
}

export async function processFile(filePath: filePath, args: CLIArguments): Promise<{ status: 'renamed' | 'skipped' | 'error', newFilePath: string | null }> {
    try {
        
        if (!await checkFileExists(filePath)) return { status: 'skipped', newFilePath: null };

        
        const content : fileContent | null = await readFileContent(filePath);
        if (!content) return { status: 'skipped', newFilePath: null };

        
        const newFileName = await determineNewFileName(filePath, content , args);
        if (!newFileName) return { status: 'skipped', newFilePath: null };

        
        return await renameFileIfNecessary(filePath, newFileName);
        
    } catch (error) {
        logger.error(`Failed to rename file ${basename(filePath)}:`, handleError(error, args.debug));
        return { status: 'error', newFilePath: null };
    }
}

export const cleanFileNameExtension = (fileName: fileName): fileName => {
    const extensionRegex = /\.[a-zA-Z0-9]+$/;
    return fileName.replace(extensionRegex, '');
};