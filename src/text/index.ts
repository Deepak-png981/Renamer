import { basename } from "path";
import { generateFileName } from "../services/openAI.service";
import logger from "../../logger";
import { sanitizeFileName } from "../utils";
import { fileContent, filePath } from "../types/renameFiles";

export async function processTextFile(filePath: filePath, content: fileContent): Promise<string | null> {
    logger.debug(`Processing text file: ${filePath}`);
    const suggestedFileName = await generateFileName(content);
    if (!suggestedFileName) {
        logger.error(`Failed to generate a new file name for ${basename(filePath)}`);
        return null;
    }
    const newFileName = sanitizeFileName(suggestedFileName);
    return newFileName;
}