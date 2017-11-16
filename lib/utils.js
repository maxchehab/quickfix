const child = require("child_process");
const fs = require("fs-extra");
const dircompare = require("dir-compare");
const hasYarn = require("has-yarn");
const chalk = require("chalk");
const md5 = require("md5-file");
const jsonfile = require("jsonfile");

module.exports = {
  dependencyBuilder: function(name, root) {
    console.log("> Creating cache path.");

    //Create the cache path.
    const path = "/tmp/quickfix/" + name;

    //If the caching path does not exists, create it.
    fs.ensureDirSync(path);

    console.log("> Copying package.json to cache path.");
    //Copy current package.json to cache path.
    fs.copySync(root + "/package.json", path + "/package.json");

    console.log(
      "> Installing dependencies to cache path. This may take a while."
    );

    //Use either npm or yarn to install cache dependencies.
    if (hasYarn) {
      console.log(chalk.yellow("> Detected a yarn installation."));
      child.execSync("cd " + path + "; yarn install");
    } else {
      child.execSync("cd " + path + "; npm install");
    }

    console.log("> Comparing...");
  },

  compare: function(name, root) {
    //Creating cache and relative paths.
    const path1 = "/tmp/quickfix/" + name + "/node_modules";
    const path2 = root + "/node_modules";
    const options = { compareContent: true, excludeFilter: "package.json" };

    //Compare cache and relative node_modules
    let res = dircompare.compareSync(path1, path2, options);

    //Populate changes with all entrys that are not equal.
    let changes = [];
    res.diffSet.forEach(function(entry) {
      if (entry.state != "equal" && entry.path2) {
        changes.push({
          absolutePath: entry.path2 + "/" + entry.name2,
          relativePath: entry.relativePath + "/" + entry.name2,
          checksum: md5.sync(entry.path2 + "/" + entry.name2)
        });
      }
    });

    return changes;
  },
  copyChanges(changes, root) {
    console.log("> Recording changes.");
    //Refresh __quickfix__ directory
    let path = root + "/__quickfix__";
    fs.removeSync(path);
    fs.mkdirSync(path);

    //Copy all changes to __quickfix__ directory
    changes.forEach(function(change) {
      fs.copySync(change.absolutePath, path + "/" + change.checksum);
    });
  },
  writeLockFile(changes, root) {
    console.log("> Writing lock file.");

    //Remove absolutePath. This is unnecessary information..
    for (change of changes) {
      delete change.absolutePath;
    }

    //Create and save to __quickfix__/quickfix.lock
    let path = root + "/__quickfix__";
    jsonfile.writeFileSync(path + "/quickfix.lock", changes);
  },
  deleteCache() {
    console.log("> Cleaning cache.");

    //Remove cache
    fs.removeSync("/tmp/quickfix");
  }
};
