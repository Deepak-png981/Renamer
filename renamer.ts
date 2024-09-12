import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { renameFilesInDirectory, renameSingleFile } from './src/renameFiles';
import { statSync } from 'fs';

const argv = yargs(hideBin(process.argv))
.option('path', {
alias: 'p',
describe: 'Path to the folder or file',
type: 'string',
demandOption: true,
})
.help()
.parseSync();

const path = argv.path;


try {
const stats = statSync(path);

if (stats.isDirectory()) {
renameFilesInDirectory(path);
} else if (stats.isFile()) {
renameSingleFile(path);
} else {
console.error('Invalid path provided. Please specify a valid file or folder path.');
}
} catch (error) {
console.error('Error accessing path:', error);
}
