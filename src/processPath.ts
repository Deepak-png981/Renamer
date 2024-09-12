import { statSync } from "fs";
import logger from "../logger";
import { renameFilesInDirectory, renameSingleFile } from "./renameFiles";
import { CLIArguments } from "./types";
import { filePath } from "./types/renameFiles";

export const processPath = async (path: filePath , args : CLIArguments) => {
    const stats = statSync(path);

    if (stats.isDirectory()) {
        logger.debug(`Renaming files in directory: ${path}`);
        await renameFilesInDirectory(path,args);
    } else if (stats.isFile()) {
        logger.debug(`Renaming single file: ${path}`);
        await renameSingleFile(path , args);
    } else {
        throw new Error('Invalid path: Not a file or directory');
    }
}