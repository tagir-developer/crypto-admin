import { DatePicker, Form, FormInstance } from 'antd';
import { DEFAULT_TIME_FORMAT, SHORT_TIME_FORMAT } from 'common/constants';
import { disabledDate, getMomentFromDateParam } from 'common/helpers';
import { TypeFilterValues } from 'hooks/hooks.interfaces';
import moment from 'moment';
import { RangeValue } from 'rc-picker/lib/interface';
import { ReactNode, useEffect } from 'react';

import { TypeTableFiltersFormValues } from '../types';
import styles from './DateFilter.module.scss';

interface IProps {
  form: FormInstance<TypeTableFiltersFormValues>;
  fieldNames: string[];
  fieldTitle: string;
  urlSearchParams: URLSearchParams;
  setFiltersValues: React.Dispatch<React.SetStateAction<TypeFilterValues>>;
  isModalFilter?: boolean;
  children?: ReactNode;
  isDateWithTime?: boolean;
}

const { RangePicker } = DatePicker;

function DateFilter({
  form,
  fieldNames,
  fieldTitle,
  urlSearchParams,
  setFiltersValues,
  isModalFilter,
  children,
  isDateWithTime,
}: IProps): JSX.Element {
  const handleRangePickerChange = (
    selectValue: RangeValue<moment.Moment>,
  ): void => {
    if (selectValue) {
      let startDateMoment = selectValue[0];
      let endDateMoment = selectValue[1];

      if (!isDateWithTime) {
        // для обычного фильтра по дате устанавливаем в query параметрах время равным 00:00:00,
        // чтобы сервер понимал когда надо фильтровать по времени, а когда только по дате
        startDateMoment = selectValue[0]?.utc(true).startOf('day') ?? null;
        endDateMoment = selectValue[1]?.utc(true).startOf('day') ?? null;
      }

      setFiltersValues((prevState) => ({
        ...prevState,
        //set first rangepicker field value
        [fieldNames[0]]: startDateMoment,
        //set second rangepicker field value
        [fieldNames[1]]: endDateMoment,
      }));
    } else {
      urlSearchParams.delete(fieldNames[0]);
      urlSearchParams.delete(fieldNames[1]);

      setFiltersValues((prevState) => {
        delete prevState[fieldNames[0]];
        delete prevState[fieldNames[1]];

        return {
          ...prevState,
        };
      });
    }
  };

  useEffect(() => {
    if (!isModalFilter) {
      const urlSearchDate1 = urlSearchParams.getAll(fieldNames[0]);
      const urlSearchDate2 = urlSearchParams.getAll(fieldNames[1]);

      if (urlSearchDate1.length && urlSearchDate2.length) {
        const formattedDate1 = urlSearchDate1[0];
        const formattedDate2 = urlSearchDate2[0];

        form.setFieldsValue({
          [fieldNames[0]]: [
            // для DateTimePicker переводим время в локальный формат из формата ISO 8601 (по utc)
            getMomentFromDateParam(formattedDate1),
            getMomentFromDateParam(formattedDate2),
          ],
        });

        setFiltersValues((prevState) => ({
          ...prevState,
          [fieldNames[0]]: urlSearchDate1,
          [fieldNames[1]]: urlSearchDate2,
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
  }, [urlSearchParams]);

  return (
    <div className={styles['date-filter']}>
      <label className={styles['date-filter__label']} htmlFor={fieldNames[0]}>
        {fieldTitle}
      </label>

      <div className={styles['date-filter__inner']}>
        <Form.Item
          name={fieldNames[0]}
          className={styles['date-filter__form-item']}
          validateTrigger={['onChange']}
        >
          <RangePicker
            showTime={isDateWithTime}
            className={styles['date-filter__date-picker']}
            format={isDateWithTime ? DEFAULT_TIME_FORMAT : SHORT_TIME_FORMAT}
            onChange={(selectValue) => handleRangePickerChange(selectValue)}
            disabledDate={(currentDate) => disabledDate(currentDate, false)}
            placeholder={['Дата начала', 'Дата окончания']}
          />
        </Form.Item>

        {children}
      </div>
    </div>
  );
}

export default DateFilter;
