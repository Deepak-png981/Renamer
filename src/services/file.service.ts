import { promises as fsPromises } from 'fs';
import { basename, extname, resolve } from 'path';
import logger from "../../logger";
import { fileContent, filePath, fileName } from "../types/renameFiles";
import fs from 'fs';
const { access, readFile, rename } = fsPromises;

export const checkFileExists = async (filePath: filePath): Promise<boolean> => {
    try {
        await access(filePath);
        return true;
    } catch {
        logger.error(`File does not exist at path: ${filePath}`);
        return false;
    }
};

export const readFileContent = async (filePath: filePath): Promise<fileContent | null> => {
    try {
        const content = await readFile(filePath, 'utf-8');
        if (!content) {
            logger.warn(`File ${basename(filePath)} is empty, skipping rename.`);
            return null;
        }
        return content;
    } catch (error) {
        logger.error(`Failed to read file ${basename(filePath)}: ${error}`);
        return null;
    }
};

export const renameFileIfNecessary = async (filePath: filePath, newFileName: fileName): Promise<{ status: 'renamed' | 'skipped', newFilePath: string | null }> => {
    const fileExtension = extname(filePath);
    const directoryPath = resolve(filePath, '..');
    const finalFileName = fixFileNameWithExtension(filePath, newFileName);
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
    logger.info(`Renamed ${basename(resolvedFilePath)} to ${finalFileName}`);
    return { status: 'renamed', newFilePath };
};

export const fixFileNameWithExtension = (filePath: filePath, newFileName: fileName): fileName => {
    const fileExtension = extname(filePath);
    const newFileHasExtension = extname(newFileName) === fileExtension;
    return newFileHasExtension ? newFileName : `${newFileName}${fileExtension}`;
};
