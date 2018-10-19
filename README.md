# babel-plugin-ui5-next

Next-generation syntax for SAP UI5

## Example

**In**

```js
// input code
```

**Out**

```js
"use strict";

// output code
```

## Installation

```sh
$ npm install babel-plugin-ui5-next
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["ui5-next"]
}
```

### Via CLI

```sh
$ babel --plugins ui-5-next script.js
```

### Via Node API

```javascript
require("babel-core").transform("code", {
  plugins: ["ui5-next"]
});
```
