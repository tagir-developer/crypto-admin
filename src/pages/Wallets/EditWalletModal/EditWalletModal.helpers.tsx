import { DeleteOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { ButtonTypes } from 'common/interfaces';
import { IProject } from 'pages/Projects/Projects.interfaces';

import styles from './EditWalletModal.module.scss';

export const getWalletProjectsTableColumns = (
  handleDeleteProject: (project: IProject) => void,
): ColumnsType<IProject> => [
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
    title: '',
    dataIndex: 'name',
    width: 170,
    render: (text, record) => (
      <div className={styles['delete-btn-container']}>
        <Button
          danger
          size="middle"
          type={ButtonTypes.GHOST}
          htmlType="button"
          onClick={() => handleDeleteProject(record)}
          icon={<DeleteOutlined />}
        >
          Отвязать
        </Button>
      </div>
    ),
  },
];
