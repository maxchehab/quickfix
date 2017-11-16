const child = require("child_process");
const fs = require("fs-extra");
const dircompare = require("dir-compare");
const hasYarn = require("has-yarn");

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
      console.log("> Detected a yarn installation.");
      child.execSync("cd " + path + "; yarn install");
    } else {
      child.execSync("cd " + path + "; npm install");
    }

    console.log("> Comparing...");
  },

  compare: function(name, root) {
    let path1 = "/tmp/quickfix/" + name + "/node_modules";
    let path2 = root + "/node_modules";
    var options = { compareContent: true, excludeFilter: "package.json" };

    dircompare
      .compare(path1, path2, options)
      .then(function(res) {
        console.log("equal: " + res.equal);
        console.log("distinct: " + res.distinct);
        console.log("left: " + res.left);
        console.log("right: " + res.right);
        console.log("differences: " + res.differences);
        console.log("same: " + res.same);
        var format = require("util").format;
        res.diffSet.forEach(function(entry) {
          var state = {
            equal: "==",
            left: "->",
            right: "<-",
            distinct: "<>"
          }[entry.state];
          var name1 = entry.name1 ? entry.name1 : "";
          var name2 = entry.name2 ? entry.name2 : "";
          if (state == "==") return;
          console.log(
            format(
              "%s(%s)%s%s(%s)",
              name1,
              entry.type1,
              state,
              name2,
              entry.type2
            )
          );
        });
      })
      .catch(function(error) {
        console.error(error);
      });
  }
};
