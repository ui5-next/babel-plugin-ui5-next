import "babel-cli"
import { AppRouter } from "./AppRouter";
import { name } from "@babel/plugin-syntax-decorators";

console.log(name)
AppRouter.placeAt("content");