import { Button, Form, Input, ModalProps, Select, Table } from 'antd';
import classNames from 'classnames';
import { ANT_TABLE_TEXT, EMPTY_VALUE } from 'common/constants';
import { isFormGetErrors, openNotification } from 'common/helpers';
import { ButtonTypes, NotificationTypes } from 'common/interfaces';
import MainModal from 'components/MainModal';
import { useFormTableItem } from 'hooks/useFormTable';
import { IProject } from 'pages/Projects/Projects.interfaces';
import React, { FC, PropsWithChildren, useEffect } from 'react';
import { projectsApi } from 'store/api/projects.api';
import { walletsApi } from 'store/api/wallets.api';

import {
  IEditWalletDto,
  IEditWalletFormValues,
  IWallet,
} from '../Wallets.interfaces';
import { getWalletProjectsTableColumns } from './EditWalletModal.helpers';
import styles from './EditWalletModal.module.scss';

import formStyles from 'styles/common/form.module.scss';

interface IMainModal extends ModalProps {
  handleCancel: () => void;
  activeWallet: IWallet;
  handleSuccessfulAction: () => void;
}

const EditWalletModal: FC<IMainModal & PropsWithChildren> = ({
  handleCancel,
  activeWallet,
  handleSuccessfulAction,
  ...restProps
}) => {
  const [form] = Form.useForm<IEditWalletFormValues>();

  const { data: projects, isLoading: isProjectsLoading } =
    projectsApi.useGetProjectsQuery('');

  const [updateWallet, { isLoading }] = walletsApi.useUpdateWalletMutation();

  const { getSelectOptions, selectItemHandler, handleDeleteItem } =
    useFormTableItem<IProject>(form, 'projects');

  const handleModalCancel = (): void => {
    handleCancel();
    form.resetFields();
  };

  const handleSubmitForm = (values: IEditWalletFormValues): void => {
    const data: IEditWalletDto = {
      id: activeWallet.id,
      address: activeWallet.address,
      blockChain: activeWallet.blockChain,
      name: values.name,
      projects: values.projects,
    };

    updateWallet(data)
      .unwrap()
      .then((res) => {
        openNotification(NotificationTypes.SUCCESS, 'Кошелек успешно изменен');

        handleSuccessfulAction();
      })
      .catch((err) => {
        openNotification(
          NotificationTypes.ERROR,
          'Не удалось изменить кошелек',
        );
      });
  };

  useEffect(() => {
    if (activeWallet) {
      const newFormValues: IEditWalletFormValues = {
        name: activeWallet.name,
        projects: activeWallet.projects ?? [],
      };
      form.setFieldsValue(newFormValues);
    }
  }, [activeWallet, form]);

  return (
    <MainModal
      width={900}
      modalTitle="Редактирование кошелька"
      handleCancel={handleModalCancel}
      isLoading={isLoading}
      {...restProps}
    >
      <Form
        layout="vertical"
        form={form}
        onFinish={handleSubmitForm}
        autoComplete="off"
      >
        <div className={formStyles['form-body']}>
          <div className={styles['info-item']}>
            Address: <span>{activeWallet?.address ?? EMPTY_VALUE}</span>
          </div>

          <div className={styles['info-item']}>
            Сеть: <span>{activeWallet?.blockChain ?? EMPTY_VALUE}</span>
          </div>

          <div className={formStyles['form-items-group']}>
            <Form.Item
              label="Наименование"
              className={classNames(
                formStyles['form-item'],
                formStyles['create'],
              )}
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Укажите название',
                },
              ]}
            >
              <Input placeholder="Введите наименование кошелька" />
            </Form.Item>
          </div>

          <Form.Item name="projects" hidden>
            <Input />
          </Form.Item>

          <div className={formStyles['form-items-group']}>
            <Form.Item
              label="Список проектов"
              className={classNames(
                formStyles['form-item'],
                formStyles['create'],
              )}
              rules={[
                {
                  required: true,
                  message: 'Выберите проект',
                },
              ]}
              shouldUpdate={true}
            >
              {() => {
                const selectedProjects: IProject[] | undefined =
                  form.getFieldValue('projects');

                return (
                  <Select
                    value={null}
                    placeholder="Выберите проект"
                    options={getSelectOptions(projects, selectedProjects)}
                    onChange={(value) => selectItemHandler(projects, value)}
                  />
                );
              }}
            </Form.Item>
          </div>

          <Form.Item className={formStyles['form-item']} shouldUpdate={true}>
            {() => {
              const projects: IProject[] | undefined =
                form.getFieldValue('projects');

              return (
                <Table
                  className={styles['table']}
                  rowKey={'id'}
                  columns={getWalletProjectsTableColumns(handleDeleteItem)}
                  dataSource={projects}
                  scroll={{ y: 400 }}
                  pagination={false}
                  loading={isProjectsLoading}
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

export default EditWalletModal;
