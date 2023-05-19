import React from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';
import { CosmicConditions } from 'graphql/variants/models';

interface OwnProps {
  conditions: CosmicConditions;
}

const { Text } = Typography;

const CosmicConditionCell = ({ conditions }: OwnProps) => (
  <div>
    {conditions.length >= 0 &&
      conditions.map((cosmicCondition, index: number) => (
        <StackLayout key={index}>
          <Text>{cosmicCondition}</Text>
        </StackLayout>
      ))}
  </div>
);

export default CosmicConditionCell;
