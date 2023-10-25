export interface SearchOption {
  type: TypeSearch;
  value: string | number;
  searchValue: string;
  coords: TypeCoords | null;
  data: {
    little: string;
    text: string;
    color: TypeColor;
  };
}

export type TypeCoords = [number, number];

export type TypeSearch = "distrito" | "subdistrito" | "comuna" | "salud" | "educacion";

export type TypeColor = "yellow" | "red" | "purple" | "green" | "blue";