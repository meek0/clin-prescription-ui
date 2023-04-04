import { IQueryOperationsConfig, ISearchAfter } from '@ferlab/ui/core/graphql/types';
import { TSortDirection } from 'graphql/queries';

export type TPagingConfig = {
  index: number;
  size: number;
};

export type TPagingConfigCb = (config: TPagingConfig) => void;

export type TQueryConfigCb = (config: IQueryConfig) => void;

export type TDownload = (keys: string[]) => void;

export interface IQueryConfig {
  pageIndex: number;
  size: number;
  sort: {
    field: string;
    order: TSortDirection;
  }[];
  searchAfter?: ISearchAfter[];
  firstPageFlag?: any[];
  operations?: IQueryOperationsConfig;
}
