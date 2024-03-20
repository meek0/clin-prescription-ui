import { Tag, Tooltip } from 'antd';

export enum PriorityOptions {
  Asap = 'asap',
  Routine = 'routine',
}

export type TranslationDictionary = Record<PriorityOptions, string>;

export type PriorityLabelProps = {
  dictionaries: { text: TranslationDictionary; tooltip: TranslationDictionary };
  priority: string;
};

export const PriorityLabelElement: Record<
  PriorityOptions,
  (d: { text: TranslationDictionary; tooltip: TranslationDictionary }) => React.ReactElement
> = {
  [PriorityOptions.Asap]: (d) => (
    <Tooltip title={d.tooltip[PriorityOptions.Asap]}>
      <Tag color="red">{d.text[PriorityOptions.Asap]}</Tag>
    </Tooltip>
  ),
  [PriorityOptions.Routine]: (d) => (
    <Tooltip title={d.tooltip[PriorityOptions.Routine]}>
      <Tag color="default">{d.text[PriorityOptions.Routine]}</Tag>
    </Tooltip>
  ),
};

const PriorityTag = ({ dictionaries, priority }: PriorityLabelProps) =>
  PriorityLabelElement[priority as PriorityOptions](dictionaries);

export default PriorityTag;
