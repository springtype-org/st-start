import { existsSync } from 'fs';
import { resolve } from 'path';
import { getEnv } from './config-getters';
import { log } from './log';
export const readDotEnv = () => {
    [`.env.${getEnv()}.local`, `.env.${getEnv()}`].forEach((dotEnvFileToRead: string) => {
        const dotEnvFilePath = resolve(process.cwd(), dotEnvFileToRead);
        log(`Looking for .env file ${dotEnvFilePath}...`);

        if (existsSync(dotEnvFilePath)) {
            log(`Using .env file: ${dotEnvFileToRead}.`);
            require('dotenv-expand')(
                require('dotenv').config({
                    path: dotEnvFilePath,
                }),
            );
        }
    });
};
