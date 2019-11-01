import chalk from "chalk";
const spawn = require("cross-spawn");

export function execute(cmd: string, args: Array<string> = [], options: any = {}) {
  console.log(chalk.green(">"), chalk.white(`${cmd} ${args.join(" ")}`));

  // @ts-ignore
  const result = spawn.sync(cmd, args, options);
  if (!options.stdio || (options.stdio !== "inherit" && options.stdio !== "ignore")) {
    return result.stdout.toString("utf8");
  }
  return null;
}
