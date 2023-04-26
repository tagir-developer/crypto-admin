import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ButtonTypes } from 'common/interfaces';
import { IWallet } from 'pages/Wallets/Wallets.interfaces';

import styles from './AddProjectModal.module.scss';

export const getProjectWalletsTableColumns = (
  handleDeleteWallet: (wallet: IWallet) => void,
): ColumnsType<IWallet> => [
  {
    title: '№',
    dataIndex: 'number',
    width: 50,
    render: (text, record, index) => <span>{index + 1}</span>,
  },

  {
    title: 'Наименование',
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
    title: 'ID',
    dataIndex: 'id',
  },
  {
    title: 'Баланс',
    dataIndex: 'lastName',
  },
  {
    title: '',
    dataIndex: 'name',
    render: (text, record) => (
      <div className={styles['delete-btn-container']}>
        <Button
          danger
          size="middle"
          type={ButtonTypes.GHOST}
          htmlType="button"
          onClick={() => handleDeleteWallet(record)}
          icon={<DeleteOutlined />}
        >
          Отвязать
        </Button>
      </div>
    ),
  },
];
