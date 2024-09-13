import { httpRequest, sanitizeFileName } from '../../utils';  
import logger from '../../../logger';
import { processFile } from '../../utils';
import fs from 'fs';
global.fetch = jest.fn();

jest.mock('../../../logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));
jest.mock('../../services/openAI.service', () => ({
  generateFileNameFromContent: jest.fn(),
}));
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
    readFile: jest.fn(),
    rename: jest.fn(),
  },
  existsSync: jest.fn(),
}));

describe('processFile', () => {
  const mockArgs = { path: '/path/to/file.txt', debug: false }; 
  const mockFilePath = '/path/to/file.txt';
  it('should skip if file does not exist', async () => {
    (fs.promises.access as jest.Mock).mockRejectedValue(new Error('File not found'));

    const result = await processFile(mockFilePath, mockArgs);

    expect(fs.promises.access).toHaveBeenCalledWith(mockFilePath);
    expect(logger.error).toHaveBeenCalledWith(`File does not exist at path: ${mockFilePath}`);
    expect(result).toBe('skipped');
  });
});



describe('Utility Functions', () => {
  describe('httpRequest', () => {
    const mockUrl = 'https://example.com/api';
    const mockMethod = 'POST';
    const mockBody = { data: 'test' };
    const mockHeaders = { Authorization: 'Bearer token' };

    beforeEach(() => {
      jest.clearAllMocks(); 
    });

    it('should make a successful HTTP request and return JSON response', async () => {
      const mockResponse = { success: true };
      
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await httpRequest(mockUrl, mockMethod, mockBody, mockHeaders);

      expect(fetch).toHaveBeenCalledWith(mockUrl, {
        method: mockMethod,
        headers: {
          'Content-Type': 'application/json',
          ...mockHeaders,
        },
        body: JSON.stringify(mockBody),
      });

      expect(result).toEqual(mockResponse);

      expect(logger.debug).toHaveBeenCalledWith(`HTTP Request: ${mockMethod} ${mockUrl}`);
    });

    it('should throw an error if the response is not OK', async () => {
      const mockErrorResponse = { message: 'Something went wrong' };

      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
        json: jest.fn().mockResolvedValue(mockErrorResponse),
      });

      await expect(httpRequest(mockUrl, mockMethod, mockBody, mockHeaders)).rejects.toThrow(
        `HTTP error! Status: 400, Error: ${JSON.stringify(mockErrorResponse)}`
      );

      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle network errors and rethrow them', async () => {
      const mockNetworkError = new Error('Network error');

      (fetch as jest.Mock).mockRejectedValue(mockNetworkError);

      await expect(httpRequest(mockUrl, mockMethod, mockBody, mockHeaders)).rejects.toThrow(
        'Network error'
      );

      expect(logger.error).toHaveBeenCalledWith(`HTTP Request failed: ${mockNetworkError}`);
    });
  });

  describe('sanitizeFileName', () => {
    it('should remove invalid characters from file name', () => {
      const unsafeFileName = 'invalid<>:"/\\|?*name.txt';
      const expectedFileName = 'invalidname.txt';

      const result = sanitizeFileName(unsafeFileName);

      expect(result).toBe(expectedFileName);
    });

    it('should trim whitespace from file name', () => {
      const fileNameWithWhitespace = '   validName.txt   ';
      const expectedFileName = 'validName.txt';

      const result = sanitizeFileName(fileNameWithWhitespace);

      expect(result).toBe(expectedFileName);
    });

    it('should return an empty string if the file name consists only of invalid characters', () => {
      const invalidFileName = '<>:*|?';
      const result = sanitizeFileName(invalidFileName);
      expect(result).toBe('');
    });
  });
});
