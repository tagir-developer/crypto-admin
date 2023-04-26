import { Pages } from 'routes/constants';

export type TypeUnknownObject = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TypeUnknown = any;

export type TypeQueryParams = {
  [N: string]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | undefined;
};

// enums ----------

export enum ResponseStatuses {
  SUCCESS = 'success',
  ERROR = 'error',
}

export enum LoaderSize {
  SMALL = 'small',
  LARGE = 'large',
  DEFAULT = 'default',
}

export enum NotificationTypes {
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum ButtonTypes {
  PRIMARY = 'primary',
  GHOST = 'ghost',
  DASHED = 'dashed',
  LINK = 'link',
  TEXT = 'text',
  DEFAULT = 'default',
}

export enum RequestStatuses {
  PENDING = 'pending',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
}

// [
//   "Tron",
//   "Etherium",
//   "Bitcoin",
//   "Garantex",
//   "BNB"
// ]

export enum BlockChains {
  TRON = 'Tron',
  ETHERIUM = 'Etherium',
  BITCOIN = 'Bitcoin',
  GARANTEX = 'Garantex',
  BNB = 'BNB',
}

// interfaces ----------
export interface ICurrency {
  id: string;
  name: string;
  description: string;
  currencyCode: string;
}
export interface IBreadCrumbItem {
  name: string;
  page?: Pages;
}

export interface ILoginDto {
  login: string;
  password: string;
}

export interface IBreadCrumbItem {
  name: string;
  page?: Pages;
}
export interface DataWithPagination<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface IAccount {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  created: string;
  updated: string;
  isVerified: boolean;
  jwtToken: string;
}
// export interface ISelect {
//   value: string | number;
//   label: string;
// }

export interface ISelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
