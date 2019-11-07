import "springtype/core";
import { st } from 'springtype/core';
import "springtype/core/cd";
import "springtype/core/context";
import "springtype/core/di";
import "springtype/core/i18n";
import "springtype/core/lang";
import "springtype/web/component";
import { component } from 'springtype/web/component';
import "springtype/web/router";
import "springtype/web/tss";
import "springtype/web/vdom";
import { tsx } from 'springtype/web/vdom';
import * as styles2 from './some.css';

@component()
export class Demo extends st.component {
    render() {

        console.log('ST_TEST env', process.env.ST_TEST);

        return (
            <div class={styles2.AlignmentSection1}>
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

