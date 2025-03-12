import intl from 'react-intl-universal';
import { Tag, Tooltip } from 'antd';

export const Priorites = {
  Asap: 'asap',
  Routine: 'routine',
  Urgent: 'urgent',
  Stat: 'stat',
};

export type PriorityTagProps = {
  priority: string;
};

const PriorityTag = ({ priority }: PriorityTagProps) => {
  let tagColor = 'default';
  switch (priority) {
    case Priorites.Asap:
      tagColor = 'orange';
      break;
    case Priorites.Routine:
      tagColor = 'default';
      break;
    case Priorites.Urgent:
      tagColor = 'cyan';
      break;
    case Priorites.Stat:
      tagColor = 'red';
      break;
  }
  return (
    <Tooltip
      title={
        intl.get(`filters.options.priority.${priority}.tooltip`) ||
        intl.get(`filters.options.priority.unknown.tooltip`)
      }
    >
      <Tag color={tagColor}>
        {intl.get(`filters.options.priority.${priority}`) ||
          intl.get(`filters.options.priority.unknown`)}
      </Tag>
    </Tooltip>
  );
};

export default PriorityTag;
