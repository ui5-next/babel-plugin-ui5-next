var fs = require("fs")
var path = require("path")

var pluginPackageJson = require("../package")
var presetPackageJson = require("../preset/package")

presetPackageJson.version = pluginPackageJson.version
presetPackageJson.dependencies["babel-plugin-ui5-next"] = pluginPackageJson.version

fs.writeFileSync(
  path.join(__dirname, "../preset/package.json"),
  JSON.stringify(presetPackageJson),
  { encoding: "UTF-8" }
)
