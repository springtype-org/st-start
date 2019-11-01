import {execSync} from 'child_process';
import {readFileSync} from 'fs';
import {deletePathOrFile} from 'st-rm-rf';

// excution directory is: ../ (!) so __test__ is prefixed
describe('Bundle', () => {
    it('Builds the fixture in development mode', async () => {
        process.chdir('./__test__/fixture');

        await deletePathOrFile('dist');

        execSync('yarn start:prod');

        expect(readFileSync('./dist/index.html', 'utf8')).toContain('main.');
    });
});
