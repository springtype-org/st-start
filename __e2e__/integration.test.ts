import 'testcafe';
import { Selector } from 'testcafe';

fixture`index.html`.page('../__test__/fixture/dist/index.html');

// @ts-ignore
test('proof it lead to an executable result', async (t: TestController) => {
    const bodyInnerText = Selector(() => document.body.querySelector('p'));
    await t.expect((await bodyInnerText()).textContent).eql('works');
});
