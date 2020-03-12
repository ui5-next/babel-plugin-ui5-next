
const namespace = "babel.test"
const babelConfig = require("../preset")(null, { namespace })

babelConfig.plugins[0] = [
  require("../src"),
  { namespace },
]

module.exports = babelConfig