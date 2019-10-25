#!/usr/bin/env node

import { existsSync } from 'fs';
import { start } from './function/start';

const CUSTOM_CONFIG_PATH = './springtype.ts';
let customConfig = {};
if (existsSync(CUSTOM_CONFIG_PATH)) {
    customConfig = import(CUSTOM_CONFIG_PATH) || {};
}
try {
    start(customConfig);
} catch(e) {
    console.log('Uncaught error: ', e.message);
}