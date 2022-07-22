import chalk from 'chalk';

const log = (message: string, amount: number | string, busineesName?: string): void => {
  const chalkInfo = (val: number | string) => {
    if (Number.isInteger(val)) {
      return chalk.red(val);
    } else {
      return chalk.green(val);
    }
  };

  console.log(`${chalk.blue(message)} ${busineesName ? `- ${chalkInfo(busineesName)}` : ''} : ${chalkInfo(amount)}`);
};

const logStatus = (message: string): void => {
  console.log(chalk.magenta(`------ ${message} ------`));
};

export { log, logStatus };
