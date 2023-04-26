import { Form, FormInstance, Input } from 'antd';
import { TypeFilterValues } from 'hooks/hooks.interfaces';
import { ReactNode, memo, useEffect } from 'react';

import { TypeTableFiltersFormValues } from '../types';
import styles from './InputFilter.module.scss';

interface IProps {
  form: FormInstance<TypeTableFiltersFormValues>;
  fieldName: string;
  fieldTitle: string;
  setFiltersValues: React.Dispatch<React.SetStateAction<TypeFilterValues>>;
  urlSearchParams: URLSearchParams;
  isModalFilter?: boolean;
  children?: ReactNode;
}

function InputFilter({
  form,
  fieldName,
  fieldTitle,
  setFiltersValues,
  urlSearchParams,
  isModalFilter,
  children,
}: IProps): JSX.Element {
  const handleOnChange = (value: string): void => {
    if (value) {
      setFiltersValues((prevState) => {
        return {
          ...prevState,
          [fieldName]: [value],
        };
      });
    } else {
      setFiltersValues((prevState) => {
        delete prevState[fieldName];
        return {
          ...prevState,
        };
      });

      urlSearchParams.delete(fieldName);
    }

    form.setFieldsValue({ [fieldName]: [value] });
  };

  useEffect(() => {
    if (!isModalFilter) {
      const urlSearchValue = urlSearchParams.getAll(fieldName);

      if (urlSearchValue.length) {
        form.setFieldsValue({
          [fieldName]: [urlSearchValue[0]],
        });

        setFiltersValues((prevState) => ({
          ...prevState,
          [fieldName]: [urlSearchValue[0]],
        }));
      }
    }

    return () => {
      form.setFieldsValue({
        [fieldName]: null,
      });
      setFiltersValues((prevState) => {
        delete prevState[fieldName];

        return {
          ...prevState,
        };
      });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['input-filter']}>
      <label className={styles['input-filter__label']} htmlFor={fieldName}>
        {fieldTitle}
      </label>

      <div className={styles['input-filter__inner']}>
        <Form.Item
          name={fieldName}
          className={styles['input-filter__form-item']}
          validateTrigger={['onChange']}
        >
          <Input
            className={styles['input-filter__input']}
            onChange={(e) => handleOnChange(e.target.value)}
            allowClear={true}
          />
        </Form.Item>

        {children}
      </div>
    </div>
  );
}

export default memo(InputFilter);
