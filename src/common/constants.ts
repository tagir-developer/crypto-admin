import { TableLocale } from 'antd/lib/table/interface';

export const IS_DEV = process.env.NODE_ENV === 'development';

export const DEFAULT_PAGE_INDEX = 1;
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_INDEX_TEXT = 'pageNumber';
export const PAGE_SIZE_TEXT = 'pageSize';

export const DEFAULT_TIME_FORMAT = 'DD.MM.YYYY HH:mm';
export const SHORT_TIME_FORMAT = 'DD.MM.YYYY';

export const NOTIFICATION_DEFAULT_DURATION_IN_SECONDS = 5;

export const QUERY_PARAMS_TIMEZONE_OFFSET = 0;

export const EMPTY_VALUE = '–';

export const CURRENCY_SYMBOL = '₽';

export const AUTH_DATA_STORAGE_KEY = 'CryptoAdminAuthStorage';

export const ANT_TABLE_TEXT: TableLocale = {
  triggerDesc: 'Сортировать (по убыванию)',
  triggerAsc: 'Сортировать (по возрастанию)',
  cancelSort: 'Сбросить сортировку',
  emptyText: 'Нет данных',
};

export const DEFAULT_TABLE_ROWS_COUNT = 10;
export const TABLE_ROWS_HEIGHT = 60;
export const MODAL_TABLE_ROWS_HEIGHT = 70;
