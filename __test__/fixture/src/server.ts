import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const run = (args: Array<string>) => {
    const inputPath = resolve(args[2]);
    const outputPath = resolve(args[3]);

    console.log('Simulating a node script. Copying file: ', inputPath, 'to', outputPath);

    const fileContent = readFileSync(inputPath, 'utf8');
    writeFileSync(outputPath, fileContent);

    console.log('Done copying. Exiting');
};
run(process.argv);
