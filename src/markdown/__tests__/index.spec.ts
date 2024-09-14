import { processMarkdownFile } from '../index';
import * as markdownUtils from '../utils.markdown';
import * as openAIService from '../../services/openAI.service';
import { sanitizeFileName } from '../../utils';

jest.mock('../utils.markdown');
jest.mock('../../services/openAI.service');
jest.mock('../../utils');

describe('processMarkdownFile', () => {
    const mockFilePath = 'test-file.md';
    const mockContent = '---\ntitle: Test Title\n---\n# Heading 1\nThis is a test content.';

    it('should generate a new file name based on markdown content', async () => {
        
        (markdownUtils.extractMarkdownMetadata as jest.Mock).mockReturnValue({ title: 'Test Title' });
        (markdownUtils.extractMarkdownHeadings as jest.Mock).mockReturnValue(['Heading 1']);
        (markdownUtils.extractKeywordsFromMarkdown as jest.Mock).mockReturnValue(['test', 'content']);
        (markdownUtils.extractTopicsFromMarkdown as jest.Mock).mockReturnValue(['test', 'heading']);

        (openAIService.generateFileName as jest.Mock).mockResolvedValue('Generated File Name');

        (sanitizeFileName as jest.Mock).mockReturnValue('generated-file-name');

        const newFileName = await processMarkdownFile(mockFilePath, mockContent);

        expect(markdownUtils.extractMarkdownMetadata).toHaveBeenCalledWith(mockContent, mockFilePath);
        expect(markdownUtils.extractMarkdownHeadings).toHaveBeenCalledWith(mockContent);
        expect(markdownUtils.extractKeywordsFromMarkdown).toHaveBeenCalledWith(mockContent);
        expect(markdownUtils.extractTopicsFromMarkdown).toHaveBeenCalledWith(mockContent);
        expect(openAIService.generateFileName).toHaveBeenCalled();
        expect(sanitizeFileName).toHaveBeenCalledWith('Generated File Name');
        expect(newFileName).toBe('generated-file-name');
    });

    it('should return null if file name generation fails', async () => {
        (openAIService.generateFileName as jest.Mock).mockResolvedValue(null);
        const newFileName = await processMarkdownFile(mockFilePath, mockContent);

        expect(newFileName).toBeNull();
    });
});