import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EMPTY_VALUE } from 'common/constants';
import { formatDate } from 'common/helpers';
import { ButtonTypes } from 'common/interfaces';

import { IWallet } from './Wallets.interfaces';
import styles from './Wallets.module.scss';

export const getConvertedWalletItems = (wallets: IWallet[]): IWallet[] => {
  return wallets.map((item, index) => {
    const convertedItem: IWallet = {
      ...item,
      createdAt: formatDate(item.createdAt),
    };

    return convertedItem;
  });
};

export const getWalletsTableColumns = (
  handleClickEditWalletButton: (wallet: IWallet) => void,
  handleDeleteWallet: (wallet: IWallet) => void,
): ColumnsType<IWallet> => [
  {
    title: '№',
    dataIndex: 'number',
    width: 50,
    render: (text, record, index) => <span>{index + 1}</span>,
  },

  {
    title: 'Дата создания',
    dataIndex: 'createdAt',
    sorter: (a, b): number => {
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      return 0;
    },
  },

  {
    title: 'Кошелек',
    dataIndex: 'name',
    sorter: (a, b): number => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    },
  },
  {
    title: 'Сеть',
    dataIndex: 'blockChain',
    sorter: (a, b): number => {
      if (a.blockChain < b.blockChain) {
        return -1;
      }
      if (a.blockChain > b.blockChain) {
        return 1;
      }
      return 0;
    },
  },
  {
    title: 'Баланс',
    dataIndex: 'lastName',
  },
  {
    title: 'Проекты',
    dataIndex: 'name',
    render: (text, record) => (
      <span>
        {record.projects && record.projects.length > 0
          ? record.projects.map((item) => item.name).join(', ')
          : EMPTY_VALUE}
      </span>
    ),
  },
  {
    title: '',
    dataIndex: 'name',
    render: (text, record) => (
      <div className={styles['table-btn-container']}>
        <Button
          size="middle"
          type={ButtonTypes.GHOST}
          htmlType="button"
          onClick={() => handleClickEditWalletButton(record)}
          icon={<EditOutlined />}
        >
          Редактировать
        </Button>
      </div>
    ),
  },

  {
    title: '',
    dataIndex: 'name',
    render: (text, record) => (
      <div className={styles['table-btn-container']}>
        <Button
          size="middle"
          type={ButtonTypes.GHOST}
          danger
          htmlType="button"
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteWallet(record)}
        >
          Удалить
        </Button>
      </div>
    ),
  },
];
