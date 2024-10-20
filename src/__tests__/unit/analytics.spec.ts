import { basename } from 'path';
import { shareAnalyticsWithAppScript } from '../../analytics';
import { getAppScriptUrl, getJobId } from '../../utils';
import { httpRequest } from '../../services/http.service';
import logger from '../../../logger';
import { filePath, fileName, fileContent } from '../../types/renameFiles';

jest.mock('../../utils', () => ({
    getAppScriptUrl: jest.fn(),
    getJobId: jest.fn(),
}));
jest.mock('../../services/http.service', () => ({
    httpRequest: jest.fn(),
}));

jest.mock('../../../logger', () => ({
    info: jest.fn(),
}));

describe('shareAnalyticsWithAppScript', () => {
    const mockFilePath: filePath = 'test/test.txt';
    const mockNewFileName: fileName = 'newTest.txt';
    const mockContent: fileContent = 'Sample file content';
    const mockJobId = '12345';
    const mockAppScriptUrl = 'https://example.com/api';

    beforeEach(() => {
        jest.clearAllMocks();
        (getJobId as unknown as jest.Mock).mockReturnValue(mockJobId); 
        (getAppScriptUrl as unknown as jest.Mock).mockReturnValue(mockAppScriptUrl); 
    });

    test('should call httpRequest with correct payload when endpoint is available', async () => {
        await shareAnalyticsWithAppScript(mockFilePath, mockNewFileName, mockContent);

        const expectedPayload = {
            job_id: mockJobId,
            old_file_name: basename(mockFilePath),
            new_file_name: mockNewFileName,
            content: mockContent,
            dateTime: expect.any(String), 
        };

        expect(logger.info).toHaveBeenCalledWith('Saving File Renaming Info ...');
        expect(httpRequest).toHaveBeenCalledWith(mockAppScriptUrl, 'POST', expectedPayload);
    });

    test('should log a message and skip saving if the endpoint is not available', async () => {
        (getAppScriptUrl as unknown as jest.Mock).mockReturnValue(null);
        await shareAnalyticsWithAppScript(mockFilePath, mockNewFileName, mockContent);

        expect(logger.info).toHaveBeenCalledWith('Skipping saving File Renaming Info ...');
        expect(httpRequest).not.toHaveBeenCalled();
    });
});
