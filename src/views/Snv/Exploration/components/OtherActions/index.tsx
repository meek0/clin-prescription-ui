/* eslint-disable max-len */
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import { DownloadOutlined, MoreOutlined, ReadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, MenuProps, Tooltip } from 'antd';
import { VariantEntity } from 'graphql/variants/models';

import GeneIcon from 'components/icons/GeneIcon';
import { fetchTranscriptsReport } from 'store/reports/thunks';

interface OwnProps {
  patientId: string;
  record: VariantEntity;
}

export const OtherActions = ({ patientId, record }: OwnProps) => {
  const dispatch = useDispatch();
  const items: MenuProps['items'] = [
    {
      key: 'downloadReport',
      icon: <DownloadOutlined />,
      label: intl.get('download.report'),
    },
    {
      key: 'UCSC',
      icon: <GeneIcon height="16" width="16" />,
      label: (
        <a
          target="_blank"
          href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=hg38&lastVirtModeType=default&lastVirtModeExtraState=&virtModeType=default&virtMode=0&nonVirtPosition=&position=chr${record.chromosome}%3A${record.start}-${record.end}`}
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          {intl.get('view.ucsc')}
        </a>
      ),
    },
  ];
  record.rsnumber
    ? items.push({
        key: 'LitVAR',
        icon: <ReadOutlined />,
        label: (
          <a
            target="_blank"
            href={`https://www.ncbi.nlm.nih.gov/research/litvar2/docsum?text=${record.rsnumber}`}
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            {intl.get('view.litvar')}
          </a>
        ),
      })
    : null;

  return (
    <Tooltip title={intl.get('other.action')}>
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu
            onClick={({ key }) =>
              key === 'downloadReport'
                ? dispatch(fetchTranscriptsReport({ patientId, variantId: record.hgvsg }))
                : null
            }
            items={items}
          />
        }
        placement="bottomLeft"
      >
        <Button icon={<MoreOutlined />} type="link" size={'small'} />
      </Dropdown>
    </Tooltip>
  );
};
