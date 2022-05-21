export interface PropsObject {
  [props: string]: any
}

export type SortBaseProps = 1 | -1 | 'asc' | 'desc';

export interface SortBaseRequest {
  sort?: 1 | -1 | 'asc' | 'desc'; // always number or string, with number 1, -1, string: 'asc', 'desc'
  page_size?: number; // show element per page, default: 10
  page?: number | string; // get element of specific page, default: 1
  key?: any // field wants to sort data, default: undefined;
  query?: string // find for the key
  value?: string // value for the key
}
