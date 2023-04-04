import { CheckCircleOutlined, SyncOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

/**
 *
 * New modal for status
 *
 * Will need to move and update ferlab StatusLabel Component
 *
 */

export enum StatusOptions {
  Active = 'active',
  OnHold = 'on-hold',
  Completed = 'completed',
}

export type TranslationDictionary = Record<StatusOptions, string>;

export type StatusLabelProps = {
  className?: string;
  dictionary: TranslationDictionary;
  status: string;
};

export const StatusLabelElement: Record<
  StatusOptions,
  (d: TranslationDictionary) => React.ReactElement
> = {
  [StatusOptions.Active]: (d) => (
    <Tag color="green" icon={<CheckCircleOutlined />}>
      {d[StatusOptions.Active]}
    </Tag>
  ),
  [StatusOptions.OnHold]: (d) => (
    <Tag color="blue" icon={<SyncOutlined />}>
      {d[StatusOptions.OnHold]}
    </Tag>
  ),
  [StatusOptions.Completed]: (d) => (
    <Tag color="green" icon={<CheckCircleOutlined />}>
      {d[StatusOptions.Completed]}
    </Tag>
  ),
};

const StatusTag = ({ dictionary, status }: StatusLabelProps) =>
  StatusLabelElement[status as StatusOptions](dictionary);

export default StatusTag;
