import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import logger from './logger';
import { handleError } from './src/error/errorHandler';
import { processPath } from './src/processPath';
import { CLIArguments } from './src/types';

const args: CLIArguments = yargs(hideBin(process.argv))
    .option('path', {
        alias: 'p',
        describe: 'Path to the folder or file',
        type: 'string',
        demandOption: true,
    })
    .option('-d , --debug' , {
        alias: 'd',
        describe: 'Enable debug mode',
        type: 'boolean',
        default: false,
    })
    .help()
    .parseSync();

const path = args.path;

(async () => {
    try {
        logger.info('Starting file renamer...');
        if (args.debug) {
            logger.debug('Debug mode enabled');
            logger.level = 'debug';
        }
        await processPath(path, args);
    } catch (error) {
        logger.error('Error accessing path.');
        handleError(error, args.debug);
    }
})();