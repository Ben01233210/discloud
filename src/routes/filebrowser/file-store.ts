import { getBasefile, type Folder } from "$lib/database";
import { writable } from "svelte/store";

let data: Folder = {
  name: "root",
  path: "root",
  child: null,
  parent: null,
};
getBasefile().then((args) => (data = args));

if (data.child == null) {
  data.child = [];
}
console.log(data);
let tableContent = writable(data.child);
export default tableContent;
