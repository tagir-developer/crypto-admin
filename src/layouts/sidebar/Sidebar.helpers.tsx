import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { ReactComponent as ProjectsIcon } from 'images/sidebar/ProjectsIcon.svg';
import { ReactComponent as WalletIcon } from 'images/sidebar/WalletIcon.svg';
import { Pages, paths } from 'routes/constants';

export const getMenuItems = (
  handleLinkClick: (link: string) => void,
): ItemType[] => [
  {
    key: paths[Pages.PROJECTS],
    label: 'Проекты',
    icon: <ProjectsIcon />,
    onClick: () => handleLinkClick(paths[Pages.PROJECTS]),
  },
  {
    key: paths[Pages.WALLETS],
    label: 'Кошелек',
    icon: <WalletIcon />,
    onClick: () => handleLinkClick(paths[Pages.WALLETS]),
  },
];

export const getDefaultSelectedKey = (pathname: string): string[] => {
  if (pathname.includes(paths[Pages.PROJECTS])) {
    return [paths[Pages.PROJECTS]];
  }

  if (pathname.includes(paths[Pages.WALLETS])) {
    return [paths[Pages.WALLETS]];
  }

  return [paths[Pages.PROJECTS]];
};
