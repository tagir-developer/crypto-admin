import { getDateParamFromMoment } from 'common/helpers';
import moment from 'moment';
import { EventValue } from 'rc-picker/lib/interface';

import {
  TypeGetConvertedChosenOptions,
  TypeSelectTagRenderOptions,
} from './SelectTagRender/types';
import { TypeCommonFilterTypesData } from './types';

const convertFiltersValueToParams = (
  queryString: URLSearchParams,
  fieldName: string,
  fieldValues: string[] | EventValue<moment.Moment>,
): URLSearchParams => {
  queryString.delete(fieldName);

  if (moment.isMoment(fieldValues)) {
    queryString.append(fieldName, getDateParamFromMoment(fieldValues));
  } else if (fieldValues) {
    for (let i = 0; i < fieldValues?.length; i++) {
      queryString.append(fieldName, fieldValues[i]);
    }
  }

  return queryString;
};

export const getQueryString = (
  queryString: URLSearchParams,
  filtersValues: {
    [key: string]: string[] | EventValue<moment.Moment>;
  },
): URLSearchParams | string => {
  let filtersQueryString;
  const filtersEntries = Object.entries(filtersValues);

  for (let i = 0; i < filtersEntries.length; i++) {
    filtersQueryString = convertFiltersValueToParams(
      queryString,
      filtersEntries[i][0],
      filtersEntries[i][1],
    );
  }

  if (!filtersQueryString) {
    return '';
  }

  return filtersQueryString;
};

export const getSelectTagRenderOptions = (
  filterSelectData: TypeCommonFilterTypesData[] | null,
): TypeSelectTagRenderOptions => {
  if (filterSelectData) {
    return filterSelectData.map((item) => ({
      value: item.description,
    }));
  } else {
    return [
      {
        value: '',
      },
    ];
  }
};

// Преобразует string значение элементов массива typesData в number
export const getConvertedChosenOption = (
  typesData: TypeCommonFilterTypesData[] | null,
  chosenOption: string[],
  searchByName?: boolean,
): TypeGetConvertedChosenOptions => {
  if (typesData) {
    return chosenOption.map((option) => {
      const operationTypeArray = typesData.filter(
        (item) => item.description === option,
      );
      const operationType = operationTypeArray.length
        ? searchByName
          ? operationTypeArray[0].name
          : operationTypeArray[0].id
        : null;

      return operationType;
    });
  } else {
    return [];
  }
};
