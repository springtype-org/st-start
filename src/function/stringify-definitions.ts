export const stringifyDefinitions = (definitions: any = {}): any => {
    for (let name in definitions) {
        definitions[name] = JSON.stringify(definitions[name]);
    }
};
