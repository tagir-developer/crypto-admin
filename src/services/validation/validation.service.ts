import { FormRule } from 'antd';
import { TypeUnknown } from 'common/interfaces';

class ValidationService {
  projectNameRule: FormRule[] = [
    {
      required: true,
      message: 'Введите название проекта',
    },
    // ({ getFieldValue }: TypeUnknown) => ({
    //   validator(_: TypeUnknown, value: string | null) {
    //     if (!value || getFieldValue('password') === value) {
    //       return Promise.resolve();
    //     }
    //     return Promise.reject(new Error('Пароли не совпадают'));
    //   },
    // }),
  ];

  emailValidationRule(): FormRule[] {
    return [
      {
        required: true,
        message: 'Введите Email',
      },
      {
        type: 'email',
        message: 'Неправильный Email',
      },
    ];
  }

  inviteCodeValidationRule(): FormRule[] {
    return [
      {
        required: true,
        message: 'Поле код приглашения обязательно к заполнению!',
      },
    ];
  }
}

export default new ValidationService();
