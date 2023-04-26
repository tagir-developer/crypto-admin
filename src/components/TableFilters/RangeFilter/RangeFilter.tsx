import { Form, FormInstance, InputNumber } from 'antd';
import { TypeFilterValues } from 'hooks/hooks.interfaces';
import { ReactNode, useEffect } from 'react';

import { TypeTableFiltersFormValues } from '../types';
import styles from './RangeFilter.module.scss';

interface IProps {
  form: FormInstance<TypeTableFiltersFormValues>;
  fieldNames: string[];
  fieldTitle: string;
  urlSearchParams: URLSearchParams;
  setFiltersValues: React.Dispatch<React.SetStateAction<TypeFilterValues>>;
  isModalFilter?: boolean;
  children?: ReactNode;
}

function RangeFilter({
  form,
  fieldNames,
  fieldTitle,
  urlSearchParams,
  setFiltersValues,
  isModalFilter,
  children,
}: IProps): JSX.Element {
  const onMinInputChange = (value: number | null): void => {
    let newMinValue = value;
    const maxValue: number | undefined = form.getFieldValue(fieldNames[1]);

    if (newMinValue && maxValue && newMinValue >= maxValue) {
      newMinValue = maxValue;
    }

    if (newMinValue !== null) {
      setFiltersValues((prevState) => {
        return {
          ...prevState,
          [fieldNames[0]]: [String(newMinValue)],
        };
      });
    } else {
      setFiltersValues((prevState) => {
        delete prevState[fieldNames[0]];
        return {
          ...prevState,
        };
      });

      urlSearchParams.delete(fieldNames[0]);
    }

    form.setFieldsValue({ [fieldNames[0]]: newMinValue });
  };

  const onMaxInputChange = (value: number | null): void => {
    let newMaxValue = value;
    const minValue: number | undefined = form.getFieldValue(fieldNames[0]);

    if (newMaxValue && minValue && newMaxValue <= minValue) {
      newMaxValue = minValue;
    }

    if (newMaxValue !== null) {
      setFiltersValues((prevState) => {
        return {
          ...prevState,
          [fieldNames[1]]: [String(newMaxValue)],
        };
      });
    } else {
      setFiltersValues((prevState) => {
        delete prevState[fieldNames[1]];
        return {
          ...prevState,
        };
      });

      urlSearchParams.delete(fieldNames[1]);
    }

    form.setFieldsValue({ [fieldNames[1]]: newMaxValue });
  };

  useEffect(() => {
    if (!isModalFilter) {
      const urlSearchMinValue = urlSearchParams.getAll(fieldNames[0]);
      const urlSearchMaxValue = urlSearchParams.getAll(fieldNames[1]);

      if (urlSearchMinValue.length) {
        form.setFieldsValue({
          [fieldNames[0]]: Number(urlSearchMinValue[0]),
        });

        setFiltersValues((prevState) => ({
          ...prevState,
          [fieldNames[0]]: urlSearchMinValue,
        }));
      }

      if (urlSearchMaxValue.length) {
        form.setFieldsValue({
          [fieldNames[1]]: Number(urlSearchMaxValue[0]),
        });

        setFiltersValues((prevState) => ({
          ...prevState,
          [fieldNames[1]]: urlSearchMaxValue,
        }));
      }
    }

    return () => {
      form.setFieldsValue({
        [fieldNames[0]]: null,
        [fieldNames[1]]: null,
      });
      setFiltersValues((prevState) => {
        delete prevState[fieldNames[0]];
        delete prevState[fieldNames[1]];

        return {
          ...prevState,
        };
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles['range-filter']}>
      <label className={styles['range-filter__label']} htmlFor={fieldNames[0]}>
        {fieldTitle}
      </label>

      <div className={styles['range-filter__inner']}>
        <div className={styles['range-filter__input-group']}>
          <Form.Item
            name={fieldNames[0]}
            className={styles['range-filter__form-item']}
            validateTrigger={['onChange']}
          >
            <InputNumber
              className={styles['range-filter__input']}
              placeholder="От"
              onChange={onMinInputChange}
              min={0}
            />
          </Form.Item>

          <div className={styles['range-filter__input-divider']}>–</div>

          <Form.Item
            name={fieldNames[1]}
            className={styles['range-filter__form-item']}
            validateTrigger={['onChange']}
          >
            <InputNumber
              className={styles['range-filter__input']}
              placeholder="До"
              onChange={onMaxInputChange}
              min={0}
            />
          </Form.Item>
        </div>

        {children}
      </div>
    </div>
  );
}

export default RangeFilter;
