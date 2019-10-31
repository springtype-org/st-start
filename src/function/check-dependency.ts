import { getPeerDependencyNotInstalledErrorMessage } from './config-getters';
import { exitWithErrorMessage } from './exit-with-error-message';

export const checkDependency = (peerDependencyName: string) => {
    try {

        const peerDependencyResolved = require(peerDependencyName);
        if (!peerDependencyResolved) {
            exitWithErrorMessage(getPeerDependencyNotInstalledErrorMessage(peerDependencyName));
        }
        return peerDependencyResolved;
    } catch (e) {
        exitWithErrorMessage(getPeerDependencyNotInstalledErrorMessage(peerDependencyName));
    }   
};
