import { writable } from "svelte/store";

type FileStoreI = undefined | string;

const FileStore = writable<FileStoreI>(undefined);

// TODO: Integrate this with components that set file
// FileStore.subscribe((value) => {
//     if (value !== undefined && !(value instanceof File) && typeof value !== 'string') {
//         FileStore.set(undefined);
//     }
// });

export default FileStore;
