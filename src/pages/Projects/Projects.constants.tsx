import {
  TypeFilteredDateField,
  TypeFilteredInputField,
} from 'components/TableFilters/types';
import { TypeCommonFilterTypesData } from 'hooks/hooks.interfaces';

export const filteredUsersInputFields: TypeFilteredInputField[] = [
  {
    id: 'usersIds',
    title: 'ID',
    value: 'usersIds',
    isSearchable: false,
  },
  {
    id: 'emails',
    title: 'Email',
    value: 'emails',
    isSearchable: false,
  },
  {
    id: 'balance',
    title: 'Баланс',
    value: 'balance',
    isSearchable: false,
  },
];

export const selectFilterStatusTypes: TypeCommonFilterTypesData[] = [
  { id: '1', name: 'true', description: 'Активен' },
  { id: '2', name: 'false', description: 'Не активен' },
];

export const selectFilterCreateWithApiTypes: TypeCommonFilterTypesData[] = [
  { id: '1', name: 'true', description: 'Да' },
  { id: '2', name: 'false', description: 'Нет' },
];

export const filteredUserDateFields: TypeFilteredDateField[] = [
  {
    id: 'date',
    title: 'Дата создания',
    fields: [
      {
        id: 'startDate',
        value: 'startDate',
      },
      {
        id: 'endDate',
        value: 'endDate',
      },
    ],
  },
];
