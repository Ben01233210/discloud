// reactable store fuer den filebrowser damit man updates auch in der Ui sieht
import { getBasefile, type Folder, type _File } from "$lib/database";
import { writable } from "svelte/store";

let tableContent = writable<(_File | Folder)[]>([] as (_File | Folder)[]);
export default tableContent;
