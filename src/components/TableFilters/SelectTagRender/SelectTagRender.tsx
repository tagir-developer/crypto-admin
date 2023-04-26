/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormInstance, Select, Tag } from 'antd';
import classNames from 'classnames';
import { TypeFilterValues } from 'hooks/hooks.interfaces';
// import { TypeFilterValues } from 'core/hooks/types';
// import {
//   TypeSelectTagRenderOption,
//   TypeTableFiltersFormValues,
// } from 'core/modules/TableFilters/types';
// import { CustomTagProps } from 'rc-select/lib/interface/generator';
import { ReactChild, useCallback, useEffect } from 'react';
import React, { MouseEvent, memo } from 'react';

import {
  TypeSelectTagRenderOption,
  TypeTableFiltersFormValues,
} from '../types';
import styles from './SelectTagRender.module.scss';
import { CustomTagProps } from './types';

type Props = {
  /** Additional class. */
  className?: string;
  /** Form instance of the Ant Design form. */
  form: FormInstance<TypeTableFiltersFormValues>;
  /** Form field name. */
  fieldName: string;
  /** Form field title. */
  fieldTitle: string;
  /** URL search string. */
  urlSearchParams: URLSearchParams;
  //** Converting id to specific value */
  getSelectFieldValueById?: (
    id: string[],
    fieldName: string | null,
  ) => string[];
  /** Tag render select options */
  tagRenderOptions: TypeSelectTagRenderOption[] | undefined;
  /** Method intended for setting filters values. */
  setFiltersValues: React.Dispatch<React.SetStateAction<TypeFilterValues>>;
  selectData?: {
    [key: string]: string | number | boolean;
  }[];
  /** Getter of the converted chosen options */
  getConvertedChosenOption:
    | ((chosenOption: string[]) => (number | string | null)[])
    | undefined;
  /** Tag modifies the appearance of inputs for modal windows */
  isModalFilter?: boolean;
  children?: ReactChild;
};

function SelectTagRender(props: Props): JSX.Element {
  const tagRender = (props: CustomTagProps): JSX.Element => {
    const { label, closable, onClose } = props;

    const onPreventMouseDown = (event: MouseEvent): void => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
      <Tag
        className={styles['select-tag-render__tag']}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
      >
        {label}
      </Tag>
    );
  };

  const handleSelectChange = useCallback(() => {
    const chosenOptions = props.form.getFieldValue(props.fieldName);

    const convertedChosenOptions =
      props.getConvertedChosenOption &&
      props
        .getConvertedChosenOption(chosenOptions)
        ?.map((item) => String(item));

    if (convertedChosenOptions) {
      props.setFiltersValues((prevState) => ({
        ...prevState,
        [props.fieldName]: convertedChosenOptions,
      }));
    }
  }, [props.fieldName, props.form, props.setFiltersValues]);

  useEffect(() => {
    return () => {
      props.form.setFieldsValue({
        [props.fieldName]: [],
      });

      props.setFiltersValues((prevState) => {
        delete prevState[props.fieldName];

        return {
          ...prevState,
        };
      });
    };
  }, [props.fieldName, props.form]);

  //invoke when component did mount
  const initializeSelectTagRender = (selectFieldName: string | null): void => {
    const allUrlSearchTags = props.urlSearchParams.getAll(props.fieldName);

    props.form.setFieldsValue({
      [props.fieldName]:
        props.getSelectFieldValueById &&
        props.getSelectFieldValueById(allUrlSearchTags, selectFieldName),
    });

    handleSelectChange();
  };

  // setup SelectTagRender fields after component initializing with loading items from server
  useEffect(() => {
    if (
      props.urlSearchParams &&
      !props.isModalFilter &&
      props.selectData?.length
    ) {
      initializeSelectTagRender(props.fieldName);
    }
  }, [
    handleSelectChange,
    props.fieldName,
    props.form,
    props.isModalFilter,
    props.urlSearchParams,
    props.selectData,
  ]);

  // setup SelectTagRender fields after component initializing with mocked items
  useEffect(() => {
    if (
      props.urlSearchParams &&
      !props.isModalFilter &&
      !props.selectData?.length
    ) {
      initializeSelectTagRender(null);
    }
  }, [
    handleSelectChange,
    props.fieldName,
    props.form,
    props.isModalFilter,
    props.urlSearchParams,
  ]);

  return (
    <div
      id="select-tag-render"
      className={classNames(props.className, styles['select-tag-render'])}
    >
      <label
        className={styles['select-tag-render__label']}
        htmlFor={props.fieldName}
      >
        {props.fieldTitle}
      </label>

      <div className={styles['select-tag-render__select-wrapper']}>
        <Form.Item
          className={styles['select-tag-render__form-item']}
          name={props.fieldName}
        >
          <Select
            className={styles['select-tag-render__select']}
            popupClassName="select-tag-render__select-dropdown"
            mode="multiple"
            showArrow
            options={props.tagRenderOptions}
            tagRender={tagRender}
            onChange={handleSelectChange}
          />
        </Form.Item>

        {props.children}
      </div>
    </div>
  );
}

export default memo(SelectTagRender);
