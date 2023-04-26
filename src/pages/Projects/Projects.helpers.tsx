import { EditOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { EMPTY_VALUE } from 'common/constants';
import { formatDate } from 'common/helpers';
import { ButtonTypes } from 'common/interfaces';

import { IProject } from './Projects.interfaces';
import styles from './Projects.module.scss';

export const getConvertedProjectsItems = (projects: IProject[]): IProject[] => {
  return projects.map((item, index) => {
    const convertedItem: IProject = {
      ...item,
      createdAt: formatDate(item.createdAt),
    };

    return convertedItem;
  });
};

export const getProjectsTableColumns = (
  handleClickEditProjectButton: (project: IProject) => void,
): ColumnsType<IProject> => [
  {
    title: '№',
    dataIndex: 'id',
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
    title: 'Название проекта',
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
    title: 'Кошельки',
    dataIndex: 'name',
    render: (text, record) => (
      <span>
        {record.wallets && record.wallets.length > 0
          ? record.wallets.map((item) => item.name).join(', ')
          : EMPTY_VALUE}
      </span>
    ),
  },
  {
    title: '',
    dataIndex: 'name',
    render: (text, record) => (
      <div className={styles['edit-btn-container']}>
        <Button
          size="middle"
          type={ButtonTypes.GHOST}
          htmlType="button"
          onClick={() => handleClickEditProjectButton(record)}
          icon={<EditOutlined />}
        >
          Редактировать
        </Button>
      </div>
    ),
  },
];
