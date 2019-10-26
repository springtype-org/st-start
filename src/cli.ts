#!/usr/bin/env node

import { existsSync } from 'fs';
import { resolve } from 'path';
import { start } from './function/start';

const CUSTOM_CONFIG_PATH = resolve(process.cwd(), 'springtype.ts');
let customConfig = {};
if (existsSync(CUSTOM_CONFIG_PATH)) {
    customConfig = import(CUSTOM_CONFIG_PATH) || {};
}
try {
    start(customConfig);
} catch(e) {
    console.log('Uncaught error: ', e.message);
}