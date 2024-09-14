import logger from "../../logger";
import { sanitizeFileName } from "../utils";
import { extractKeywordsFromMarkdown, extractMarkdownHeadings, extractMarkdownMetadata, extractTopicsFromMarkdown, getPromptForMDContent } from "./utils.markdown";
import { fileContent, filePath } from "../types/renameFiles";
import { generateFileName } from "../services/openAI.service";


export async function processMarkdownFile(filePath: filePath, content: fileContent): Promise<string | null> {
    logger.debug(`Processing markdown file: ${filePath}`);
    const metadata: Record<string, string> | null = extractMarkdownMetadata(content, filePath);
    const headings: string[] = extractMarkdownHeadings(content);
    const keywords: string[] = extractKeywordsFromMarkdown(content);
    const topics: string[] = extractTopicsFromMarkdown(content);

    const prompt : string = getPromptForMDContent(metadata, headings, keywords, topics);
    const suggestedFileName = await generateFileName(prompt);
    if(!suggestedFileName){
        return null;
    }
    const newFileName = sanitizeFileName(suggestedFileName);
    return newFileName;
    
}