import { Tag, Tooltip } from 'antd';

export enum PriorityOptions {
  Asap = 'asap',
  Routine = 'routine',
}

export type TranslationDictionary = Record<PriorityOptions, string>;

export type PriorityLabelProps = {
  dictionary: TranslationDictionary;
  tooltipDictionary: TranslationDictionary;
  priority: string;
};

export const PriorityLabelElement: Record<
  PriorityOptions,
  (d: TranslationDictionary, t: TranslationDictionary) => React.ReactElement
> = {
  [PriorityOptions.Asap]: (d, t) => (
    <Tooltip title={t[PriorityOptions.Asap]}>
      <Tag color="red">{d[PriorityOptions.Asap]}</Tag>
    </Tooltip>
  ),
  [PriorityOptions.Routine]: (d, t) => (
    <Tooltip title={t[PriorityOptions.Routine]}>
      <Tag color="default">{d[PriorityOptions.Routine]}</Tag>
    </Tooltip>
  ),
};

const PriorityTag = ({ dictionary, tooltipDictionary, priority }: PriorityLabelProps) =>
  PriorityLabelElement[priority as PriorityOptions](dictionary, tooltipDictionary);

export default PriorityTag;
