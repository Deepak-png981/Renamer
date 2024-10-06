import logger from "../../logger";
import { sanitizeFileName } from "../utils";
import { extractKeywordsFromMarkdown, extractMarkdownHeadings, extractMarkdownMetadata, extractTopicsFromMarkdown, getPromptForMDContent } from "./utils.markdown";
import { fileContent, filePath } from "../types/renameFiles";
import { generateFileName } from "../services/openAI.service";
import { CLIArguments } from "../types";
import { basename } from "path";


export async function processMarkdownFile(filePath: filePath, content: fileContent , args: CLIArguments): Promise<string | null> {
    logger.debug(`Processing markdown file: ${filePath}`);
    const metadata: Record<string, string> | null = extractMarkdownMetadata(content, filePath);
    const headings: string[] = extractMarkdownHeadings(content);
    const keywords: string[] = extractKeywordsFromMarkdown(content);
    const topics: string[] = extractTopicsFromMarkdown(content);

    const prompt : string = getPromptForMDContent(metadata, headings, keywords, topics);
    const baseFileName = basename(filePath)
    const suggestedFileName = await generateFileName(prompt, baseFileName , args );
    if(!suggestedFileName){
        return null;
    }
    const newFileName = sanitizeFileName(suggestedFileName);
    return newFileName;
    
}