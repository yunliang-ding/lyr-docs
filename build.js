const chalk = require('chalk');
const fs = require('fs-extra');
const glob = require('glob');
const { exec } = require('child_process');
console.log(chalk.cyanBright('start building.'));
exec('tsc -d', (err, stdout) => {
  if(err){
    console.log(chalk.bgRed('--- build error ----'));
    console.log(chalk.red(stdout));
  } else {
    const files = glob.sync('./dist/**/*.[t]s');
    console.log(chalk.bgCyan('--- build success ----'));
    /** 拷贝模版 */
    fs.copySync('./code', './dist/code');
    files.forEach((i) => console.log(chalk.cyanBright(i)));
  }
});
