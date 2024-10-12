import { promises as fsPromises } from 'fs';
import { resolve, basename } from 'path';
import logger from '../logger';
import { directoryPath, filePath } from './types/renameFiles';
import { processFile, writeRenamedInfoToFile } from './utils';
import { handleError } from './error/errorHandler';
import { CLIArguments } from './types';
import { renamedInfo } from './constant';
const { readdir } = fsPromises;

export const renameSingleFile = async (filePath: filePath, args: CLIArguments) => {
    const result = await processFile(filePath, args);
    if (result.status === 'error') {
        logger.error(`Failed to rename file ${basename(filePath)}`);
    }
    if (result.newFilePath) {
        renamedInfo[basename(filePath)] = { suggested_name: basename(result.newFilePath) };
    }
    if (Object.keys(renamedInfo).length > 0) {
        await writeRenamedInfoToFile(renamedInfo, args);
    }

};

export const renameFilesInDirectory = async (directoryPath: directoryPath, args: CLIArguments): Promise<void> => {
    try {
        const files = await readdir(directoryPath);
        if (files.length === 0) {
            logger.info(`No files found in the directory: ${directoryPath}`);
            return;
        }

        const processResults = await Promise.allSettled(
            files.map(async (file) => {
                const filePath = resolve(directoryPath, file);
                const result = await processFile(filePath, args);
                if (result.status === 'renamed' && result.newFilePath) {
                    renamedInfo[basename(filePath)] = { suggested_name: basename(result.newFilePath) };
                }
                return result;
            })
        );

        const renamedCount = processResults.filter((result) => result.status === 'fulfilled' && result.value.status === 'renamed').length;

        const skippedCount = processResults.filter((result) => result.status === 'fulfilled' && result.value.status === 'skipped').length;
        if (renamedCount > 0) {
            await writeRenamedInfoToFile(renamedInfo, args);
        }
        logger.info(`Rename operation complete. ${renamedCount} files renamed with the naming convention: "${args.namingConvention}", ${skippedCount} files skipped.`);
    } catch (error) {
        logger.error(`Error accessing directory: ${directoryPath}`, handleError(error, args.debug));
    }
};
