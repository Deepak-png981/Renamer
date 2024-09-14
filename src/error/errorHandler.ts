import logger from '../../logger';

export const handleError = (error: any, debug: boolean = false): void => {

  if (error.code === 'ENOENT') {
    logger.error(`File or directory not found.`);
  } else if (error.code === 'EACCES') {
    logger.error('Access denied. Please check the file permissions.');
  } else if (error.code) {
    logger.error(`System Error - Code: ${error.code}, Message: ${error.message}, Path: ${error.path}`);
  } else {
    logger.error('An unexpected error occurred:', error.message || error);
  }

  if (debug) {
    logger.debug('Debug mode is enabled, throwing error for stack trace.');
    throw error;
  }
};
