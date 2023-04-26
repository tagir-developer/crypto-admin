import { IBreadCrumbItem } from 'common/interfaces';
import { FC, PropsWithChildren } from 'react';

import Header from './Header';
import styles from './MainLayout.module.scss';
import Sidebar from './sidebar';

interface IProps {
  title: string;
  breadCrumbs?: IBreadCrumbItem[];
}

const MainLayout: FC<PropsWithChildren<IProps>> = ({
  title,
  breadCrumbs,
  children,
}) => {
  return (
    <main className={styles.main}>
      <section className={styles.content}>
        <Sidebar />

        <Header />

        <div className={styles.wrapper}>
          <h1 className={styles.title}>{title}</h1>

          {children}
        </div>
      </section>
    </main>
  );
};

export default MainLayout;
