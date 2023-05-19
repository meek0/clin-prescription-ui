import React from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography } from 'antd';
import { DddConditions } from 'graphql/variants/models';

interface OwnProps {
  conditions: DddConditions;
}

const { Text } = Typography;

const DddConditionCell = ({ conditions }: OwnProps) => (
  <div>
    {conditions.length >= 0 &&
      conditions.map((dddCondition, index: number) => (
        <StackLayout key={index}>
          <Text>{dddCondition}</Text>
        </StackLayout>
      ))}
  </div>
);

export default DddConditionCell;
