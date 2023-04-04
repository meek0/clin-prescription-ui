import React from 'react';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import ExpandableCell from '@ferlab/ui/core/components/tables/ExpandableCell';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';
import { HpoCondition, HpoConditions } from 'graphql/variants/models';

interface OwnProps {
  conditions: HpoConditions;
}

const { Text } = Typography;

const HpoConditionCell = ({ conditions }: OwnProps) => (
  <ExpandableCell
    dataSource={conditions || []}
    renderItem={(hpoItem, id) => {
      const item = hpoItem as HpoCondition;

      const termLabel = item.hpoTermLabel || '';
      const termId = item.hpoTermTermId;

      // expects: aLabel (HP:xxxxxx)
      const split = termLabel.split('(');
      const condition = split[0];

      return (
        <StackLayout key={id}>
          <Text>{condition}</Text>&nbsp;(
          <ExternalLink key={id} href={`https://hpo.jax.org/app/browse/term/${termId}`}>
            {termId}
          </ExternalLink>
          )
        </StackLayout>
      );
    }}
  />
);

export default HpoConditionCell;
