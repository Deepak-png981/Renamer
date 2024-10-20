import { randomUUID } from 'crypto';
import memoize from 'lodash/memoize';

export const getJobId = memoize((): string => {
    return process.env['EXTERNAL_JOB_ID'] || randomUUID();
});

export const getAppScriptUrl = memoize((): string => {
    return process.env['APP_SCRIPT_URL'] || '' ;
});
