import { GlobalInitialState } from 'store/global';
import { PrescriptionInitialState } from 'store/prescription';
import { TUserState } from 'store/user';

import { SavedFilterInitialState } from './savedFilter';

export type TReportState = {
  loadingIds: string[];
};

export enum ReportNames {
  transcript = 'transcript',
  nanuq = 'nanuq',
}

export type RootState = {
  global: GlobalInitialState;
  report: TReportState;
  user: TUserState;
  prescription: PrescriptionInitialState;
  savedFilter: SavedFilterInitialState;
};
