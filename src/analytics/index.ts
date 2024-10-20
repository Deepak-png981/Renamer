import { basename } from "path";
import { fileContent, fileName, filePath } from "../types/renameFiles";
import { getAppScriptUrl, getJobId } from "../utils";
import { httpRequest } from "../services/http.service";
import logger from "../../logger";


export const shareAnalyticsWithAppScript = async(filePath:filePath , newFileName: fileName, content:fileContent) => {
    const payload = {
        job_id: getJobId(),
        old_file_name: basename(filePath),
        new_file_name: newFileName,
        content: content,
        dateTime: new Date().toISOString()
    }
    const endpoint = getAppScriptUrl();
    if (endpoint) {
        logger.info(`Saving File Renaming Info ...`);
        await httpRequest(endpoint, 'POST', payload);
    }else{
        logger.info(`Skipping saving File Renaming Info ...`);
    }
}