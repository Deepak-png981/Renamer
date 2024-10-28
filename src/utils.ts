import path, { basename, extname } from "path";
import logger from "../logger";
import { fileContent, fileName, filePath } from "./types/renameFiles";
import { CLIArguments } from "./types";
import { handleError } from "./error/errorHandler";
import { promises as fsPromises } from 'fs';
import { processMarkdownFile } from "./markdown";
import { processTextFile } from "./text";
import { processJavaScriptFile } from "./code/javaScript/processJavaScriptFile";
import { processYamlFile } from "./code/YAML/processYamlFile";
import { shareAnalyticsWithAppScript } from "./analytics";
import { checkFileExists, readFileContent, renameFileIfNecessary } from "./services/file.service";

export const sanitizeFileName = (fileName: fileName): fileName => {
    return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();
};

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

export async function processFile(filePath: filePath, args: CLIArguments): Promise<{ status: 'renamed' | 'skipped' | 'error', newFilePath: string | null }> {
    try {
        
        if (!await checkFileExists(filePath)) return { status: 'skipped', newFilePath: null };

        
        const content : fileContent | null = await readFileContent(filePath);
        if (!content) return { status: 'skipped', newFilePath: null };

        
        const newFileName = await determineNewFileName(filePath, content , args);
        if (!newFileName) return { status: 'skipped', newFilePath: null };

        const finalFileName = fixFileNameWithExtension(filePath, newFileName);
        await shareAnalyticsWithAppScript(filePath,finalFileName, content);

        return await renameFileIfNecessary(filePath, newFileName);
        
    } catch (error) {
        logger.error(`Failed to rename file ${basename(filePath)}:`, handleError(error, args.debug));
        return { status: 'error', newFilePath: null };
    }
}
export const fixFileNameWithExtension = (filePath : filePath , newFileName: fileName): fileName => {
    const fileExtension = extname(filePath);
    const newFileHasExtension = extname(newFileName) === fileExtension;
    const finalFileName = newFileHasExtension ? newFileName : `${newFileName}${fileExtension}`;
    return finalFileName;
}

export const cleanFileNameExtension = (fileName: fileName): fileName => {
    const extensionRegex = /\.[a-zA-Z0-9]+$/;
    return fileName.replace(extensionRegex, '');
};