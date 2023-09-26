import { writable } from "svelte/store";
import type { DistritoJSON } from "../interfaces/DistritoJSON";
import type { SubdistritoJSON } from "../interfaces/SubdistritoJSON";

export const distritos = writable<DistritoJSON | null>(null);
export const subdistritos = writable<SubdistritoJSON | null>(null);