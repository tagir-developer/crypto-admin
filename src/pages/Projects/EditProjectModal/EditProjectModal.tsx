import { DeleteOutlined } from '@ant-design/icons';
import { Button, Form, Input, ModalProps, Select, Table } from 'antd';
import classNames from 'classnames';
import { ANT_TABLE_TEXT, EMPTY_VALUE } from 'common/constants';
import { isFormGetErrors, openNotification } from 'common/helpers';
import { ButtonTypes, NotificationTypes } from 'common/interfaces';
import MainModal from 'components/MainModal';
import { useFormTableItem } from 'hooks/useFormTable';
import { IWallet } from 'pages/Wallets/Wallets.interfaces';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import validationService from 'services/validation/validation.service';
import { projectsApi } from 'store/api/projects.api';
import { walletsApi } from 'store/api/wallets.api';

import {
  IProject,
  IUpdateProjectDto,
  IUpdateProjectFormValues,
} from '../Projects.interfaces';
import { getProjectWalletsTableColumns } from './EditProjectModal.helpers';
import styles from './EditProjectModal.module.scss';

import formStyles from 'styles/common/form.module.scss';

interface IMainModal extends ModalProps {
  activeProject: IProject;
  handleCancel: () => void;
  setIsDeleteProjectModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSuccessfulAction: () => void;
}

const EditProjectModal: FC<IMainModal & PropsWithChildren> = ({
  activeProject,
  handleCancel,
  setIsDeleteProjectModalOpen,
  handleSuccessfulAction,
  ...restProps
}) => {
  const [form] = Form.useForm<IUpdateProjectFormValues>();

  const { data: wallets, isLoading: isWalletsLoading } =
    walletsApi.useGetWalletsQuery('');

  const [updateProject, { isLoading }] = projectsApi.useUpdateProjectMutation();

  const { getSelectOptions, selectItemHandler, handleDeleteItem } =
    useFormTableItem<IWallet>(form, 'wallets');

  const handleSubmitForm = (values: IUpdateProjectFormValues): void => {
    const data: IUpdateProjectDto = {
      id: activeProject.id,
      name: values.name,
      wallets: values.wallets,
    };

    updateProject(data)
      .unwrap()
      .then((res) => {
        openNotification(NotificationTypes.SUCCESS, 'Проект успешно изменен');

        handleSuccessfulAction();
      })
      .catch((err) => {
        openNotification(NotificationTypes.ERROR, 'Не удалось изменить проект');
      });
  };

  const handleDeleteProject = (): void => {
    setIsDeleteProjectModalOpen(true);
  };

  const isDeleteProjectBtnDisabled = activeProject?.wallets
    ? activeProject.wallets.length > 0
    : false;

  useEffect(() => {
    if (activeProject) {
      const newFormValues: IUpdateProjectFormValues = {
        name: activeProject.name,
        wallets: activeProject.wallets ?? [],
      };
      form.setFieldsValue(newFormValues);
    }
  }, [activeProject, form]);

  return (
    <MainModal
      width={900}
      modalTitle="Редактирование проекта"
      isLoading={isLoading}
      withCloseBtn={false}
      headerButton={
        <Button
          size="large"
          type={ButtonTypes.PRIMARY}
          htmlType="button"
          onClick={handleDeleteProject}
          icon={<DeleteOutlined />}
          disabled={isDeleteProjectBtnDisabled}
        >
          Удалить проект
        </Button>
      }
      {...restProps}
    >
      <Form
        className={formStyles['form']}
        layout="vertical"
        form={form}
        onFinish={handleSubmitForm}
        autoComplete="off"
      >
        <div className={formStyles['form-body']}>
          <div className={styles['private-key']}>
            Private key: <span>{activeProject?.secretKey ?? EMPTY_VALUE}</span>
          </div>

          <div className={formStyles['form-items-group']}>
            <Form.Item
              label="Название проекта"
              className={classNames(
                formStyles['form-item'],
                formStyles['create'],
              )}
              name="name"
              rules={validationService.projectNameRule}
            >
              <Input placeholder="Введите название проекта" />
            </Form.Item>
          </div>

          <Form.Item name="wallets" hidden>
            <Input />
          </Form.Item>

          <div className={formStyles['form-items-group']}>
            <Form.Item
              label="Список кошельков"
              className={classNames(
                formStyles['form-item'],
                formStyles['create'],
              )}
              rules={[
                {
                  required: true,
                  message: 'Выберите кошелек',
                },
              ]}
              shouldUpdate={true}
            >
              {() => {
                const selectedWallets: IWallet[] | undefined =
                  form.getFieldValue('wallets');

                return (
                  <Select
                    value={null}
                    placeholder="Выберите кошелек"
                    options={getSelectOptions(wallets, selectedWallets)}
                    onChange={(value) => selectItemHandler(wallets, value)}
                  />
                );
              }}
            </Form.Item>
          </div>

          <Form.Item className={formStyles['form-item']} shouldUpdate={true}>
            {() => {
              const wallets: IWallet[] | undefined =
                form.getFieldValue('wallets');

              return (
                <Table
                  className={styles['table']}
                  rowKey={'id'}
                  columns={getProjectWalletsTableColumns(handleDeleteItem)}
                  dataSource={wallets}
                  scroll={{ y: 400 }}
                  pagination={false}
                  loading={isWalletsLoading}
                  locale={ANT_TABLE_TEXT}
                />
              );
            }}
          </Form.Item>
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
            Отменить
          </Button>

          <Form.Item className={formStyles['form-item']} shouldUpdate={true}>
            {() => (
              <Button
                loading={isLoading}
                size="large"
                key="submit"
                type={ButtonTypes.PRIMARY}
                htmlType="submit"
                disabled={isFormGetErrors(form)}
              >
                Сохранить
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </MainModal>
  );
};

export default EditProjectModal;
