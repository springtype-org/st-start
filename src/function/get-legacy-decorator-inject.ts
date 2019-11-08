
const InjectPlugin = require('webpack-inject-plugin').default;

export const getLegacyDecoratorInject = () => {

    return new InjectPlugin(() => {
        return `
            var global = Function('return this')();
            global.__st_defineProperty = global.Object.defineProperty;
            global.Object.defineProperty = function(prototype, propertyName, descriptor) {
                var prefix = '$$__transformer_legacy__$$';
                if (typeof propertyName == 'string' && propertyName.indexOf(prefix) === 0) {
                    propertyName = propertyName.replace(prefix, '');                        
                    prototype[propertyName] = descriptor.value;
                } else {
                    global.__st_defineProperty(prototype, propertyName, descriptor);
                }
            };
        `;
    })
};