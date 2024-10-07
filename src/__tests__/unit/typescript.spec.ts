import { processTypeScriptFile } from '../../code/typeScript/processTypeScriptFile';
import { generateFileName } from '../../services/openAI.service';
import { CLIArguments } from '../../types';
import { sanitizeFileName } from '../../utils';
import * as path from 'path';

jest.mock('../../services/openAI.service');
jest.mock('../../utils', () => ({
    sanitizeFileName: jest.fn(),
}));
jest.mock('../../../logger', () => ({
    debug: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
}));

jest.mock('path', () => ({
  ...jest.requireActual('path'),  
  basename: jest.fn().mockReturnValue('test.ts'), 
}));

describe('processTypeScriptFile', () => {
    const mockArgs: CLIArguments = {
        path: './testData/test.ts',
        debug: false,
        output: 'renamed.json',
        namingConvention: 'camelCase',
    };

    const mockFilePath = './testData/test.ts';

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'warn').mockImplementation(() => {});  
        jest.spyOn(console, 'error').mockImplementation(() => {}); 
    });

    it('should return null for empty file content', async () => {
        const result = await processTypeScriptFile(mockFilePath, '', mockArgs);

        expect(result).toBeNull();
        expect(console.warn).toHaveBeenCalledWith(`File ${mockFilePath} is empty, skipping renaming.`);
    });

    it('should process TypeScript file and generate a new file name', async () => {
        const mockContent = `
          export const sum = (a: number, b: number): number => {
            return a + b;
          };
        `;

        const mockSuggestedFileName = 'sumFunction.ts';

        (generateFileName as jest.Mock).mockResolvedValue(mockSuggestedFileName);
        (sanitizeFileName as jest.Mock).mockReturnValue(mockSuggestedFileName);

        const result = await processTypeScriptFile(mockFilePath, mockContent, mockArgs);

        expect(path.basename).toHaveBeenCalledWith(mockFilePath);
        expect(generateFileName).toHaveBeenCalledWith(expect.any(String), 'test.ts', mockArgs);
        expect(sanitizeFileName).toHaveBeenCalledWith(mockSuggestedFileName);
        expect(result).toEqual(mockSuggestedFileName);
    });

    it('should handle errors during processing and return null', async () => {
        const mockError = new Error('Parsing error');
        (generateFileName as jest.Mock).mockRejectedValue(mockError);

        const result = await processTypeScriptFile(mockFilePath, 'some invalid content', mockArgs);

        expect(console.error).toHaveBeenCalledWith(expect.stringContaining('Error processing TypeScript file:'));
        expect(result).toBeNull();
    });
});
