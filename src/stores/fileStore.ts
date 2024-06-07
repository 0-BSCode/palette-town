import { writable } from "svelte/store";

type FileStoreI = undefined | string;

const FileStore = writable<FileStoreI>(undefined);

export default FileStore;
