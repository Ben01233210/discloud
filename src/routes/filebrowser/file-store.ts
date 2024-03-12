import { getBasefile, type Folder } from "$lib/database";
import { writable } from "svelte/store";

let tableContent = writable([] as (File | Folder)[]);
export default tableContent;
