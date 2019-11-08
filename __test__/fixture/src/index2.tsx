import 'springtype/core';
import { st } from 'springtype/core';
import 'springtype/core/cd';
import 'springtype/core/context';
import 'springtype/core/di';
import 'springtype/core/i18n';
import 'springtype/core/lang';
import 'springtype/web/component';
import { attr, component } from 'springtype/web/component';
import 'springtype/web/router';
import 'springtype/web/tss';
import 'springtype/web/vdom';
import { domRef, tsx } from 'springtype/web/vdom';
import * as material from "./material.scss";
import * as styles2 from './some.css';
import "./some.global.scss"; // global CSS
import vertShader from "./test.vert";



console.log('Raw file import', vertShader);
console.log("material", material.mdcButton);


@component()
export class Demo extends st.component {
    @domRef('some')
    some: string = 'foo';

    @attr()
    some1: string = 'bar';

    constructor() {
        super();

        console.log('some1 ctor', this.some1);

        this.some1 = 'foo2';
    }

    // attribute changes can be listened to
    onAttributeChange(name: string, value: any) {
        console.log('@attr', name, 'changed to', value /*, 'and', globalStyles*/);
    }

    onAfterInitialRender() {
        console.log('some1 afterRender', this.some1);
    }

    render() {
        console.log('ST_TEST env', process.env.ST_TEST);

        return (
            <div ref={{ some1: this }} class={styles2.AlignmentSection1}>
                <div>{this.some}</div>
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
