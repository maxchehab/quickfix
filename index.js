#!/usr/bin/env node

const chalk = require("chalk");
const finder = require("find-root");
const jsonfile = require("jsonfile");

const { dependencyBuilder, compare } = require("./lib/utils");
const log = console.log;

try {
  const root = finder(process.cwd()).toString();
  const name = jsonfile.readFileSync(root + "/package.json").name;

  dependencyBuilder(name, root);
  compare(name, root);
} catch (err) {
  if (err.message == "package.json not found in path") {
    log(
      chalk.red(`Couldn't find any dependencies. Try creating a package.json`)
    );
  } else {
    //log(chalk.red(err.message));
    throw err;
  }
}
