export interface SearchOption {
  type: TypeSearch;
  value: string | number;
  searchValue: string;
  data: {
    little: string;
    text: string;
    color: string;
  };
}

export type TypeSearch = "distrito" | "subdistrito";
