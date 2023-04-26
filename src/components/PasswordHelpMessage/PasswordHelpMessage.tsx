import React, { FC } from 'react';

import styles from './PasswordHelpMessage.module.scss';

const PasswordHelpMessage: FC = () => {
  return (
    <p className={styles['message']}>
      Пароль должен содержать не менее восьми знаков, включать буквы, цифры и
      специальные символы
    </p>
  );
};

export default PasswordHelpMessage;
