import { Button, Modal } from 'antd';
import { ButtonTypes } from 'common/interfaces';
import { ResponseStatuses } from 'common/interfaces';
import React, { FC } from 'react';

import styles from './ModalConfirm.module.scss';

interface IProps {
  buttonSubmitText: string;
  buttonCancelText: string;
  open: boolean;
  confirmText: string;
  isLoading?: boolean;
  handleConfirm: () => Promise<ResponseStatuses> | void;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalConfirm = ({
  buttonSubmitText,
  buttonCancelText,
  open,
  confirmText,
  setIsVisible,
  isLoading,
  handleConfirm,
}: IProps): JSX.Element => {
  const handleCancel = (): void => {
    setIsVisible(false);
  };

  const modifiedHandleConfirm = async (): Promise<void> => {
    const res = await handleConfirm();

    if (res === ResponseStatuses.SUCCESS) {
      setIsVisible(false);
    }
  };

  return (
    <Modal
      width={370}
      open={open}
      destroyOnClose={true}
      closable={false}
      footer={null}
      centered={true}
    >
      <div className={styles['content']}>
        <p className={styles['confirm-text']}>{confirmText}</p>

        <div className={styles['buttons-group']}>
          <Button
            size="large"
            type={ButtonTypes.PRIMARY}
            htmlType="button"
            onClick={modifiedHandleConfirm}
            loading={isLoading}
          >
            {buttonSubmitText}
          </Button>

          <Button
            size="large"
            type={ButtonTypes.GHOST}
            htmlType="button"
            onClick={handleCancel}
          >
            {buttonCancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirm;
