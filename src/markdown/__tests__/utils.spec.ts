import { extractMarkdownMetadata, extractMarkdownHeadings, extractKeywordsFromMarkdown, extractTopicsFromMarkdown, getPromptForMDContent } from '../utils.markdown';

describe('Markdown Utils', () => {
  const mockFilePath = 'test-file.md';
  const mockContent = `
---
title: Test Title
author: John Doe
---
# Heading 1
## Heading 2
This is a test content about Node.js and Markdown.
  `;

  describe('extractMarkdownMetadata', () => {
    it('should extract metadata from markdown content', () => {
      const metadata = extractMarkdownMetadata(mockContent.trim(), mockFilePath);
      expect(metadata).toEqual({"author": "John Doe", "title": "Test Title"});
    });

    it('should return null if no metadata is found', () => {
      const contentWithoutMetadata = '# Heading 1\nThis is some content.';
      const metadata = extractMarkdownMetadata(contentWithoutMetadata, mockFilePath);
      expect(metadata).toBeNull();
    });
  });

  describe('extractMarkdownHeadings', () => {
    it('should extract headings from markdown content', () => {
      const headings = extractMarkdownHeadings(mockContent);
      expect(headings).toEqual(["Heading 1", "Heading 2"]);
    });

    it('should return an empty array if no headings are found', () => {
      const noHeadingsContent = 'This is just some content without headings.';
      const headings = extractMarkdownHeadings(noHeadingsContent);
      expect(headings).toEqual([]);
    });
  });

  describe('extractKeywordsFromMarkdown', () => {
    it('should extract keywords from markdown content', () => {
      const keywords = extractKeywordsFromMarkdown(mockContent);
      expect(keywords.toString()).toContain(["Heading", "title", "Test", "Title", "author", "John", "Doe", "test", "content", "Node" , "js" , "Markdown"].toString());
    });
  });

  describe('extractTopicsFromMarkdown', () => {
    it('should extract topics from markdown content', () => {
      const topics = extractTopicsFromMarkdown(mockContent, 2);
      expect(topics).toHaveLength(2); 
    });
  });

  describe('getPromptForMDContent', () => {
    it('should generate a prompt for markdown content', () => {
      const metadata = { title: 'Test Title', author: 'John Doe' };
      const headings = ['Heading 1', 'Heading 2'];
      const keywords = ['test', 'content', 'Node.js'];
      const topics = ['Node.js', 'Markdown'];

      const prompt = getPromptForMDContent(metadata, headings, keywords, topics);
      expect(prompt).toContain('Test Title');
      expect(prompt).toContain('Heading 1, Heading 2');
      expect(prompt).toContain('test, content, Node.js');
      expect(prompt).toContain('Node.js, Markdown');
    });
  });
});
