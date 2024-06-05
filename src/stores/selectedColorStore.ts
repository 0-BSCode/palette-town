import { writable } from "svelte/store";
import type { ImageColorI } from "../types/interfaces/ImageColorInterface";

type SelectedColorStoreI = undefined | ImageColorI;

const SelectedColorStore = writable<SelectedColorStoreI>(undefined);

export default SelectedColorStore;
