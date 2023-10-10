import { writable } from "svelte/store";
import type { DistritoJSON } from "../interfaces/DistritoJSON";
import type { SubdistritoJSON } from "../interfaces/SubdistritoJSON";
import type { ComunaJSON } from "../interfaces/ComunaJSON";
import type { SaludJSON } from "../interfaces/SaludJSON";
import type { EducacionJSON } from "../interfaces/EducacionJSON";

export const distritos = writable<DistritoJSON | null>(null);
export const subdistritos = writable<SubdistritoJSON | null>(null);
export const comunas = writable<ComunaJSON | null>(null);
export const salud = writable<SaludJSON | null>(null);
export const educacion = writable<EducacionJSON | null>(null);