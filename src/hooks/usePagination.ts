import { TablePaginationConfig } from 'antd';
import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  PAGE_INDEX_TEXT,
  PAGE_SIZE_TEXT,
} from 'common/constants';
import { useLocation, useNavigate } from 'react-router';

import { TypeUsePagination } from './hooks.interfaces';

export function usePagination(): TypeUsePagination {
  const navigate = useNavigate();
  const location = useLocation();

  const newUrlSearchParams = new URLSearchParams(location.search);

  const pageIndexParam =
    newUrlSearchParams.get(PAGE_INDEX_TEXT) !== null
      ? Number(newUrlSearchParams.get(PAGE_INDEX_TEXT))
      : DEFAULT_PAGE_INDEX;

  const pageSizeParam =
    newUrlSearchParams.get(PAGE_SIZE_TEXT) !== null
      ? Number(newUrlSearchParams.get(PAGE_SIZE_TEXT))
      : DEFAULT_PAGE_SIZE;

  const getPaginationConfig = (totalCount: number): TablePaginationConfig => {
    if (
      newUrlSearchParams.toString().includes(PAGE_INDEX_TEXT || PAGE_SIZE_TEXT)
    ) {
      newUrlSearchParams.delete(PAGE_INDEX_TEXT);
      newUrlSearchParams.delete(PAGE_SIZE_TEXT);
    }

    const queryString = newUrlSearchParams.toString()
      ? `&${newUrlSearchParams.toString()}`
      : '';

    return {
      current: +pageIndexParam,
      pageSize: +pageSizeParam,
      onChange: (page: number, pageSize: number) => {
        //изменение pageIndex иначе изменение pageSize
        if (pageSize === +(pageSizeParam ?? DEFAULT_PAGE_SIZE)) {
          navigate({
            pathname: location.pathname,
            search: `?${PAGE_INDEX_TEXT}=${page}&${PAGE_SIZE_TEXT}=${pageSize}${queryString}`,
          });
        } else {
          if (pageSize) {
            navigate({
              pathname: location.pathname,
              search: `?${PAGE_INDEX_TEXT}=${DEFAULT_PAGE_INDEX}&${PAGE_SIZE_TEXT}=${pageSize}${queryString}`,
            });
          }
        }
      },
      showSizeChanger: true,
      total: totalCount,
      size: 'default',
      position: ['bottomLeft'],
    };
  };

  const getPagination = (
    totalCount: number,
  ): false | TablePaginationConfig | undefined => {
    //не отображаем pagination
    if (totalCount && totalCount <= DEFAULT_PAGE_SIZE) {
      return false;
    }

    if (totalCount) {
      return getPaginationConfig(totalCount);
    }
  };

  return { pageIndexParam, pageSizeParam, getPagination };
}
