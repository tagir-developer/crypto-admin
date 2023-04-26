import { Button, ModalProps } from 'antd';
import classNames from 'classnames';
import { openNotification } from 'common/helpers';
import { ButtonTypes, NotificationTypes } from 'common/interfaces';
import MainModal from 'components/MainModal';
import React, { FC, PropsWithChildren } from 'react';
import { walletsApi } from 'store/api/wallets.api';

import { IWallet } from '../Wallets.interfaces';
import styles from './DeleteWalletModal.module.scss';

import formStyles from 'styles/common/form.module.scss';

interface IMainModal extends ModalProps {
  handleCancel: () => void;
  activeWallet: IWallet;
}

const DeleteWalletModal: FC<IMainModal & PropsWithChildren> = ({
  handleCancel,
  activeWallet,
  ...restProps
}) => {
  const [deleteWallet, { isLoading }] = walletsApi.useDeleteWalletMutation();

  const handleConfirmDeletion = (): void => {
    deleteWallet(activeWallet.id)
      .unwrap()
      .then((res) => {
        console.log('SUCCESSFUL CREATE PROJECT RESPONSE', res);
        openNotification(NotificationTypes.SUCCESS, 'Кошелек успешно удален');

        handleCancel();
      })
      .catch((err) => {
        console.log('ERROR --- PROJECT DELETE DATA ---', err);
        openNotification(NotificationTypes.ERROR, 'Не удалось удалить кошелек');
      });
  };

  return (
    <MainModal
      modalTitle="Удаление кошелька"
      handleCancel={handleCancel}
      isLoading={isLoading}
      sizeMin
      {...restProps}
    >
      <div className={styles.message}>
        Вы действительно хотите удалить кошелек?
      </div>

      <div
        className={classNames(
          formStyles['submit-buttons-group'],
          formStyles['column'],
        )}
      >
        <Button
          size="large"
          type={ButtonTypes.GHOST}
          htmlType="button"
          onClick={handleCancel}
        >
          Отмена
        </Button>

        <Button
          loading={isLoading}
          type={ButtonTypes.PRIMARY}
          danger
          size="large"
          htmlType="button"
          onClick={handleConfirmDeletion}
        >
          Удалить
        </Button>
      </div>
    </MainModal>
  );
};

export default DeleteWalletModal;
