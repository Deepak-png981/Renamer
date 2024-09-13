import { basename, extname, resolve } from "path";
import logger from "../logger";
import { fileName, filePath } from "./types/renameFiles";
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


export async function processFile(filePath: filePath, args: CLIArguments): Promise<'renamed' | 'skipped' | 'error'> {
    try {

        try {
            await access(filePath);
        } catch {
            logger.error(`File does not exist at path: ${filePath}`);
            return 'skipped';
        }

        const content = await readFile(filePath, 'utf-8');
        if (!content) {
            logger.warn(`File ${basename(filePath)} is empty, skipping rename.`);
            return 'skipped';
        }

        const fileExtension = extname(filePath);

        const newFileName = fileExtension === '.txt'
            ? await processTextFile(filePath, content)
            : fileExtension === '.md'
                ? await processMarkdownFile(filePath, content)
                : null;
        if (!newFileName) {
            logger.info(`Skipping unsupported or empty file type: ${basename(filePath)}`);
            return 'skipped';
        }

        const directoryPath = resolve(filePath, '..');
        const newFilePath = resolve(directoryPath, `${newFileName}${fileExtension}`);

        if (filePath === newFilePath) {
            logger.info(`File ${basename(filePath)} already has the correct name, skipping rename.`);
            return 'skipped';
        }

        if (fs.existsSync(newFilePath)) {
            logger.error(`A file named ${newFileName}${fileExtension} already exists. Skipping rename for ${basename(filePath)}.`);
            return 'skipped';
        }

        await rename(filePath, newFilePath);
        logger.info(`Renamed ${basename(filePath)} to ${newFileName}${fileExtension}`);
        return 'renamed';
    } catch (error) {
        logger.error(`Failed to rename file ${basename(filePath)}:`, handleError(error, args.debug));
        return 'error';
    }
}

export const cleanFileNameExtension = (fileName: fileName): fileName => {
    const extensionRegex = /\.[a-zA-Z0-9]+$/;
    return fileName.replace(extensionRegex, '');
};
