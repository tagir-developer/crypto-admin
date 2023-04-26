import { CloseOutlined } from '@ant-design/icons';
import { memo } from 'react';

import styles from 'components/TableFilters/TableFilters.module.scss';

interface IProps {
  visible?: boolean;
  handleClick: () => void;
}

function DeleteFilterBtn(props: IProps): JSX.Element {
  return (
    <>
      {props.visible ? (
        <button
          className={styles['filters-form__delete-button']}
          onClick={props.handleClick}
        >
          <CloseOutlined
            className={styles['filters-form__delete-filter-icon']}
          />
        </button>
      ) : (
        <div className={styles['filters-form__empty']}></div>
      )}
    </>
  );
}

export default memo(DeleteFilterBtn);
