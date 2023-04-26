import { FC, memo } from 'react';

import styles from './AccountInfo.module.scss';

const AccountInfo: FC = () => {
  return (
    <div className={styles['account-info']}>
      <div className={styles['user-name']}>Olivia Rhye</div>

      <div className={styles['user-email']}>olivia@untitledui.com</div>
    </div>
  );
};

export default memo(AccountInfo);
