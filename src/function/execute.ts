import chalk from "chalk";
import { spawn } from "cross-spawn";

export function execute(cmd: string, args: Array<string> = [], options: any = {}) {
  console.log(chalk.green(">"), chalk.white(`${cmd} ${args.join(" ")}`));

  const result = spawn.sync(cmd, args, options);
  if (!options.stdio || (options.stdio !== "inherit" && options.stdio !== "ignore")) {
    return result.stdout.toString("utf8");
  }
  return null;
}
