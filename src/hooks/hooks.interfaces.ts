import { FormInstance, TablePaginationConfig } from 'antd';
import { ISelectOption } from 'common/interfaces';
import {
  TypeFilteredDateField,
  TypeFilteredInputField,
  TypeFilteredRangeField,
  TypeFilteredSelectField,
} from 'components/TableFilters/types';
import { EventValue } from 'rc-picker/lib/interface';

export type TypeFiltersSelectDataDefaultType = {
  [key: string]: string | number | boolean;
}[];

export type TypeCommonFilterTypesData = {
  id: number | string;
  name: string;
  description: string;
};

export type TypeUsePagination = {
  pageIndexParam: number;
  pageSizeParam: number;
  getPagination: (
    totalCount: number,
  ) => false | TablePaginationConfig | undefined;
};

export type TypeSelectInputOptions = {
  id: string;
  title: string;
  value: string;
  searchByName?: boolean; // Если true, то в значение query параметра попадает значение поля name, иначе id
  types: TypeCommonFilterTypesData[];
};

export type TypeFilterValues = {
  [key: string]: string[] | EventValue<moment.Moment>;
};
export interface IUseFilterConfig {
  filteredInputFields?: TypeFilteredInputField[];
  selectInputOptions?: TypeSelectInputOptions[];
  filteredDateFields?: TypeFilteredDateField[];
  filteredDateWithTimeFields?: TypeFilteredDateField[];
  filteredRangeFields?: TypeFilteredRangeField[];
  filteredOneValueInputFields?: TypeFilteredInputField[];
  defaultActiveFilterIds?: string[];
  alwaysActiveFilterIds?: string[];
}
export interface IUseFilters {
  filterProps: {
    filteredInputFields: TypeFilteredInputField[];
    filteredDateFields: TypeFilteredDateField[];
    filteredDateWithTimeFields: TypeFilteredDateField[];
    filteredSelectFields: TypeFilteredSelectField[];
    filteredRangeFields: TypeFilteredRangeField[];
    filteredOneValueInputFields: TypeFilteredInputField[];
    filtersValues: TypeFilterValues;
    setFiltersValues: React.Dispatch<React.SetStateAction<TypeFilterValues>>;
    selectData: TypeFiltersSelectDataDefaultType[];
    getSelectFieldValueById: (
      ids: string[],
      fieldName: string | null,
    ) => string[];
    defaultActiveFilterIds: string[];
    alwaysActiveFilterIds: string[];
  };
}

export interface TypeUseFormTable<T> {
  getSelectOptions: (
    items: T[] | undefined,
    selectedItems: T[] | undefined,
  ) => ISelectOption[];
  selectItemHandler: (items: T[] | undefined, itemId: string | null) => void;
  handleDeleteItem: (item: T) => void;
}
