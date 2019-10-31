import { st } from 'springtype/core';
import { component } from 'springtype/web/component';
import { tsx } from 'springtype/web/vdom';
import * as styles2 from './some.scss';

@component()
export class Demo extends st.component {
    render() {
        return (
            <div class={styles2.AlignmentSection}>
                <div>1</div>
            </div>
        );
    }
}

st.render(<Demo />);

export declare const css: (literals: TemplateStringsArray, ...placeholders: string[]) => string;

export class Works {
    a: boolean;

    constructor() {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode('works'));
        document.body.appendChild(p);

        //console.log('styles12', styles, 'styles2', styles2);
    }
}
new Works();

console.log('index.tsx loaded');
