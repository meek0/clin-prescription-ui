import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons/lib/icons';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { Button, Tooltip } from 'antd';
import { HybridApi } from 'api/hybrid';
import { HybridPrescription } from 'api/hybrid/models';
import { AnalysisResult, ITableAnalysisResult } from 'graphql/prescriptions/models/Prescription';
import { capitalize } from 'lodash';
import DownloadButton from 'views/Prescriptions/components/DownloadDocument';
import PriorityTag from 'views/Prescriptions/components/PriorityTag';
import StatusTag from 'views/Prescriptions/components/StatusTag';
import { getPrescriptionStatusDictionnary } from 'views/Prescriptions/utils/constant';

import getStoreConfig from 'store';
import { globalActions } from 'store/global';
import { prescriptionFormActions } from 'store/prescription/slice';
import { fetchFormConfig } from 'store/prescription/thunk';
import { AnalysisType } from 'store/prescription/types';
import { TABLE_EMPTY_PLACE_HOLDER } from 'utils/constants';
import { formatDate } from 'utils/date';
import EnvironmentVariables from 'utils/EnvVariables';

const { store } = getStoreConfig();

import SharingCell from './sharing/SharingCell';

export const prescriptionsColumns = (list: any[]): ProColumnType<ITableAnalysisResult>[] => [
  {
    key: 'sharing',
    render: (results: any) => <SharingCell results={results} list={list} />,
    title: intl.get('screen.patientsearch.table.sharing'),
    tooltip: intl.get('screen.patientsearch.table.sharing.tooltip'),
    iconTitle: <UserOutlined style={{ fontSize: '16px' }} />,
  },
  {
    key: 'prescription_id',
    dataIndex: ['prescription_id'],
    render: (prescription_id: string, record: AnalysisResult) => (
      <>
        {EnvironmentVariables.configFor('USE_DRAFT') !== 'true' || record.status !== 'draft' ? (
          <Link to={`/prescription/entity/${prescription_id}`}>{prescription_id}</Link>
        ) : (
          <Button style={{ padding: 0 }} type="link" onClick={() => openDraft(prescription_id)}>
            {prescription_id}
          </Button>
        )}
      </>
    ),
    title: intl.get('screen.patientsearch.table.prescription'),
    sorter: { multiple: 1 },
  },
  {
    key: 'person.last_name',
    render: (record: AnalysisResult) =>
      `${record.person.last_name.toUpperCase()} ${record.person.first_name}`,
    title: intl.get('screen.patientsearch.table.patient'),
    sorter: { multiple: 1 },
  },
  {
    key: 'priority',
    dataIndex: ['priority'],
    render: (value: string) =>
      value ? <PriorityTag priority={value} /> : TABLE_EMPTY_PLACE_HOLDER,
    title: intl.get('screen.patientsearch.table.priority'),
    sorter: { multiple: 1 },
  },
  {
    key: 'status',
    dataIndex: 'status',
    render: (value: string) =>
      value ? <StatusTag dictionary={getPrescriptionStatusDictionnary()} status={value} /> : null,
    title: intl.get('screen.patientsearch.table.status'),
    sorter: { multiple: 1 },
  },
  {
    key: 'created_on',
    dataIndex: 'created_on',
    render: (date: string) => formatDate(date),
    title: intl.get('screen.patientsearch.table.createdOn'),
    tooltip: intl.get('screen.patientsearch.table.createdOn.tooltip'),
    sorter: { multiple: 1 },
  },
  {
    key: 'analysis_code',
    dataIndex: ['analysis_code'],
    title: intl.get('screen.patientsearch.table.test'),
    tooltip: intl.get('screen.patientsearch.table.test.tooltip'),
    sorter: { multiple: 1 },
  },
  {
    key: 'ep',
    dataIndex: ['ep'],
    title: intl.get('screen.patientsearch.table.ep'),
    tooltip: intl.get('screen.patientsearch.table.ep.tooltip'),
    sorter: { multiple: 1 },
  },
  {
    key: 'person.ramq',
    render: (record: AnalysisResult) =>
      record.person.ramq ? record.person.ramq : TABLE_EMPTY_PLACE_HOLDER,
    title: intl.get('screen.patientsearch.table.ramq'),
    sorter: { multiple: 1 },
  },
  {
    key: 'patient_mrn',
    dataIndex: ['patient_mrn'],
    render: (patient_mrn: string) => (patient_mrn ? patient_mrn : TABLE_EMPTY_PLACE_HOLDER),
    title: intl.get('screen.patientsearch.table.mrn'),
    sorter: { multiple: 1 },
  },
  {
    key: 'patient_id',
    dataIndex: ['patient_id'],
    render: (patient_id: string) => patient_id,
    defaultHidden: true,
    title: intl.get('screen.patientsearch.table.patientID'),
    sorter: { multiple: 1 },
  },
  {
    key: 'download',
    title: intl.get('screen.patientsearch.table.links'),
    tooltip: intl.get('screen.patientsearch.table.links.tooltip'),
    align: 'center',
    width: 40,
    fixed: 'right',
    dataIndex: ['prescription_id'],
    render: (prescription_id: string, record: AnalysisResult) => {
      const isDraft = record.status === 'draft';
      return (
        <Tooltip
          title={intl.get(isDraft ? 'prescriptionTable.download.disabled' : 'download.documents')}
        >
          <span>
            <DownloadButton prescriptionId={prescription_id} iconOnly disabled={isDraft} />
          </span>
        </Tooltip>
      );
    },
  },
];

async function openDraft(prescription_id: string) {
  const { data: prescription, error } = await HybridApi.getPrescription(prescription_id);
  if (error) {
    store.dispatch(
      globalActions.displayNotification({
        message: capitalize(intl.get('notification.error')),
        description: intl.get('notification.error.prescription.form.loadDraft'),
        type: 'error',
      }),
    );
  } else {
    store.dispatch(
      fetchFormConfig({
        code: prescription?.analysis_code as AnalysisType,
      }),
    );
    store.dispatch(prescriptionFormActions.openFormForDraft(prescription as HybridPrescription));
  }
}
