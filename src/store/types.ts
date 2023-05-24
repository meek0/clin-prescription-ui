import { GlobalInitialState } from 'store/global';
import { PrescriptionInitialState } from 'store/prescription';
import { TUserState } from 'store/user';

export type RootState = {
  global: GlobalInitialState;
  user: TUserState;
  prescription: PrescriptionInitialState;
};
