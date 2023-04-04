import React from 'react';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { OrphanetCondition, OrphanetConditions } from 'graphql/variants/models';

interface OwnProps {
  conditions: OrphanetConditions;
}

const OrphanetConditionCell = ({ conditions }: OwnProps) => (
  <div>
    {conditions.length > 0 &&
      conditions.map((orphanetItem: OrphanetCondition, index: number) => {
        const panel = orphanetItem.panel;
        const disorderId = orphanetItem.disorderId;
        return (
          <StackLayout key={index}>
            <ExternalLink
              href={
                'https://www.orpha.net/consor/cgi-bin/Disease_Search.php' +
                `?lng=EN&data_id=${disorderId}`
              }
            >
              {panel}
            </ExternalLink>
          </StackLayout>
        );
      })}
  </div>
);

export default OrphanetConditionCell;
