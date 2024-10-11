import * as yaml from 'js-yaml';
import { CLIArguments } from "../../types";
import { generateFileName } from '../../services/openAI.service';
import { basename } from 'path';
import { sanitizeFileName } from '../../utils';
import { fileContent, filePath } from '../../types/renameFiles';
import logger from '../../../logger';
import { YmlContent } from './types/yamlTypes';


export const processYamlFile = async (filePath: filePath, content: fileContent, args: CLIArguments): Promise<string | null> => {
    try {
        const parsedYml = yaml.load(content) as YmlContent;
        const name = parsedYml?.name || '';
        const triggers = parsedYml?.on || {};
        const jobs = Object.keys(parsedYml?.jobs || {}).join(', ') || 'No jobs defined';
        const prompt = `
            This YML file defines a pipeline named "${name}". 
            It is triggered by "${JSON.stringify(triggers)}" and includes jobs like "${jobs}". 
            This is the parsedYML content : \n${JSON.stringify(parsedYml, null, 2)}
            Suggest a relevant file name based on this information.
        `;
        const baseFileName = basename(filePath);
        const suggestedFileName = await generateFileName(prompt, baseFileName , args);
        if (!suggestedFileName) {
            return null;
        }
        const newFileName = sanitizeFileName(suggestedFileName);
        return newFileName;
    } catch (error) {
        logger.error(`Error processing YML file: ${error}`);
        return null;
    }
}