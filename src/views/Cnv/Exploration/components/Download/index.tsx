import React, { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { useVariants } from 'graphql/cnv/actions';
import { VariantEntity } from 'graphql/cnv/models';
import { IQueryResults } from 'graphql/models';
import { getVariantColumns } from 'views/Cnv/Exploration/variantColumns';
import {
  buildVariantsDownloadCount,
  buildVariantsDownloadSqon,
  downloadAsTSV,
  MAX_VARIANTS_DOWNLOAD,
  VARIANT_KEY,
} from 'views/Prescriptions/utils/export';

import GenericModal from 'components/utils/GenericModal';
import { globalActions } from 'store/global';
import { IQueryConfig, TDownload } from 'utils/searchPageTypes';

type OwnProps = {
  downloadKeys: Array<string>;
  setDownloadKeys: TDownload;
  queryVariables: any;
  queryConfig: IQueryConfig;
  variants: IQueryResults<VariantEntity[]>;
};

const Download = ({
  downloadKeys,
  setDownloadKeys,
  queryVariables,
  queryConfig,
  variants,
}: OwnProps) => {
  const [showModalLimit, setShowModalLimit] = useState(false);
  const dispatch = useDispatch();

  const variantToDownloadCount = buildVariantsDownloadCount(
    downloadKeys,
    variants.total,
    MAX_VARIANTS_DOWNLOAD,
  );

  const variantsToDownload = useVariants(
    {
      ...queryVariables,
      first: variantToDownloadCount,
      searchAfter: undefined,
      sqon: buildVariantsDownloadSqon(downloadKeys, VARIANT_KEY, queryVariables.sqon),
    },
    queryConfig.operations,
  );

  useEffect(() => {
    if (downloadKeys.length > 0 && !variantsToDownload.loading) {
      if (variantsToDownload.data.length === 0) {
        if (variantsToDownload.error) {
          dispatch(
            globalActions.displayNotification({
              type: 'error',
              message: intl.get('screen.patientsnv.results.table.download.error.title'),
              description: intl.get('screen.patientsnv.results.table.download.error.message'),
            }),
          );
        } else {
          setShowModalLimit(true);
        }
      } else if (variantsToDownload.data.length > 0) {
        downloadAsTSV(
          variantsToDownload.data,
          downloadKeys,
          VARIANT_KEY,
          getVariantColumns(
            () => {},
            () => {},
          ).filter((h) => h.key !== 'actions'), // remove action column
          'CNV',
          {
            // mapping of some column keys with query field
            length: 'reflen',
            filter: 'filters',
          },
        );
      }
      setDownloadKeys([]); // reset download
    }
  }, [downloadKeys, setDownloadKeys, variantsToDownload, dispatch]);

  useEffect(() => {
    if (downloadKeys.length > 0 && variantToDownloadCount > 0) {
      dispatch(
        globalActions.displayNotification({
          type: 'info',
          message: intl.get('screen.patientsnv.results.table.download.info.title'),
          description: intl.get('screen.patientsnv.results.table.download.info.message'),
        }),
      );
    }
  }, [dispatch, downloadKeys, variantToDownloadCount]);

  return (
    <>
      <GenericModal
        type={'warning'}
        title={intl.get('screen.patientsnv.results.table.download.limit.title')}
        message={intl.get('screen.patientsnv.results.table.download.limit.message', {
          MAX_VARIANTS_DOWNLOAD,
        })}
        okText={intl.get('screen.patientsnv.results.table.download.limit.button')}
        showModal={showModalLimit}
        onClose={() => setShowModalLimit(false)}
      />
    </>
  );
};

export default Download;
