import { IWallet } from 'pages/Wallets/Wallets.interfaces';

export interface IProject {
  id: string;
  name: string;
  secretKey: string;
  wallets: IWallet[] | null;
  createdAt: string;
}

export interface IAddProjectFormValues {
  name: string;
  wallets: IWallet[];
}

export interface IUpdateProjectFormValues {
  name: string;
  wallets: IWallet[];
}

export interface ICreateProjectDto {
  name: string;
  walletIds: string[];
}

export interface IUpdateProjectDto {
  id: string;
  name: string;
  wallets: IWallet[];
}
