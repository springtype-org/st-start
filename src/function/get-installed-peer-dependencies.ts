import { IBuildConfig } from "../interface/ibuild-config";
import { readFileSync } from "fs";
import { resolve } from "path";
import { getContextPath } from "./config-getters";

export const getInstalledPeerDependencies = (config: IBuildConfig) => {
    return JSON.parse(readFileSync(resolve(getContextPath(config), 'package.json'), 'utf8')).devDependencies || {};
}