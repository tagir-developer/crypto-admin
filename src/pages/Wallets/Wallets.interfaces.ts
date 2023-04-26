import { BlockChains } from 'common/interfaces';
import { IProject } from 'pages/Projects/Projects.interfaces';

export interface IWallet {
  id: string;
  name: string;
  address: string;
  blockChain: BlockChains;
  projects: IProject[] | null;
  createdAt: string;
}

export interface IAddWalletFormValues {
  name: string;
  address: string;
  privateKey: string;
  blockChain: number;
}

export interface IEditWalletFormValues {
  name: string;
  projects: IProject[];
}

export interface ICreateWalletDto extends IAddWalletFormValues {
  projectIds: string[];
}

export interface IEditWalletDto {
  id: string;
  address: string;
  blockChain: BlockChains;
  name: string;
  projects: IProject[];
}
