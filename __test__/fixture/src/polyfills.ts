console.log('Load polyfills');

const polyfills = [];

setTimeout(() => {
    polyfills.push(import('whatwg-fetch'));
    polyfills.push(import('proxy-polyfill/src/proxy'));
    polyfills.push(import('@ungap/weakmap'));

    Promise.all(polyfills)
        .then(() => {
            console.log('Polyfilly loaded!');
        })
        .catch(error => {
            console.error('Failed fetching polyfills', error);
        });
}, 1000);
