import pino, { Logger } from 'pino';
import pinoPretty from 'pino-pretty';

const pretty = pinoPretty({
    colorize: true,
    translateTime: 'yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
});

const logger: Logger = pino({
    level: process.env.LOG_LEVEL || 'info',
}, pretty);

export default logger;
