#!/usr/bin/env node

const chalk = require("chalk");
const finder = require("find-root");
const jsonfile = require("jsonfile");
const fs = require("fs-extra");

const {
  dependencyBuilder,
  compare,
  copyChanges,
  writeLockFile
} = require("./lib/utils");
const log = console.log;

try {
  const root = finder(process.cwd()).toString();
  const name = jsonfile.readFileSync(root + "/package.json").name;

  dependencyBuilder(name, root);

  let changes = compare(name, root);
  if (changes.length) {
    console.log("> Detected " + changes.length + " changes:");
  } else {
    console.log("> No changes detected.");
  }
  changes.forEach(function(entry) {
    console.log("\t" + chalk.red(entry.relativePath));
  });

  copyChanges(changes, root);

  writeLockFile(changes, root);
} catch (err) {
  if (err.message == "package.json not found in path") {
    log(
      chalk.red(`Couldn't find any dependencies. Try creating a package.json`)
    );
  } else {
    throw err;
  }
}
