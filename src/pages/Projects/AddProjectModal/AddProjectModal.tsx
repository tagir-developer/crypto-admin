import { Button, Form, Input, ModalProps, Select, Table } from 'antd';
import classNames from 'classnames';
import { ANT_TABLE_TEXT, MODAL_TABLE_ROWS_HEIGHT } from 'common/constants';
import { isFormGetErrors, openNotification } from 'common/helpers';
import { ButtonTypes, NotificationTypes } from 'common/interfaces';
import MainModal from 'components/MainModal';
import { useFormTableItem } from 'hooks/useFormTable';
import { IWallet } from 'pages/Wallets/Wallets.interfaces';
import React, { FC, PropsWithChildren } from 'react';
import validationService from 'services/validation/validation.service';
import { projectsApi } from 'store/api/projects.api';
import { walletsApi } from 'store/api/wallets.api';

import {
  IAddProjectFormValues,
  ICreateProjectDto,
  IUpdateProjectFormValues,
} from '../Projects.interfaces';
import { getProjectWalletsTableColumns } from './AddProjectModal.helpers';
import styles from './AddProjectModal.module.scss';

import formStyles from 'styles/common/form.module.scss';

interface IMainModal extends ModalProps {
  handleCancel: () => void;
  handleSuccessfulAction: () => void;
}

const AddProjectModal: FC<IMainModal & PropsWithChildren> = ({
  handleCancel,
  handleSuccessfulAction,
  ...restProps
}) => {
  const [form] = Form.useForm<IUpdateProjectFormValues>();

  const { data: wallets, isLoading: isWalletsLoading } =
    walletsApi.useGetWalletsQuery('');

  const [createProject, { isLoading }] = projectsApi.useCreateProjectMutation();

  const { getSelectOptions, selectItemHandler, handleDeleteItem } =
    useFormTableItem<IWallet>(form, 'wallets');

  const handleModalCancel = (): void => {
    form.resetFields();
    handleCancel();
  };

  const handleSubmitForm = (values: IAddProjectFormValues): void => {
    const data: ICreateProjectDto = {
      name: values.name,
      walletIds: values.wallets.map((wallet) => wallet.id),
    };

    createProject(data)
      .unwrap()
      .then((res) => {
        openNotification(NotificationTypes.SUCCESS, 'Проект успешно создан');

        form.resetFields();
        handleSuccessfulAction();
      })
      .catch((err) => {
        openNotification(NotificationTypes.ERROR, 'Не удалось создать проект');
      });
  };

  const initialFormValues: IAddProjectFormValues = {
    name: '',
    wallets: [],
  };

  return (
    <MainModal
      width={900}
      modalTitle="Создание проекта"
      handleCancel={handleModalCancel}
      isLoading={isLoading}
      {...restProps}
    >
      <Form
        className={formStyles['form']}
        layout="vertical"
        form={form}
        initialValues={initialFormValues}
        onFinish={handleSubmitForm}
        autoComplete="off"
      >
        <div className={formStyles['form-body']}>
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
                  scroll={{ y: MODAL_TABLE_ROWS_HEIGHT * 5 }}
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
            onClick={handleModalCancel}
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

export default AddProjectModal;
