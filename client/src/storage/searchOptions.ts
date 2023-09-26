import { writable } from "svelte/store";
import type { SearchOption } from "../interfaces/SearchOption";

export const searchOptions = writable<SearchOption[]>([]);