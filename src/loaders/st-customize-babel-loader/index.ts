const crypto = require('crypto');
const macroTest = new RegExp('[./]macro');

export default () => {
    return {
        config(config: any, { source }: { source: string }) {
            if (macroTest.test(source)) {
                return Object.assign({}, config.options, {
                    caller: Object.assign({}, config.options.caller, {
                        craInvalidationToken: crypto.randomBytes(32).toString('hex'),
                    }),
                });
            }
            return config.options;
        },
    };
};
