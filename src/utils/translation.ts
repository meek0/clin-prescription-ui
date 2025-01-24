import intl from 'react-intl-universal';
import { IAssignmentsDictionary } from '@ferlab/ui/core/components/Assignments/types';
import { IProTableDictionary } from '@ferlab/ui/core/components/ProTable/types';
import { IDictionary as QueryBuilderDict } from '@ferlab/ui/core/components/QueryBuilder/types';

import { GetAnalysisNameByCode } from 'store/global/types';

import { formatNumber } from './formatNumber';

export const getProTableDictionary = (): IProTableDictionary => ({
  tooltips: {
    tableExport: intl.get('protable.tooltips.export'),
  },
  itemCount: {
    result: intl.get('protable.result'),
    results: intl.get('protable.results'),
    noResults: intl.get('protable.noResults'),
    of: intl.get('protable.of'),
    selected: intl.get('protable.selected'),
    selectedPlural: intl.get('protable.selectedPlural'),
    selectAllResults: intl.get('protable.selectAllResults'),
    clear: intl.get('protable.clear'),
    clearFilters: intl.get('protable.clear'),
  },
  columnSelector: {
    reset: intl.get('protable.reset'),
    tooltips: {
      columns: intl.get('protable.columns'),
    },
  },
  numberFormat: formatNumber,
  pagination: {
    first: intl.get('global.proTable.pagination.first'),
    previous: intl.get('previous'),
    next: intl.get('next'),
    view: intl.get('view'),
  },
});

export const getQueryBuilderDictionary = (
  facetResolver: (key: string) => React.ReactNode,
  getAnalysisNameByCode: GetAnalysisNameByCode,
): QueryBuilderDict => {
  const analysisMap = {
    MITN: getAnalysisNameByCode('MITN'),
    DYSTM: getAnalysisNameByCode('DYSTM'),
    MYOPC: getAnalysisNameByCode('MYOPC'),
    DI: getAnalysisNameByCode('DI'),
    RHAB: getAnalysisNameByCode('RHAB'),
    MYASC: getAnalysisNameByCode('MYASC'),
    MMG: getAnalysisNameByCode('MMG'),
    HYPM: getAnalysisNameByCode('HYPM'),
  };

  return {
    queryBuilderHeader: {
      manageFilters: {
        modalTitle: intl.get('querybuilder.header.myFiltersDropdown.manageMyFilter'),
        okText: intl.get('close'),
        lastSavedAt: intl.get('querybuilder.header.manageFilters.lastSaved'),
      },
      modal: {
        edit: {
          title: intl.get('querybuilder.header.modal.edit.title'),
          okText: intl.get('querybuilder.header.modal.edit.okText'),
          cancelText: intl.get('querybuilder.header.modal.edit.cancelText'),
          content: '',
          input: {
            label: intl.get('querybuilder.header.modal.edit.input.label'),
            placeholder: intl.get('querybuilder.header.modal.edit.input.placeholder'),
            maximumLength: intl.get('querybuilder.header.modal.edit.input.maximumLength'),
          },
        },
        saveThisFilter: intl.get('querybuilder.header.modal.saveThisFilter'),
        confirmUnsaved: {
          title: intl.get('querybuilder.header.modal.confirmUnsaved.title'),
          openSavedFilter: {
            okText: intl.get('querybuilder.header.modal.confirmUnsaved.openSavedFilter.okText'),
            cancelText: intl.get(
              'querybuilder.header.modal.confirmUnsaved.openSavedFilter.cancelText',
            ),
            content: intl.get('querybuilder.header.modal.confirmUnsaved.openSavedFilter.content'),
          },
          createNewFilter: {
            okText: intl.get('querybuilder.header.modal.confirmUnsaved.createNewFilter.okText'),
            cancelText: intl.get(
              'querybuilder.header.modal.confirmUnsaved.createNewFilter.cancelText',
            ),
            content: intl.get('querybuilder.header.modal.confirmUnsaved.createNewFilter.content'),
          },
        },
      },
      popupConfirm: {
        delete: {
          title: intl.get('querybuilder.header.popupConfirm.delete.title'),
          okText: intl.get('querybuilder.header.popupConfirm.delete.okText'),
          cancelText: intl.get('querybuilder.header.popupConfirm.delete.cancelText'),
          content: intl.get('querybuilder.header.popupConfirm.delete.content'),
        },
      },
      tooltips: {
        newQueryBuilder: intl.get('querybuilder.header.tooltips.newQueryBuilder'),
        save: intl.get('querybuilder.header.tooltips.save'),
        saveChanges: intl.get('querybuilder.header.tooltips.saveChanges'),
        delete: intl.get('querybuilder.header.tooltips.delete'),
        duplicateQueryBuilder: intl.get('querybuilder.header.tooltips.duplicateQueryBuilder'),
        share: intl.get('querybuilder.header.tooltips.share'),
        setAsDefaultFilter: intl.get('querybuilder.header.tooltips.setAsDefaultFilter'),
        unsetDefaultFilter: intl.get('querybuilder.header.tooltips.unsetDefaultFilter'),
        undoChanges: intl.get('querybuilder.header.tooltips.undoChanges'),
        noSavedFilters: intl.get('querybuilder.header.tooltips.noSavedFilters'),
        saveDisabled: intl.get('querybuilder.header.tooltips.saveChanges'),
        shareDisabled: intl.get('querybuilder.header.tooltips.share'),
      },
      myFiltersDropdown: {
        title: intl.get('querybuilder.header.myFiltersDropdown.title'),
        manageMyFilter: intl.get('querybuilder.header.myFiltersDropdown.manageMyFilter'),
      },
      duplicateFilterTitleSuffix: intl.get('querybuilder.header.duplicateFilterTitleSuffix'),
    },
    query: {
      combine: {
        and: intl.get('querybuilder.query.combine.and'),
        or: intl.get('querybuilder.query.combine.or'),
      },
      noQuery: intl.get('querybuilder.query.noQuery'),
      facet: facetResolver,
      facetValueMapping: {
        'donors.analysis_code': analysisMap,
        panels: analysisMap,
        'consequences.predictions.fathmm_pred': {
          T: intl.get('filters.options.consequences.predictions.fathmm_pred.T'),
          D: intl.get('filters.options.consequences.predictions.fathmm_pred.D'),
        },
        'consequences.predictions.polyphen2_hvar_pred': {
          B: intl.get('filters.options.consequences.predictions.polyphen2_hvar_pred.B'),
          D: intl.get('filters.options.consequences.predictions.polyphen2_hvar_pred.D'),
          P: intl.get('filters.options.consequences.predictions.polyphen2_hvar_pred.P'),
        },
        'consequences.predictions.sift_pred': {
          T: intl.get('filters.options.consequences.predictions.sift_pred.T'),
          D: intl.get('filters.options.consequences.predictions.sift_pred.D'),
        },
        'consequences.predictions.lrt_pred': {
          N: intl.get('filters.options.consequences.predictions.lrt_pred.N'),
          U: intl.get('filters.options.consequences.predictions.lrt_pred.U'),
          D: intl.get('filters.options.consequences.predictions.lrt_pred.D'),
        },
        chromosome: {
          true: '1',
        },
        'donors.parental_origin': {
          both: intl.get('filters.options.donors.parental_origin.both'),
          possible_denovo: intl.get('filters.options.donors.parental_origin.possible_denovo'),
          denovo: intl.get('filters.options.donors.parental_origin.denovo'),
        },
      },
    },
    actions: {
      new: intl.get('querybuilder.actions.new'),
      addQuery: intl.get('querybuilder.actions.addQuery'),
      combine: intl.get('querybuilder.actions.combine'),
      labels: intl.get('querybuilder.actions.labels'),
      changeOperatorTo: intl.get('querybuilder.actions.changeOperatorTo'),
      delete: {
        title: intl.get('querybuilder.actions.delete.title'),
        cancel: intl.get('querybuilder.actions.delete.cancel'),
        confirm: intl.get('querybuilder.actions.delete.confirm'),
      },
      clear: {
        title: intl.get('querybuilder.actions.clear.title'),
        cancel: intl.get('querybuilder.actions.clear.cancel'),
        confirm: intl.get('querybuilder.actions.clear.confirm'),
        buttonTitle: intl.get('querybuilder.actions.clear.buttonTitle'),
        description: intl.get('querybuilder.actions.clear.description'),
      },
    },
  };
};

export const getShareDictionairy = (): IAssignmentsDictionary => ({
  select: {
    actions: {
      clear: intl.get('sharing.dropdown.actions.clear'),
    },
    textInfo: {
      searchPlaceholder: intl.get('sharing.dropdown.select.searchPlaceholder'),
      notAssigned: intl.get('sharing.dropdown.select.notAssign'),
    },
  },
  filter: {
    actions: {
      reset: intl.get('sharing.filter.actions.reset'),
      filter: intl.get('sharing.filter.actions.ok'),
    },
    textInfo: {
      searchPlaceholder: intl.get('sharing.dropdown.select.searchPlaceholder'),
    },
  },
});
