import { Button, Table } from 'antd';
import {
  ANT_TABLE_TEXT,
  DEFAULT_TABLE_ROWS_COUNT,
  TABLE_ROWS_HEIGHT,
} from 'common/constants';
import { ButtonTypes } from 'common/interfaces';
import MainLayout from 'layouts/MainLayout';
import React, { FC, useState } from 'react';
import { projectsApi } from 'store/api/projects.api';

import AddProjectModal from './AddProjectModal/AddProjectModal';
import DeleteProjectModal from './DeleteProjectModal/DeleteProjectModal';
import EditProjectModal from './EditProjectModal/EditProjectModal';
import {
  getConvertedProjectsItems,
  getProjectsTableColumns,
} from './Projects.helpers';
import { IProject } from './Projects.interfaces';
import styles from './Projects.module.scss';

const Projects: FC = () => {
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<IProject | null>(null);

  const [isDeleteProjectModalOpen, setIsDeleteProjectModalOpen] =
    useState(false);

  const { data: projectsData, isFetching: projectsLoading } =
    projectsApi.useGetProjectsQuery('', {
      refetchOnMountOrArgChange: true,
    });

  const projects = projectsData ? getConvertedProjectsItems(projectsData) : [];

  const handleClickEditProjectButton = (project: IProject): void => {
    setActiveProject(project);
    setIsEditProjectModalOpen(true);
  };

  const handleClickAddProjectButton = (): void => {
    setIsAddProjectModalOpen(true);
  };

  const handleAddProjectCancel = (): void => {
    setIsAddProjectModalOpen(false);
  };

  const handleEditProjectCancel = (): void => {
    setIsEditProjectModalOpen(false);
    setActiveProject(null);
  };

  const handleCancelDeleteProject = (): void => {
    setIsDeleteProjectModalOpen(false);
  };

  const handleSuccessfulAction = (): void => {
    setIsDeleteProjectModalOpen(false);
    setIsEditProjectModalOpen(false);
    setIsAddProjectModalOpen(false);
    setActiveProject(null);
  };

  const tableColumns = getProjectsTableColumns(handleClickEditProjectButton);

  const tableScrollConfig =
    projects.length > DEFAULT_TABLE_ROWS_COUNT
      ? { y: DEFAULT_TABLE_ROWS_COUNT * TABLE_ROWS_HEIGHT }
      : undefined;

  return (
    <MainLayout title="Проекты">
      <div className={styles.wrapper}>
        <div className={styles['buttons-container']}>
          <Button
            className={styles['create-button']}
            size="large"
            type={ButtonTypes.PRIMARY}
            htmlType="button"
            onClick={handleClickAddProjectButton}
          >
            Создать проект
          </Button>
        </div>

        <Table
          rowKey={'id'}
          className={styles.table}
          columns={tableColumns}
          dataSource={projects}
          loading={projectsLoading}
          locale={ANT_TABLE_TEXT}
          scroll={tableScrollConfig}
          pagination={false}
        />
      </div>

      <AddProjectModal
        open={isAddProjectModalOpen}
        handleCancel={handleAddProjectCancel}
        handleSuccessfulAction={handleSuccessfulAction}
      />

      <EditProjectModal
        open={!!activeProject && isEditProjectModalOpen}
        handleCancel={handleEditProjectCancel}
        activeProject={activeProject as IProject}
        setIsDeleteProjectModalOpen={setIsDeleteProjectModalOpen}
        handleSuccessfulAction={handleSuccessfulAction}
      />

      <DeleteProjectModal
        open={!!activeProject && isDeleteProjectModalOpen}
        activeProject={activeProject as IProject}
        handleCancel={handleCancelDeleteProject}
        handleSuccessfulAction={handleSuccessfulAction}
      />
    </MainLayout>
  );
};

export default Projects;
