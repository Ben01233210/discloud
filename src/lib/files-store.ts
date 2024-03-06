import {writable} from 'svelte/store';
import type { Folder } from '$lib/Database';
let data = writable({} as Folder)
export {data}
