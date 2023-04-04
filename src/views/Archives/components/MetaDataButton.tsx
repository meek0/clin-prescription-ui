import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { Typography } from 'antd';
import { FhirApi } from 'api/fhir';
import { extractTaskId } from 'api/fhir/helper';

import { globalActions } from 'store/global';

interface OwnProps {
  taskId: string;
  fileName: string;
}

const MetaDataButton = ({ taskId, fileName }: OwnProps) => {
  const dispatch = useDispatch();

  return (
    <Typography.Link
      onClick={async () => {
        const messageKey = 'loadingMetaData';
        dispatch(
          globalActions.displayMessage({
            type: 'loading',
            key: messageKey,
            content: intl.get('screen.archives.metadata.download.loading.msg'),
            duration: 0,
          }),
        );
        FhirApi.downloadFileMetadata(taskId, fileName)
          .then(() => {
            dispatch(globalActions.destroyMessages([messageKey]));
            dispatch(
              globalActions.displayNotification({
                type: 'success',
                message: intl.get('notification.success'),
                description: intl.get('notification.success.file.download'),
              }),
            );
          })
          .catch(() => {
            dispatch(globalActions.destroyMessages([messageKey]));
            dispatch(
              globalActions.displayNotification({
                type: 'error',
                message: intl.get('notification.error'),
                description: intl.get('notification.error.file.download'),
              }),
            );
          });
      }}
    >
      {extractTaskId(taskId)}
    </Typography.Link>
  );
};

export default MetaDataButton;
