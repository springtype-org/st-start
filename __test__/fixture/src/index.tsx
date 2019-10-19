import './polyfills';

export class Works {
    a: boolean;

    constructor() {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('works'));
        document.body.appendChild(p);

        new Proxy({}, {});
        new WeakMap();
        const x = new Map();
        console.log(x);
    }
}
new Works();

console.log('index.tsx loaded');
