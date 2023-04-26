import { Button, ModalProps } from 'antd';
import { openNotification } from 'common/helpers';
import { ButtonTypes, NotificationTypes } from 'common/interfaces';
import MainModal from 'components/MainModal';
import { ReactComponent as DeleteWarningIcon } from 'images/DeleteWarningIcon.svg';
import React, { FC, PropsWithChildren } from 'react';
import { projectsApi } from 'store/api/projects.api';

import { IProject } from '../Projects.interfaces';
import styles from './DeleteProjectModal.module.scss';

interface IDeleteProjectModal extends ModalProps {
  activeProject: IProject;
  handleCancel: () => void;
  handleSuccessfulAction: () => void;
}

const DeleteProjectModal: FC<IDeleteProjectModal & PropsWithChildren> = ({
  activeProject,
  handleCancel,
  handleSuccessfulAction,
  ...restProps
}) => {
  const [deleteProjectById, { isLoading }] =
    projectsApi.useDeleteProjectMutation();

  const handleConfirmDeletion = (): void => {
    deleteProjectById(activeProject.id)
      .unwrap()
      .then((data) => {
        console.log('SUCCESS --- PROJECT DELETE DATA ---', data);

        openNotification(NotificationTypes.SUCCESS, 'Проект успешно удален');

        handleSuccessfulAction();
      })
      .catch((err) => {
        console.log('ERROR --- PROJECT DELETE DATA ---', err);

        openNotification(NotificationTypes.ERROR, 'Не удалось удалить проект');
      });
  };

  return (
    <MainModal
      width={500}
      className={styles.modal}
      withoutHeader={true}
      {...restProps}
    >
      <div className={styles.wrapper}>
        <div className={styles.icon}>
          <DeleteWarningIcon />
        </div>

        <h2 className={styles.title}>Удаление проекта</h2>

        <p className={styles.description}>
          Вы уверены, что хотите удалить проект?
        </p>

        <div className={styles['buttons-container']}>
          <div className={styles['buttons-group']}>
            <Button
              size="large"
              type={ButtonTypes.GHOST}
              htmlType="button"
              onClick={handleCancel}
              loading={isLoading}
            >
              Отмена
            </Button>

            <Button
              size="large"
              danger
              type={ButtonTypes.PRIMARY}
              htmlType="button"
              onClick={handleConfirmDeletion}
              loading={isLoading}
            >
              Удалить
            </Button>
          </div>
        </div>
      </div>
    </MainModal>
  );
};

export default DeleteProjectModal;
