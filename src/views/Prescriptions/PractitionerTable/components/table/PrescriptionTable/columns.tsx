import intl from 'react-intl-universal';
import { Link } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons/lib/icons';
import { ProColumnType } from '@ferlab/ui/core/components/ProTable/types';
import { Tooltip } from 'antd';
import { AnalysisResult, ITableAnalysisResult } from 'graphql/prescriptions/models/Prescription';
import DownloadButton from 'views/Prescriptions/components/DownloadDocument';
import PriorityTag from 'views/Prescriptions/components/PriorityTag';
import StatusTag from 'views/Prescriptions/components/StatusTag';
import {
  getPrescriptionStatusDictionnary,
  prescriptionPriorityDictionnary,
} from 'views/Prescriptions/utils/constant';

import { TABLE_EMPTY_PLACE_HOLDER } from 'utils/constants';
import { formatDate } from 'utils/date';

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
    render: (prescription_id: string) => (
      <Link to={`/prescription/entity/${prescription_id}`}>{prescription_id}</Link>
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
      value ? (
        <PriorityTag dictionaries={prescriptionPriorityDictionnary()} priority={value} />
      ) : (
        TABLE_EMPTY_PLACE_HOLDER
      ),
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
    render: (record: AnalysisResult) => record.person.ramq,
    title: intl.get('screen.patientsearch.table.ramq'),
    sorter: { multiple: 1 },
  },
  {
    key: 'patient_mrn',
    dataIndex: ['patient_mrn'],
    render: (patient_mrn: string) => patient_mrn,
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
    render: (prescription_id: string) => (
      <Tooltip title={intl.get('download.documents')}>
        <DownloadButton prescriptionId={prescription_id} iconOnly />
      </Tooltip>
    ),
  },
];
