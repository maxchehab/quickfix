const jsonfile = require("jsonfile");
const downloadNpmPackage = require("download-npm-package");

module.exports = {
  dependencyBuilder: function(path) {
    const dependencies = jsonfile.readFileSync(path + "/package.json")
      .dependencies;

    let arr = [];
    for (var key in dependencies) {
      if (dependencies.hasOwnProperty(key)) {
        arr.push({ name: key, version: dependencies[key] });
      }
    }

    return arr;
  },
  downloadDependency: async function(dependency) {
    await downloadNpmPackage({
      arg: dependency.name + "@" + dependency.version,
      dir: "/tmp/quickfix/" + dependency.name + "@" + dependency.version
    });
  }
};
