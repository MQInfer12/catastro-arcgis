export interface SearchOption {
  type: TypeSearch;
  value: string | number;
  searchValue: string;
  data: {
    little: string;
    text: string;
    color: TypeColor;
  };
}

export type TypeSearch = "distrito" | "subdistrito" | "distritoByClick" | "comuna";

export type TypeColor = "yellow" | "red" | "purple" | "green" | "blue";