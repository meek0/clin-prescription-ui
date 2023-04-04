import React from 'react';
import intl from 'react-intl-universal';
import { Result } from 'antd';

interface OwnProps {
  title?: string;
  description?: string;
}

const Forbidden = ({ title, description }: OwnProps) => (
  <Result
    status="403"
    title={title ? title : intl.get('result.forbidden.error.title')}
    subTitle={description ? description : intl.get('result.forbidden.error.description')}
  />
);

export default Forbidden;
