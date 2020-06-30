var fs = require("fs")
var path = require("path")
var { forEach, has } = require("@newdash/newdash")

var pluginPackageJson = require("../package")
var presetPackageJson = require("../preset/package")

presetPackageJson.version = pluginPackageJson.version
presetPackageJson.dependencies["babel-plugin-ui5-next"] = pluginPackageJson.version

// copy plugins versions
forEach(presetPackageJson.dependencies, (value, name) => {
  if (has(pluginPackageJson.devDependencies, name)) {
    presetPackageJson.dependencies[name] = pluginPackageJson.devDependencies[name]
  }
})

console.log(presetPackageJson)

fs.writeFileSync(
  path.join(__dirname, "../preset/package.json"),
  JSON.stringify(presetPackageJson, null, 2),
  { encoding: "UTF-8" }
)
