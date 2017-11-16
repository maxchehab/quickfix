#!/usr/bin/env node

const chalk = require("chalk");
const finder = require("find-root");
const path = require("path");
const { dependencyBuilder, downloadDependency } = require("./lib/utils");
const log = console.log;

try {
  const root = finder(process.cwd()).toString();

  dependencies = dependencyBuilder(root);

  for (dependency of dependencies) {
    downloadDependency(dependency);
  }
} catch (err) {
  if (err.message == "package.json not found in path") {
    log(
      chalk.red(`Couldn't find any dependencies. Try creating a package.json`)
    );
  } else {
    log(chalk.red(err.message));
  }
}
