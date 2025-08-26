/* eslint-disable @typescript-eslint/no-explicit-any */
import { clickNext, clickSave, clickSaveWithValidateOnly } from "../../shared/actions";

export const StepProject = {
  actions: {
    clickSave() {
      clickSave();
    },
    clickSaveWithValidateOnly() {
      clickSaveWithValidateOnly();
    },
    clickNext() {
      clickNext();
    },
  },
};