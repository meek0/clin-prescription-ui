import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined } from '@ant-design/icons';
import { downloadDocuments } from '@ferlab/core/core/utils';
import { Button } from 'antd';
import { RptManager } from 'auth/rpt';

import { globalActions, useLang } from 'store/global';
import { getDownloadPdfConfig } from 'utils/helper';

interface OwnProps {
  prescriptionId: string;
  loading?: boolean;
  iconOnly?: boolean;
  text?: string;
}
const getRtp = async () => (await RptManager.readRpt()).access_token;
const DownloadButton = ({ prescriptionId, loading, iconOnly, text }: OwnProps) => {
  const lang = useLang();
  const dispatch = useDispatch();
  const [downloadingDocuments, setDownloadingDocuments] = useState(false);
  const [rptToken, setRptToken] = useState<string | undefined>();
  const config = getDownloadPdfConfig(prescriptionId, lang, rptToken);

  useEffect(() => {
    getRtp().then((token) => {
      setRptToken(token);
    });
  }, []);

  const errorNotification = () => {
    dispatch(
      globalActions.displayNotification({
        type: 'error',
        message: intl.get('notification.error'),
        description: intl.get('notification.error.file.download'),
      }),
    );
  };

  return iconOnly ? (
    <Button
      type="link"
      icon={<DownloadOutlined />}
      size="small"
      loading={downloadingDocuments}
      disabled={!!loading}
      onClick={() =>
        downloadDocuments(prescriptionId, setDownloadingDocuments, config, errorNotification)
      }
    />
  ) : (
    <Button
      key="download-docs"
      type="primary"
      loading={downloadingDocuments}
      disabled={!!loading}
      onClick={() =>
        downloadDocuments(prescriptionId, setDownloadingDocuments, config, errorNotification)
      }
      icon={<DownloadOutlined width={'16'} height={'16'} />}
    >
      {text ? text : intl.get('download.documents')}
    </Button>
  );
};

export default DownloadButton;
