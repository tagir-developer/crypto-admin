import { FormInstance, notification } from 'antd';
import moment, { Moment } from 'moment';

import {
  DEFAULT_TIME_FORMAT,
  NOTIFICATION_DEFAULT_DURATION_IN_SECONDS,
  QUERY_PARAMS_TIMEZONE_OFFSET,
} from './constants';
import { BlockChains, ISelectOption, NotificationTypes } from './interfaces';

export function disabledDate(current: Moment, before = true): boolean {
  // Can`t select days before today
  if (before) {
    return current && current < moment().subtract('1', 'day').endOf('day');
  } else {
    return current && current > moment().endOf('day');
  }
}

const close = (): void => {
  // eslint-disable-next-line no-console
  console.log(
    'Notification was closed. Either the close button was clicked or duration time elapsed.',
  );
};

export const openNotification = (
  type: NotificationTypes,
  message: string,
  durationInSeconds?: number,
): void => {
  const key = `open${Date.now()}`;

  notification[type]({
    message: message,
    key,
    onClose: close,
    duration: durationInSeconds ?? NOTIFICATION_DEFAULT_DURATION_IN_SECONDS,
  });
};

export const formatCurrency = (
  value: number | string,
  symbol = '₽',
): string => {
  const digitToBeSeparatedRegexp = /(\d)(?=(\d{3})+([^\d]|$))/g;

  return (
    String(Number(value).toFixed(2)).replace(digitToBeSeparatedRegexp, '$1 ') +
    ` ${symbol}`
  );
};

export const formatDate = (date: string): string => {
  return moment(date).format(DEFAULT_TIME_FORMAT);
};

export const getDateParamFromMoment = (time: Moment): string => {
  // смещаем время в query параметрах относительно utc
  return moment(time).add(QUERY_PARAMS_TIMEZONE_OFFSET, 'hours').toISOString();
};

export const getMomentFromDateParam = (dateTimeQueryParam: string): Moment => {
  return moment(dateTimeQueryParam).subtract(
    QUERY_PARAMS_TIMEZONE_OFFSET,
    'hours',
  );
};

export const isFormGetErrors = (form: FormInstance): boolean => {
  return form.getFieldsError().filter(({ errors }) => errors.length).length > 0;
};

export const getBlockChainNumberByName = (value: BlockChains): number => {
  switch (value) {
    case BlockChains.TRON:
      return 1;
    case BlockChains.ETHERIUM:
      return 2;
    case BlockChains.BITCOIN:
      return 3;
    case BlockChains.GARANTEX:
      return 4;
    case BlockChains.BNB:
      return 5;
    default:
      return 1;
  }
};

export const convertSelectBlockChains = (
  blockChains: BlockChains[],
): ISelectOption[] => {
  return blockChains?.map((item) => ({
    value: getBlockChainNumberByName(item),
    label: item,
  }));
};
