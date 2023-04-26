export type TypeSelectTagRenderOption = {
  value: string;
};

export type TypeFilteredInputField = {
  id: string;
  title: string;
  value: string;
  isSearchable: boolean;
  wsCommandPrefix?: string;
};

export type TypeFilteredSelectField = {
  id: string;
  title: string;
  value: string;
  options: TypeSelectTagRenderOption[];
  getConvertedChosenOption: (
    chosenOption: string[],
  ) => (number | string | null)[];
};

export type TypeFilteredDateField = {
  id: string;
  title: string;
  fields: {
    id: string;
    value: string;
  }[];
};

export type TypeFilteredRangeField = TypeFilteredDateField;

export type TypeCommonFilterTypesData = {
  id: number | string;
  name: string;
  description: string;
};

export type TypeEntityStatus = TypeCommonFilterTypesData;

export type TypeOperationTypesData = TypeCommonFilterTypesData;

export type TypeFilteredFields = {
  filteredInputFields: TypeFilteredInputField[];
  filteredSelectFields: TypeFilteredSelectField[];
  filteredDateFields: TypeFilteredDateField[];
};

export type TypeTableFiltersFormValues = {
  [key: string]: moment.Moment[] | string[] | null | number;
};
