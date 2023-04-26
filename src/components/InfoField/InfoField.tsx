import classNames from 'classnames';
import { memo } from 'react';

import styles from './InfoField.module.scss';

interface IProps {
  className?: string;
  name?: string;
  value?: string | number;
}

function InfoField({ className, name, value }: IProps): JSX.Element {
  return (
    <div className={classNames(styles['info-field'], styles[className ?? ''])}>
      <label>{name}</label>

      <span>{value}</span>
    </div>
  );
}

export default memo(InfoField);
