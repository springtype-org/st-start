import chalk from 'chalk';

export const log = (message: string, type: 'error' | 'warning' | 'info' = 'info', category: string = 'sts') => {
    let typeMark;

    switch (type) {
        case 'error':
            typeMark = chalk.red('!');
            break;
        case 'warning':
            typeMark = chalk.yellow('!');
            break;
        case 'info':
            typeMark = chalk.blue('ℹ');
            break;
    }
    console.log(`${typeMark} ${chalk.gray(`｢${category}｣`)}: ${message}`);
};
