import { existsSync, readdirSync, readFileSync, renameSync } from 'fs';
import { resolve, extname, basename } from 'path';
import { generateFileNameFromContent } from './services/openAI.service';
import logger from '../logger';
import { directoryPath, filePath } from './types/renameFiles';
import { sanitizeFileName } from './utils';
import { handleError } from './error/errorHandler';
import { CLIArguments } from './types';

export const renameFilesInDirectory = async (directoryPath: directoryPath, args: CLIArguments): Promise<void> => {
    try {

        const files = readdirSync(directoryPath);

        if (files.length === 0) {
            logger.info(`No files found in the directory: ${directoryPath}`);
            return;
        }
        const { renamedCount, skippedCount } = await files.reduce(async (accPromise, file) => {

            const acc = await accPromise;

            if (extname(file) !== '.txt') {
                logger.info(`Skipping unsupported file type: ${file}`);
                return { ...acc, skippedCount: acc.skippedCount + 1 };
            }

            const filePath = resolve(directoryPath, file);

            try {
                const content = readFileSync(filePath, 'utf-8');
                if (!content) {
                    logger.warn(`Skipping empty file: ${file}`);
                    return { ...acc, skippedCount: acc.skippedCount + 1 };
                }

                const suggestedFileName = await generateFileNameFromContent(content);
                const newFileName = sanitizeFileName(suggestedFileName);

                const newFilePath = resolve(directoryPath, `${newFileName}.txt`);

                if (filePath === newFilePath) {
                    logger.info(`File ${file} already has the correct name, skipping rename.`);
                    return { ...acc, skippedCount: acc.skippedCount + 1 };
                }

                if (readdirSync(directoryPath).includes(`${newFileName}.txt`)) {
                    logger.error(`A file named ${newFileName}.txt already exists. Skipping rename for ${file}.`);
                    return { ...acc, skippedCount: acc.skippedCount + 1 };
                }

                renameSync(filePath, newFilePath);
                logger.info(`Renamed ${file} to ${newFileName}.txt`);

                return { ...acc, renamedCount: acc.renamedCount + 1 };
            } catch (fileError) {
                logger.error(`Failed to rename file ${file}:`, fileError);
                return { ...acc, skippedCount: acc.skippedCount + 1 };
            }
        }, Promise.resolve({ renamedCount: 0, skippedCount: 0 }));

        logger.info(`Rename operation complete. ${renamedCount} files renamed, ${skippedCount} files skipped.`);

    } catch (error) {
        logger.error(`Error accessing directory: ${directoryPath}`, handleError(error, args.debug));
    }
};

export const renameSingleFile = async (filePath: filePath, args: CLIArguments) => {

    try {
        if (!existsSync(filePath)) {
            logger.error(`File does not exist at path: ${filePath}`);
            return;
        }

        if (extname(filePath) !== '.txt') {
            logger.error(`Renamer doesnot support ${extname(filePath)} files`);
            return;
        }

        const content = readFileSync(filePath, 'utf-8');
        if (!content) {
            logger.warn(`File ${basename(filePath)} is empty, skipping rename.`);
            return;
        }
        const suggestedFileName = await generateFileNameFromContent(content);
        const newFileName = sanitizeFileName(suggestedFileName);
        const directoryPath = resolve(filePath, '..');
        const newFilePath = resolve(directoryPath, `${newFileName}.txt`);
        if (filePath === newFilePath) {
            logger.info(`File ${basename(filePath)} already has the correct name, no rename needed.`);
            return;
        }
        if (existsSync(newFilePath)) {
            logger.error(`A file with the suggested name ${newFileName} already exists in the directory.`);
            return;
        }
        renameSync(filePath, newFilePath);
        logger.info(`Successfully renamed ${basename(filePath)} to ${newFileName}.txt`);

    } catch (error) {
        logger.error(`Failed to rename file ${basename(filePath)}`, handleError(error, args.debug));
    }
};
