import { SortDirection } from '@ferlab/ui/core/graphql/constants';
import { SorterResult } from 'antd/lib/table/interface';
import { FORM_API_URL } from 'api/form';
import isArray from 'lodash/isArray';

import { LANG, MIME_TYPES } from './constants';

// STRING
export const appendBearerIfToken = (token?: string) => (token ? `Bearer ${token}` : '');

export const isBoolTrue = (value: number | boolean | string | null) =>
  !!value || 'true' === value?.toString().toLowerCase();

export const scrollToTop = (scrollContentId: string) =>
  document
    .getElementById(scrollContentId)
    ?.querySelector('.simplebar-content-wrapper')
    ?.scrollTo(0, 0);

export const getOrderFromAntdValue = (order: string): SortDirection =>
  order === 'ascend' ? SortDirection.Asc : SortDirection.Desc;

export const formatQuerySortList = (sorter: SorterResult<any> | SorterResult<any>[]) => {
  const sorters = (isArray(sorter) ? sorter : [sorter]).filter(
    (sorter) => !!sorter.column || !!sorter.order,
  );

  const r = sorters.map((sorter) => {
    let field = (sorter.field?.toString()! || sorter.columnKey?.toString()!)?.replaceAll('__', '.');
    if (sorter.columnKey !== sorter.field) {
      field = sorter.columnKey ? sorter.columnKey.toString() : sorter.field?.toString()!;
    }

    return {
      field,
      order: getOrderFromAntdValue(sorter.order!),
    };
  });

  return r;
};

export const getPositionAt = (value: string, subString: string, index: number) =>
  value.split(subString, index).join(subString).length;

export const specialCharactersRegex = /[!@#$%^&*()_+{}[\]:;<>?~\\/|]/;

export const hasSpecialCharacters = (inputString: string) =>
  specialCharactersRegex.test(inputString);

export const downloadFile = (blob: Blob, filename: string) => {
  const downloadLinkElement = document.createElement('a');
  downloadLinkElement.href = window.URL.createObjectURL(blob);
  downloadLinkElement.download = filename;
  document.body.appendChild(downloadLinkElement);
  downloadLinkElement.click();
  document.body.removeChild(downloadLinkElement);
  URL.revokeObjectURL(downloadLinkElement.href);
};

export const extractFilename = (contentDisposition: string, defaultFileName: string = '') =>
  contentDisposition
    ?.split(';')
    .find((e) => e?.startsWith(' filename='))
    ?.split('=')?.[1] || defaultFileName;

export const getDownloadPdfConfig = (id: string, lang: LANG, rptToken?: string) => ({
  token: rptToken,
  url: `${FORM_API_URL}/render/${id}?format=pdf&lang=${lang}`,
  type: MIME_TYPES.APPLICATION_PDF,
  format: 'pdf',
});
