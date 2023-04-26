import { AutoComplete, Form, FormInstance, Input, Tag } from 'antd';
import { deleteAllIcon } from 'assets/icons';
import classNames from 'classnames';
import { openNotification } from 'common/helpers';
import { NotificationTypes, TypeQueryParams } from 'common/interfaces';
import Icon from 'components/Icon';
import { TypeFilterValues } from 'hooks/hooks.interfaces';
import { DebouncedFunc } from 'lodash';
import moment from 'moment';
import { EventValue } from 'rc-picker/lib/interface';
import React, { ReactNode, useEffect } from 'react';
import { memo, useState } from 'react';
import { v4 } from 'uuid';

import { TypeTableFiltersFormValues } from '../types';
import styles from './InputTagRender.module.scss';

const DEFAULT_MAX_TAG_COUNT = 5;

interface IProps {
  className?: string;
  form: FormInstance<TypeTableFiltersFormValues>;
  fieldName: string;
  fieldTitle: string;
  fieldValue: string[] | EventValue<moment.Moment>;
  urlSearchParams: URLSearchParams;
  maxTagCount?: number;
  setFiltersValues: React.Dispatch<React.SetStateAction<TypeFilterValues>>;
  wsCommandPrefix?: string;
  /** Method intended for getting filter autocomplete values */
  getInputTagRenderSearchData?: DebouncedFunc<
    (field: TypeQueryParams, wsCommandPrefix: string) => Promise<void>
  >;
  isModalFilter?: boolean;
  children?: ReactNode;
}

function InputTagRender(props: IProps): JSX.Element {
  const [tagList, setTagList] = useState<string[]>([]);

  const handleTagClose = (deletedTag: string): void => {
    const allUrlSearchTags = props.urlSearchParams.getAll(props.fieldName);

    setTagList((prevState) =>
      prevState.filter((oldTag) => oldTag !== deletedTag),
    );

    if (allUrlSearchTags.length === 1) {
      props.urlSearchParams.delete(props.fieldName);
    }
  };

  const handleCheckTags = (tag?: string): void => {
    if (
      tag?.length &&
      tagList.length < (props.maxTagCount ?? DEFAULT_MAX_TAG_COUNT) &&
      !tagList.includes(tag)
    ) {
      setTagList((prevState) => {
        return [...prevState, tag];
      });
    } else if (tag?.length && tagList.includes(tag)) {
      openNotification(NotificationTypes.ERROR, `Тег ${tag} уже существует.`);
    }
  };

  const handleAddTag = (selectedTag?: string): void => {
    if (selectedTag) {
      handleCheckTags(selectedTag);
    } else {
      const newTag = props.form.getFieldValue(props.fieldName);

      handleCheckTags(newTag);
    }

    props.form.resetFields([props.fieldName]);
  };

  const handleClearAllTags = (): void => {
    props.urlSearchParams.delete(props.fieldName);

    props.setFiltersValues((prevState) => {
      delete prevState[props.fieldName];

      return {
        ...prevState,
      };
    });

    setTagList([]);
  };

  const handleFocusInput = (): void => {
    document.getElementById(props.fieldName)?.focus();
  };

  useEffect(() => {
    if (tagList.length) {
      props.setFiltersValues((prevState) => {
        if (props.fieldName === 'numbers' && tagList[0].includes('.')) {
          return {
            ...prevState,
            [props.fieldName]: tagList.map((item) => item.replace(/\./g, '')),
          };
        } else {
          return {
            ...prevState,
            [props.fieldName]: tagList,
          };
        }
      });
    } else {
      props.setFiltersValues((prevState) => {
        delete prevState[props.fieldName];

        return {
          ...prevState,
        };
      });
    }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagList]);

  //setup fields after component initializing
  useEffect(() => {
    if (!props.isModalFilter) {
      const allUrlSearchTags = props.urlSearchParams.getAll(props.fieldName);

      setTagList(allUrlSearchTags);
    }
  }, [props.fieldName, props.isModalFilter, props.urlSearchParams]);

  return (
    <div
      id="input-tag-render"
      className={classNames(
        props.className,
        styles['input-tag-render'],
        'filter-input-tag-render',
      )}
      onClick={handleFocusInput}
    >
      <label
        className={styles['input-tag-render__label']}
        htmlFor={props.fieldName}
      >
        {props.fieldTitle}
      </label>

      <div className={styles['input-tag-render__input-wrapper']}>
        <AutoComplete
          id="auto-complete"
          popupClassName={classNames(
            'input-tag-render-dropdown-menu',
            styles['input-tag-render__dropdown-menu'],
          )}
          open={false}
          onBlur={() => handleAddTag()}
          onSelect={(value) => handleAddTag(value)}
          dropdownMatchSelectWidth={330}
        >
          <div className={styles['input-tag-render__inner']}>
            {tagList.map((tag) => (
              <Tag
                key={v4()}
                className={'filter-tag'}
                closable
                onClose={() => handleTagClose(tag)}
              >
                {tag}
              </Tag>
            ))}

            {tagList.length < (props.maxTagCount ?? DEFAULT_MAX_TAG_COUNT) ? (
              <Form.Item
                className={styles['input-tag-render__form-item']}
                name={props.fieldName}
              >
                <Input
                  id={props.fieldName}
                  className={styles['input-tag-render__input']}
                  placeholder="+ тег"
                  autoComplete="off"
                  onPressEnter={() => handleAddTag()}
                />
              </Form.Item>
            ) : null}

            <Icon
              className={classNames(
                styles['input-tag-render__delete-all-icon'],
                {
                  [styles['input-tag-render__delete-all-icon_hide']]:
                    !moment.isMoment(props.fieldValue) &&
                    !props.fieldValue?.length,
                },
              )}
              path={deleteAllIcon.path}
              viewBox={deleteAllIcon.viewBox}
              onClick={handleClearAllTags}
            />
          </div>
        </AutoComplete>

        {props.children}
      </div>
    </div>
  );
}

export default memo(InputTagRender);
