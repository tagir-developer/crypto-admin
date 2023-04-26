import { Button, Form, Input, ModalProps, Select } from 'antd';
import classNames from 'classnames';
import { isFormGetErrors, openNotification } from 'common/helpers';
import { ButtonTypes, NotificationTypes } from 'common/interfaces';
import MainModal from 'components/MainModal';
import { useTypedSelector } from 'hooks/useTypedSelector';
import React, { FC, PropsWithChildren } from 'react';
import { walletsApi } from 'store/api/wallets.api';

import { IAddWalletFormValues, ICreateWalletDto } from '../Wallets.interfaces';

import formStyles from 'styles/common/form.module.scss';

interface IMainModal extends ModalProps {
  handleCancel: () => void;
  handleSuccessfulAction: () => void;
}

const CreateWalletModal: FC<IMainModal & PropsWithChildren> = ({
  handleCancel,
  handleSuccessfulAction,
  ...restProps
}) => {
  const [form] = Form.useForm();

  const { blockChainSelect } = useTypedSelector((state) => state.common);

  const [addWallet, { isLoading }] = walletsApi.useCreateWalletMutation();

  const handleModalCancel = (): void => {
    console.log('close wallet modal');
    form.resetFields();
    handleCancel();
  };

  const handleSubmitForm = (values: IAddWalletFormValues): void => {
    const data: ICreateWalletDto = {
      ...values,
      projectIds: [],
    };

    addWallet(data)
      .unwrap()
      .then((res) => {
        openNotification(NotificationTypes.SUCCESS, 'Кошелек успешно добавлен');

        form.resetFields();
        handleSuccessfulAction();
      })
      .catch((err) => {
        openNotification(
          NotificationTypes.ERROR,
          'Не удалось добавить кошелек',
        );
      });
  };

  return (
    <MainModal
      width={900}
      modalTitle="Создание кошелька"
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
        <Form.Item
          label="Наименование"
          name="name"
          rules={[
            {
              required: true,
              message: 'Выберите сеть',
            },
          ]}
        >
          <Input placeholder="Введите наименование" />
        </Form.Item>

        <Form.Item
          label="Private key"
          name="privateKey"
          rules={[
            {
              required: true,
              message: 'Выберите сеть',
            },
          ]}
        >
          <Input placeholder="Введите private key" />
        </Form.Item>

        <Form.Item
          label="Адрес"
          name="address"
          rules={[
            {
              required: true,
              message: 'Выберите сеть',
            },
          ]}
        >
          <Input placeholder="Введите адрес" />
        </Form.Item>

        <Form.Item
          label="Сеть"
          name="blockchain"
          rules={[
            {
              required: true,
              message: 'Выберите сеть',
            },
          ]}
        >
          <Select
            placeholder="Список сетей"
            defaultActiveFirstOption
            options={blockChainSelect}
          />
        </Form.Item>

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
                Создать
              </Button>
            )}
          </Form.Item>
        </div>
      </Form>
    </MainModal>
  );
};

export default CreateWalletModal;
