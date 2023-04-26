import { LeftOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { IBreadCrumbItem } from 'common/interfaces';
import React, { FC, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pages, paths } from 'routes/constants';

import styles from './BreadCrumbs.module.scss';

interface IProps {
  breadCrumbs: IBreadCrumbItem[];
}

const BreadCrumbs: FC<IProps> = ({ breadCrumbs }) => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <LeftOutlined onClick={() => navigate(paths[Pages.PROJECTS])} />

      <Breadcrumb className={styles.breadcrumbs} separator=">">
        {breadCrumbs.map((item, index) => {
          if (item.page) {
            const path = paths[item.page];
            return (
              <Breadcrumb.Item
                key={index}
                className={styles['previous-page']}
                onClick={() => navigate(path)}
              >
                {item.name}
              </Breadcrumb.Item>
            );
          }

          return <Breadcrumb.Item key={index}>{item.name}</Breadcrumb.Item>;
        })}
      </Breadcrumb>
    </div>
  );
};

export default memo(BreadCrumbs);
