import { Button, Form, Input } from 'antd';
import { AUTH_DATA_STORAGE_KEY } from 'common/constants';
import { isFormGetErrors, openNotification } from 'common/helpers';
import { ButtonTypes, NotificationTypes } from 'common/interfaces';
import { ILoginDto } from 'common/interfaces';
import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import validationService from 'services/validation/validation.service';
import { authApi } from 'store/api/auth.api';
import { setAuthLoading } from 'store/reducers/common.slice';

import styles from './Login.module.scss';

import formStyles from 'styles/common/form.module.scss';

const AuthPage: FC = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();

  const [login, { data: accountData, isError, isLoading }] =
    authApi.useLoginMutation();

  const handleSubmitForm = async (values: ILoginDto): Promise<void> => {
    login(values);
  };

  useEffect(() => {
    if (accountData) {
      localStorage.setItem(AUTH_DATA_STORAGE_KEY, JSON.stringify(accountData));

      dispatch(setAuthLoading(true));
    }
  }, [accountData, dispatch]);

  useEffect(() => {
    if (isError) {
      openNotification(NotificationTypes.ERROR, 'Ошибка авторизации');
    }
  }, [isError]);

  return (
    <div className={styles['layout-wrapper']}>
      <div className={styles['layout']}>
        <div className={styles['header']}>
          <h2>Вход в систему</h2>
        </div>

        <div className={styles['content']}>
          <Form
            className={formStyles['form']}
            layout="vertical"
            form={form}
            onFinish={handleSubmitForm}
            autoComplete="off"
          >
            <div className={styles['login-input']}>
              <Form.Item
                className={formStyles['form-item']}
                name="email"
                rules={validationService.emailValidationRule()}
              >
                <Input placeholder="Email" />
              </Form.Item>
            </div>

            <div className={styles['login-input']}>
              <Form.Item
                className={formStyles['form-item']}
                name="password"
                rules={[
                  {
                    required: true,
                    message: 'Поле Пароль обязательно к заполнению!',
                  },
                ]}
              >
                <Input.Password
                  placeholder="Пароль"
                  autoComplete="new-password"
                />
              </Form.Item>
            </div>

            <Form.Item shouldUpdate={true}>
              {() => (
                <Button
                  className={styles['button']}
                  size="large"
                  key="submit"
                  type={ButtonTypes.PRIMARY}
                  htmlType="submit"
                  disabled={isFormGetErrors(form)}
                  loading={isLoading}
                >
                  Войти
                </Button>
              )}
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
