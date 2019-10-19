export class Works {
    constructor() {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('works'));
        document.body.appendChild(p);
    }
}
new Works();
