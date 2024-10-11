import { parse } from '@typescript-eslint/typescript-estree';
import { CLIArguments } from "../../types";
import { generateFileName } from '../../services/openAI.service';
import { basename } from 'path';
import { sanitizeFileName } from '../../utils';
import { fileContent, filePath } from '../../types/renameFiles';

export const processJavaScriptFile = async (filePath: filePath, content: fileContent, args: CLIArguments): Promise<string | null> => {
    try {
        if (!content || content.trim().length === 0) {
            console.warn(`File ${filePath} is empty, skipping renaming.`);
            return null;  
        }
        const parsedAST = parse(content, { loc: true , jsx: true });

        const functions: string[] = [];
        const classes: string[] = [];
        const constants: string[] = [];

        parsedAST.body.forEach(node => {
            if (node.type === 'ExportNamedDeclaration' && node.declaration) {
                const declaration = node.declaration;
                if (declaration.type === 'FunctionDeclaration' && declaration.id) {
                    functions.push(declaration.id.name);
                } else if (declaration.type === 'ClassDeclaration' && declaration.id) {
                    classes.push(declaration.id.name);
                } else if (declaration.type === 'VariableDeclaration') {
                    declaration.declarations.forEach(declaration => {
                        if (declaration.id.type === 'Identifier') {
                            if (declaration.init && declaration.init.type === 'ArrowFunctionExpression') {
                                functions.push(declaration.id.name);
                            } else {
                                constants.push(declaration.id.name);
                            }
                        }
                    });
                }
            }
            else if (node.type === 'FunctionDeclaration' && node.id) {
                functions.push(node.id.name);
            } else if (node.type === 'ClassDeclaration' && node.id) {
                classes.push(node.id.name);
            } else if (node.type === 'VariableDeclaration') {
                node.declarations.forEach(declaration => {
                    if (declaration.id.type === 'Identifier') {
                        if (declaration.init && declaration.init.type === 'ArrowFunctionExpression') {
                            functions.push(declaration.id.name);
                        } else {
                            constants.push(declaration.id.name);
                        }
                    }
                });
            }
        });

        const prompt = `
      The file contains the following JavaScript elements:
      - Functions: ${functions.join(", ")}
      - Classes: ${classes.join(", ")}
      - Constants: ${constants.join(", ")}

      Based on these elements, suggest a concise, descriptive file name in "${args.namingConvention}" format.
    `;
        const baseFileName = basename(filePath);
        const suggestedTsFileName = await generateFileName(prompt, baseFileName, args);
        if (!suggestedTsFileName) {
            return null;
        }
        const newFileName = sanitizeFileName(suggestedTsFileName);
        return newFileName;
    } catch (error) {
        console.error(`Error processing TypeScript file: ${error}`);
        return null;
    }
};
