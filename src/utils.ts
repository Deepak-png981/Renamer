import { fileName } from "./types/renameFiles";

export const httpRequest = async (
    url: string,
    method: string,
    body: any = null,
    headers: Record<string, string> = {}
): Promise<any> => {
    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP error! Status: ${response.status}, Error: ${JSON.stringify(errorData)}`);
        }

        return await response.json();
    } catch (error) {
        console.error('HTTP Request failed:', error);
        throw error;
    }
};

export const sanitizeFileName = (fileName: fileName): fileName => {
    return fileName.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').trim();    
};

