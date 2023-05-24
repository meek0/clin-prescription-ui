import { GlobalInitialState } from 'store/global';
import { PrescriptionInitialState } from 'store/prescription';
import { TUserState } from 'store/user';

export type TReportState = {
  loadingIds: string[];
};

export type RootState = {
  global: GlobalInitialState;
  report: TReportState;
  user: TUserState;
  prescription: PrescriptionInitialState;
};
