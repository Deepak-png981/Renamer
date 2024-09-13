import { promises as fsPromises } from 'fs';
import { resolve, basename } from 'path';
import logger from '../logger';
import { directoryPath, filePath } from './types/renameFiles';
import { processFile } from './utils';
import { handleError } from './error/errorHandler';
import { CLIArguments } from './types';
const { readdir } = fsPromises;


export const renameSingleFile = async (filePath: filePath, args: CLIArguments) => {
    const result = await processFile(filePath, args);
    if (result === 'error') {
        logger.error(`Failed to rename file ${basename(filePath)}`);
    }
};

export const renameFilesInDirectory = async (directoryPath: directoryPath, args: CLIArguments): Promise<void> => {
    try {
        const files = await readdir(directoryPath);
        if (files.length === 0) {
            logger.info(`No files found in the directory: ${directoryPath}`);
            return;
        }

        const processResults = await Promise.all(
            files.map(async (file) => {
                const filePath = resolve(directoryPath, file);
                return await processFile(filePath, args);
            })
        );

        const renamedCount = processResults.filter((result) => result === 'renamed').length;
        const skippedCount = processResults.filter((result) => result !== 'renamed').length;

        logger.info(`Rename operation complete. ${renamedCount} files renamed, ${skippedCount} files skipped.`);
    } catch (error) {
        logger.error(`Error accessing directory: ${directoryPath}`, handleError(error, args.debug));
    }
};
