import { resolve } from 'path';
import { IBuildConfig } from './../interface/ibuild-config';
import { requireFromContext } from './require-from-context';

export const notifyOnError = (severity: string, errors: Array<any>, config: IBuildConfig) => {
    const notificationIcon = resolve(__dirname, '..', 'springtype.png');
    if (severity !== 'error') {
        return;
    }

    let message: Array<string> = errors[0].message.split('\n')[0].split(/: /g);
    let file = errors[0].file || '';

    if (file.indexOf('multi') === 0) {
        const fileSplits = file.split(' ');
        file = fileSplits[fileSplits.length - 1];
    }

    // show desktop notification
    requireFromContext('node-notifier', config).notify({
        title: `${errors[0].name}`,
        message: message[message.length - 1],
        subtitle: file,
        icon: notificationIcon,
    });
};
