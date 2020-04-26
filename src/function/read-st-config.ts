import { transpileModule } from "typescript";
import { readFileSync } from "fs";

export const readStConfig = async(stConfigFilePath: string) => {

    const tsCode = readFileSync(stConfigFilePath, {
        encoding: 'utf8'
    });

    const jsCode = await transpileModule(tsCode, {});

    // execute transpiled JS
    return eval(jsCode.outputText);
}