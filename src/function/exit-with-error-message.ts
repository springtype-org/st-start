import { log } from './log';

export const exitWithErrorMessage = (errorMessage: string): void => {
    log(`Fatal: ${errorMessage}. Exiting.`, 'error');
    process.exit(1);
};
