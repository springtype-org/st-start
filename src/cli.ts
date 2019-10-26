#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { start } from './function/start';

const CUSTOM_CONFIG_PATH = resolve(process.cwd(), 'springtype.json');
let customConfig = {};
if (existsSync(CUSTOM_CONFIG_PATH)) {
    console.log('[stb] Using local springtype.json config file.');
    customConfig = JSON.parse(readFileSync(CUSTOM_CONFIG_PATH, "utf8")) || {};
}
try {
    start(customConfig);
} catch(e) {
    console.log('Uncaught error: ', e.message);
}