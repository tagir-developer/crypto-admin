import { TypeGetConvertedChosenOptions } from 'components/TableFilters/SelectTagRender/types';
import {
  getConvertedChosenOption,
  getSelectTagRenderOptions,
} from 'components/TableFilters/helper';
import { TypeFilteredSelectField } from 'components/TableFilters/types';
import { useCallback, useState } from 'react';

import {
  IUseFilterConfig,
  IUseFilters,
  TypeFilterValues,
  TypeFiltersSelectDataDefaultType,
} from './hooks.interfaces';

export function useFilters(config: IUseFilterConfig): IUseFilters {
  const [filtersValues, setFiltersValues] = useState<TypeFilterValues>({});

  const selectData: TypeFiltersSelectDataDefaultType[] = [];

  // обработка фильтров с выпадающим списком
  const filteredSelectFields: TypeFilteredSelectField[] | undefined =
    config.selectInputOptions?.map((item) => {
      const selectTagRenderOptions = getSelectTagRenderOptions(item.types);

      const getConvertedOption = (
        chosenOption: string[],
      ): TypeGetConvertedChosenOptions =>
        getConvertedChosenOption(item.types, chosenOption, item.searchByName);

      selectData.push(item.types);

      return {
        id: item.id,
        title: item.title,
        value: item.value,
        options: selectTagRenderOptions,
        getConvertedChosenOption: getConvertedOption,
      };
    });

  // заполнение фильтров с выпадающим списком тегами на основе уже указанных значений квери параметров
  const getSelectFieldValueById = useCallback(
    (ids: string[], fieldName: string | null): string[] => {
      if (config.selectInputOptions) {
        for (let i = 0; i < config.selectInputOptions.length; i++) {
          const selectOptions = config.selectInputOptions[i];

          if (selectOptions.value === fieldName) {
            return selectOptions.types
              .filter((item) =>
                ids.includes(
                  String(selectOptions.searchByName ? item.name : item.id),
                ),
              )
              .map((type) => type.description);
          }
        }

        return [];
      } else {
        return [];
      }
    },
    [config.selectInputOptions],
  );

  return {
    filterProps: {
      filteredInputFields: config.filteredInputFields ?? [],
      filteredDateFields: config.filteredDateFields ?? [],
      filteredDateWithTimeFields: config.filteredDateWithTimeFields ?? [],
      filteredSelectFields: filteredSelectFields ?? [],
      filteredRangeFields: config.filteredRangeFields ?? [],
      filteredOneValueInputFields: config.filteredOneValueInputFields ?? [],
      defaultActiveFilterIds: config.defaultActiveFilterIds ?? [],
      alwaysActiveFilterIds: config.alwaysActiveFilterIds ?? [],
      filtersValues,
      setFiltersValues,
      selectData,
      getSelectFieldValueById,
    },
  };
}
