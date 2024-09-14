import yaml from 'js-yaml';
import logger from '../../logger';
import { fileContent, filePath } from '../types/renameFiles';
import natural from 'natural';

export const extractMarkdownMetadata = (content: fileContent , filePath: filePath): Record<string, string> | null => {
    const metadataRegex = /^---\n([\s\S]+?)\n---/; 
    const match = content.match(metadataRegex);
    if (!match) return null;

    try {
        return yaml.load(match[1]) as Record<string, string>;
    } catch (e) {
        logger.error(`Failed to parse YAML metadata for file ${filePath}.`);
        return null;
    }
};

export const extractMarkdownHeadings = (content: fileContent): string[] => {
    const headingRegex = /^(#{1,6})\s(.+)/gm;
    const headings: string[] = [];

    for (const match of content.matchAll(headingRegex)) {
        headings.push(match[2]); 
    }

    return headings;
};

export const extractKeywordsFromMarkdown = (content: fileContent): string[] => {
    const stopWords = natural.stopwords;
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(content);

    const filteredTokens = tokens.filter(token => {
        return !stopWords.includes(token.toLowerCase()) && isNaN(Number(token)) && token.length > 1;
    });

    const TfIdf = natural.TfIdf;
    const tfidf = new TfIdf();

    tfidf.addDocument(filteredTokens);

    const keywords: string[] = [];
    tfidf.listTerms(0).forEach(item => {
        if (item.tfidf > 0.1) { 
            keywords.push(item.term);
        }
    });

    return keywords;
};


export const extractTopicsFromMarkdown = (content: fileContent, topN: number = 10): string[] => {
    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(content);
    
    const tfidf = new natural.TfIdf();
    tfidf.addDocument(tokens);

    const topics: string[] = [];

    tfidf.listTerms(0).slice(0, topN).forEach((item) => {
        topics.push(item.term);
    });

    return topics;
};

export function getPromptForMDContent(
    metadata: Record<string, string> | null,
    headings: string[],
    keywords: string[],
    topics: string[]
): string {
    return `
    You are tasked with creating a concise and descriptive file name for a markdown document.
    The file has the following details:

    1. **Metadata:**
    ${metadata ? Object.entries(metadata).map(([key, value]) => `${key}: ${value}`).join('\n') : 'No metadata available'}

    2. **Headings:**
    ${headings.length > 0 ? headings.join(', ') : 'No headings available'}

    3. **Keywords:**
    ${keywords.length > 0 ? keywords.join(', ') : 'No keywords available'}

    4. **Topics/Entities:**
    ${topics.length > 0 ? topics.join(', ') : 'No topics available'}

    Based on this information, suggest a short and descriptive file name that captures the essence of the document's content.
    Please ensure that the file name is informative and concise. Try to keep the file name under 20 or max 25 characters.
    `;
}
