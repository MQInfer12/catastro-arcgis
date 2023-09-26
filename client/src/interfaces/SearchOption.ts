export interface SearchOption {
  type: "distrito" | "subdistrito";
  value: string | number;
  searchValue: string;
  data: {
    little: string;
    text: string;
    color: string;
  }
}