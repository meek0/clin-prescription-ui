import ReactDOMServer from 'react-dom/server';
import ExternalLink from '@ferlab/ui/core/components/ExternalLink';
import { Space } from 'antd';
import { Varsome } from 'graphql/variants/models';

import AcmgNoVerdictCheck from 'components/icons/AcmgNoVerdictCheck';
import AcmgVerdictCheck from 'components/icons/AcmgVerdictCheck';

interface OwnProps {
  varsome?: Varsome;
  locus: string;
}

const AcmgVerdict = ({ varsome, locus }: OwnProps) => {
  const verdict = varsome?.acmg?.verdict?.verdict;
  return (
    <Space>
      {verdict ? <AcmgVerdictCheck /> : <AcmgNoVerdictCheck />}
      <ExternalLink href={`https://varsome.com/variant/hg38/${encodeURIComponent(locus)}`}>
        {verdict || (varsome ? 'No Verdict' : 'No Data')}
      </ExternalLink>
    </Space>
  );
};

export const renderToString = (row: any) =>
  ReactDOMServer.renderToString(<AcmgVerdict varsome={row.varsome} locus={row.locus} />);

export default AcmgVerdict;
