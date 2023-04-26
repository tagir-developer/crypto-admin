import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Form } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import classNames from 'classnames';
import { PAGE_INDEX_TEXT, PAGE_SIZE_TEXT } from 'common/constants';
import { ButtonTypes, TypeQueryParams } from 'common/interfaces';
import { TypeFilterValues } from 'hooks/hooks.interfaces';
import { DebouncedFunc, isArray } from 'lodash';
import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import DateFilter from './DateFilter';
import DeleteFilterBtn from './DeleteFilterBtn';
import DropDownOverlay from './DropDownOverlay';
import InputFilter from './InputFilter';
import InputTagRender from './InputTagRender';
import RangeFilter from './RangeFilter';
import SelectTagRender from './SelectTagRender';
import styles from './TableFilters.module.scss';
import { getQueryString } from './helper';
import {
  TypeFilteredDateField,
  TypeFilteredInputField,
  TypeFilteredRangeField,
  TypeFilteredSelectField,
  TypeTableFiltersFormValues,
} from './types';

interface IProps {
  children?: ReactNode;
  hasExportCsv?: boolean;
  isModalFilter?: boolean;
  filteredInputFields: TypeFilteredInputField[];
  filteredSelectFields: TypeFilteredSelectField[];
  filteredDateFields: TypeFilteredDateField[];
  filteredDateWithTimeFields: TypeFilteredDateField[];
  filteredRangeFields: TypeFilteredRangeField[];
  filteredOneValueInputFields: TypeFilteredInputField[];
  selectData?: { [key: string]: string | number | boolean }[][];
  filtersValues: TypeFilterValues;
  loading: boolean;
  tableData?: Record<string, unknown>[];
  getFilteredData: any;
  // getFilteredData: () =>
  //   | Promise<ResponseStatuses>
  //   | void
  //   | (() => QueryActionCreatorResult<any>);
  setFiltersValues: React.Dispatch<React.SetStateAction<TypeFilterValues>>;
  removeSelectedItems?: () => void;
  getSelectFieldValueById?: (
    id: string[],
    fieldName: string | null,
  ) => string[];
  getInputTagRenderSearchData?: DebouncedFunc<
    (field: TypeQueryParams, wsCommandPrefix: string) => Promise<void>
  >;
  withLeftChildrenPosition?: boolean;
  isDateWithTimeFilterAlwaysActive?: boolean;
  defaultActiveFilterIds: string[];
  alwaysActiveFilterIds: string[];
}

const MAX_TAG_COUNT = 5;

function TableFilters(props: IProps): JSX.Element {
  const [filtersForm] = Form.useForm<TypeTableFiltersFormValues>();
  const navigate = useNavigate();
  const location = useLocation();
  const dropDownLinkRef = useRef(null);

  const urlSearchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  //states
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  //isSearchParamsChanged необходим для понимаю изменились ли filtersValues между нажатиями на кнопку "Поиск"
  //необходим для пресечения лишних отправок запроса getFilteredData
  const [isSearchParamsChanged, setIsSearchParamsChanged] = useState(false);

  // список значений для выпадающего меню выбора фильтров
  const allFilteredFieldsTitle = [
    ...props.filteredInputFields,
    ...props.filteredSelectFields,
    ...props.filteredDateFields,
    ...(props.filteredDateWithTimeFields &&
    // если фильтр по дате со временем всегда активен, то не помещаем его в выпадающее меню выбора фильтров
    !props.isDateWithTimeFilterAlwaysActive
      ? props.filteredDateWithTimeFields
      : []),
    ...props.filteredRangeFields,
    ...props.filteredOneValueInputFields,
  ]
    .filter((item) => !props.alwaysActiveFilterIds.includes(item.id))
    .map((item) => item.title);

  // проверка и отображение только фильтров, выделенных в выпадающем списке выбора фильтров
  const checkedFilteredInputFields = props.filteredInputFields?.filter(
    (filterItem) =>
      checkedList.includes(filterItem.title) ||
      props.alwaysActiveFilterIds.includes(filterItem.id),
  );

  const checkedFilteredSelectFields = props.filteredSelectFields?.filter(
    (filterItem) => checkedList.includes(filterItem.title),
  );

  const checkedFilteredDateFields = props.filteredDateFields?.filter(
    (filterItem) => checkedList.includes(filterItem.title),
  );
  // если фильтр по дате со временем всегда активен, не проверяем его наличие в checkedList, так как его там нет
  const checkedFilteredDateWithTimeFields =
    props.isDateWithTimeFilterAlwaysActive
      ? props.filteredDateWithTimeFields
      : props.filteredDateWithTimeFields?.filter((filterItem) =>
          checkedList.includes(filterItem.title),
        );

  const checkedFilteredRangeFields = props.filteredRangeFields.filter(
    (filterItem) => checkedList.includes(filterItem.title),
  );

  const checkedFilteredOneValueInputFields =
    props.filteredOneValueInputFields.filter((filterItem) =>
      checkedList.includes(filterItem.title),
    );

  const handleDropdownClick = (
    event: React.MouseEvent<HTMLSpanElement, MouseEvent> | undefined,
  ): void => {
    event?.preventDefault();
    setIsDropdownVisible((prevState) => !prevState);
  };

  const handleChangeCheckboxValue = (
    dropdownMenuFiltersTitles: CheckboxValueType[],
  ): void => {
    setCheckedList(dropdownMenuFiltersTitles);
  };

  const handleDeleteFilter = (
    deletedItem: string,
    deletedValue: string | string[],
  ): void => {
    if (isArray(deletedValue)) {
      // Удаление массива значений фильтра у DateRangePicker и Range фильтра
      urlSearchParams.delete(deletedValue[0]);
      urlSearchParams.delete(deletedValue[1]);
    } else {
      // Удаление значения фильтра у InputTagRender и SelectTagRender
      urlSearchParams.delete(deletedValue as string);
    }

    //remove selected payouts on OperationsPayouts page
    if (props.removeSelectedItems) {
      props.removeSelectedItems();
    }

    setCheckedList((prevState) =>
      prevState.filter((checkedItem) => checkedItem !== deletedItem),
    );

    // Отправляем запрос без параметров если был удален последний фильтр
    if (checkedList.length === 1) {
      navigate(location.pathname);
    }
  };

  useEffect(() => {
    setIsSearchParamsChanged(false);
  }, [props.filtersValues]);

  const handleSearch = async (): Promise<void> => {
    urlSearchParams.delete(PAGE_INDEX_TEXT);
    urlSearchParams.delete(PAGE_SIZE_TEXT);

    const newUrlSearchParams =
      location.pathname +
      '?' +
      getQueryString(urlSearchParams, props.filtersValues);

    //remove selected payouts on OperationsPayouts page
    if (props.removeSelectedItems) {
      props.removeSelectedItems();
    }

    navigate(newUrlSearchParams);

    setIsSearchParamsChanged(true);

    if (
      (isSearchParamsChanged ||
        (!location.search && !Object.keys(props.filtersValues).length)) &&
      props.getFilteredData
    ) {
      await props.getFilteredData();
    }
  };

  const clearAllFilters = (): void => {
    setCheckedList([]);
    navigate(location.pathname);
  };

  useEffect(() => {
    if (!props.isModalFilter) {
      const urlSearchData = {};

      for (const key of urlSearchParams.keys()) {
        urlSearchData[key] = urlSearchParams.getAll(key);
      }

      const paramsKeys = Object.keys(urlSearchData);

      const filteredDateFields = (props.filteredDateFields ?? [])
        .map((field) => ({
          fields: field.fields.map((item) => ({
            ...item,
            title: field.title,
          })),
        }))
        .map((item) => item.fields)
        .reduce((accum, current) => accum.concat(current), []);

      const filteredDateWithTimeFields = (
        props.filteredDateWithTimeFields ?? []
      )
        .map((field) => ({
          fields: field.fields.map((item) => ({
            ...item,
            title: field.title,
          })),
        }))
        .map((item) => item.fields)
        .reduce((accum, current) => accum.concat(current), []);

      const filteredRangeFields = props.filteredRangeFields
        .map((field) => ({
          fields: field.fields.map((item) => ({
            ...item,
            title: field.title,
          })),
        }))
        .map((item) => item.fields)
        .reduce((accum, current) => accum.concat(current), []);

      const allFilteredFields = [
        ...props.filteredInputFields,
        ...props.filteredSelectFields,
        ...filteredDateFields,
        ...filteredDateWithTimeFields,
        ...filteredRangeFields,
        ...props.filteredOneValueInputFields,
      ];

      const currentCheckedList = allFilteredFields
        .filter((item) => {
          return (
            paramsKeys.includes(item.id) ||
            props.defaultActiveFilterIds.includes(item.id)
          );
        })
        .map((item) => item.title);

      setCheckedList(currentCheckedList);
    }
    // eslint-disable-next-line
  }, [urlSearchParams]);

  useEffect(() => {
    if (props.isModalFilter) {
      navigate(location.pathname);
    }
  }, [navigate, location.pathname, props.isModalFilter]);

  const showFilterActionButtons =
    checkedList.length > 0 || props.alwaysActiveFilterIds.length > 0;

  return (
    <div className={styles['table-filters']}>
      <div
        className={classNames(styles['table-filters__header'], {
          [styles['table-filters__header-reverse']]:
            props.withLeftChildrenPosition,
        })}
      >
        <Dropdown
          overlay={
            <DropDownOverlay
              dropDownLinkRef={dropDownLinkRef}
              checkedList={checkedList}
              allFilteredFieldsTitle={allFilteredFieldsTitle}
              setIsDropdownVisible={setIsDropdownVisible}
              handleChangeCheckboxValue={handleChangeCheckboxValue}
            />
          }
          overlayStyle={{ minWidth: 200 }}
          overlayClassName={styles['overlay']}
          trigger={['click']}
          open={isDropdownVisible}
        >
          <div className={styles['table-filters__dropdown']}>
            <div
              className={styles['table-filters__dropdown-link']}
              ref={dropDownLinkRef}
              onClick={handleDropdownClick}
            >
              <span>Фильтры</span>

              <DownOutlined
                className={classNames(
                  styles['table-filters__dropdown-arrow-icon'],
                  {
                    [styles['table-filters__dropdown-arrow-icon_turned']]:
                      isDropdownVisible,
                  },
                )}
              />
            </div>

            {showFilterActionButtons && (
              <>
                <Button
                  size="large"
                  type={ButtonTypes.PRIMARY}
                  htmlType="button"
                  onClick={handleSearch}
                  loading={props.loading}
                  // icon={<SearchOutlined />}
                >
                  Применить
                </Button>

                <Button
                  size="large"
                  className={styles['clear-button']}
                  type={ButtonTypes.GHOST}
                  htmlType="button"
                  onClick={clearAllFilters}
                >
                  Сбросить
                </Button>
              </>
            )}
          </div>
        </Dropdown>

        {props.children}
      </div>

      <div
        className={classNames(styles['filters-form'], {
          [styles['filters-form_hide']]:
            !checkedList.length && props.alwaysActiveFilterIds.length === 0,
          [styles['filters-form_modal']]: props.isModalFilter,
        })}
      >
        <Form
          className={styles['filters-form__form-container']}
          layout="horizontal"
          form={filtersForm}
        >
          {checkedFilteredDateWithTimeFields.map((item) => (
            <div key={item.id} className={styles['filters-form__item']}>
              <div className={styles['filters-form__item-inner']}>
                <DateFilter
                  isModalFilter={props.isModalFilter}
                  urlSearchParams={urlSearchParams}
                  fieldTitle={item.title}
                  fieldNames={item.fields.map((field) => field.value)}
                  form={filtersForm}
                  setFiltersValues={props.setFiltersValues}
                  isDateWithTime={true}
                >
                  <DeleteFilterBtn
                    visible={!props.isDateWithTimeFilterAlwaysActive}
                    handleClick={() =>
                      handleDeleteFilter(item.title, [
                        item.fields[0].value,
                        item.fields[1].value,
                      ])
                    }
                  />
                </DateFilter>
              </div>
            </div>
          ))}

          {checkedFilteredInputFields.map((item) => (
            <div key={item.id} className={styles['filters-form__item']}>
              <div className={styles['filters-form__item-inner']}>
                <InputTagRender
                  form={filtersForm}
                  fieldValue={props.filtersValues[item.value]}
                  fieldName={item.value}
                  fieldTitle={item.title}
                  setFiltersValues={props.setFiltersValues}
                  isModalFilter={props.isModalFilter}
                  wsCommandPrefix={item?.wsCommandPrefix}
                  getInputTagRenderSearchData={
                    props.getInputTagRenderSearchData
                  }
                  urlSearchParams={urlSearchParams}
                  maxTagCount={MAX_TAG_COUNT}
                >
                  <DeleteFilterBtn
                    visible={true}
                    handleClick={() =>
                      handleDeleteFilter(item.title, item.value)
                    }
                  />
                </InputTagRender>
              </div>
            </div>
          ))}

          {checkedFilteredSelectFields.map((item, index) => (
            <div key={item.id} className={styles['filters-form__item']}>
              <div className={styles['filters-form__item-inner']}>
                <SelectTagRender
                  urlSearchParams={urlSearchParams}
                  getSelectFieldValueById={props.getSelectFieldValueById}
                  isModalFilter={props.isModalFilter}
                  fieldName={item.value}
                  fieldTitle={item.title}
                  tagRenderOptions={item.options}
                  form={filtersForm}
                  selectData={props.selectData ? props.selectData[index] : []}
                  setFiltersValues={props.setFiltersValues}
                  getConvertedChosenOption={item.getConvertedChosenOption}
                >
                  <DeleteFilterBtn
                    visible={true}
                    handleClick={() =>
                      handleDeleteFilter(item.title, item.value)
                    }
                  />
                </SelectTagRender>
              </div>
            </div>
          ))}

          {checkedFilteredOneValueInputFields.map((item) => (
            <div key={item.id} className={styles['filters-form__item']}>
              <div className={styles['filters-form__item-inner']}>
                <InputFilter
                  form={filtersForm}
                  fieldName={item.value}
                  fieldTitle={item.title}
                  setFiltersValues={props.setFiltersValues}
                  urlSearchParams={urlSearchParams}
                  isModalFilter={props.isModalFilter}
                >
                  <DeleteFilterBtn
                    visible={true}
                    handleClick={() =>
                      handleDeleteFilter(item.title, item.value)
                    }
                  />
                </InputFilter>
              </div>
            </div>
          ))}

          {checkedFilteredDateFields.map((item) => (
            <div key={item.id} className={styles['filters-form__item']}>
              <div className={styles['filters-form__item-inner']}>
                <DateFilter
                  isModalFilter={props.isModalFilter}
                  urlSearchParams={urlSearchParams}
                  fieldTitle={item.title}
                  fieldNames={item.fields.map((field) => field.value)}
                  form={filtersForm}
                  setFiltersValues={props.setFiltersValues}
                >
                  <DeleteFilterBtn
                    visible={true}
                    handleClick={() =>
                      handleDeleteFilter(item.title, [
                        item.fields[0].value,
                        item.fields[1].value,
                      ])
                    }
                  />
                </DateFilter>
              </div>
            </div>
          ))}

          {checkedFilteredRangeFields.map((item) => (
            <div key={item.id} className={styles['filters-form__item']}>
              <div className={styles['filters-form__item-inner']}>
                <RangeFilter
                  isModalFilter={props.isModalFilter}
                  urlSearchParams={urlSearchParams}
                  fieldTitle={item.title}
                  fieldNames={item.fields.map((field) => field.value)}
                  form={filtersForm}
                  setFiltersValues={props.setFiltersValues}
                >
                  <DeleteFilterBtn
                    visible={true}
                    handleClick={() =>
                      handleDeleteFilter(item.title, [
                        item.fields[0].value,
                        item.fields[1].value,
                      ])
                    }
                  />
                </RangeFilter>
              </div>
            </div>
          ))}
        </Form>
      </div>
    </div>
  );
}

export default TableFilters;
