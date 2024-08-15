import { useState } from 'react';
import intl from 'react-intl-universal';
import FLAutoComplete, {
  FLAutoCompleteOption,
  FLAutoCompleteProps,
} from '@ferlab/ui/core/components/Search/FLAutoComplete';
import { Button } from 'antd';
import { HpoApi } from 'api/hpo';
import { IHpoNode } from 'api/hpo/models';

import PhenotypeModal from 'components/PhenotypeTree/TransferModal';
import { extractPhenotypeTitleAndCode } from 'utils/hpo';

import styles from './phenotype-search.module.css';

export interface PhenotypeSearchProps
  extends Omit<FLAutoCompleteProps, 'getResults' | 'placeholder' | 'onSelect'> {
  onSelect: (hpos: HPOResult[]) => void;
  ignoreHpoIds?: string[];
}

const PhenotypeSearch: React.FC<PhenotypeSearchProps> = ({
  allowClear = true,
  setSelectedValue = () => '',
  onSelect,
  ignoreHpoIds = [],
  ...props
}) => {
  const [isPhenotypeModalVisible, setIsPhenotypeModalVisible] = useState(false);
  return (
    <div className={styles.addClinicalSign}>
      <FLAutoComplete
        key={ignoreHpoIds.toString()}
        debounceInterval={500}
        placeholder={intl.get('component.phenotypeTree.searchPlaceholder')}
        getResults={async (term) => await handleHpoSearchTermChanged(term, ignoreHpoIds)}
        allowClear={allowClear}
        setSelectedValue={setSelectedValue}
        onSelect={(option) => {
          const hpo = option.data as IHpoNode;
          onSelect([{ id: hpo.hpo_id, name: hpo.name }]);
        }}
        {...props}
      />
      <Button
        type="link"
        className={styles.addClinicalSignBtn}
        onClick={() => setIsPhenotypeModalVisible(true)}
      >
        {intl.get('prescription.form.signs.observed.add.fullTree')}
      </Button>
      <PhenotypeModal
        visible={isPhenotypeModalVisible}
        onVisibleChange={setIsPhenotypeModalVisible}
        onApply={(nodes) => {
          const hpos = nodes.map((node) => ({
            id: node.key,
            name: extractPhenotypeTitleAndCode(node.title)?.title || '',
          }));
          onSelect(hpos);
        }}
      />
    </div>
  );
};

interface HPOResult {
  id: string;
  name: string;
}

async function handleHpoSearchTermChanged(term: string, ignoreHpoIds: string[] = []) {
  const options: FLAutoCompleteOption[] = [];
  return HpoApi.searchHpos(term.toLowerCase().trim()).then(({ data = { hits: [] }, error }) => {
    if (error) throw error;
    const hpoIds = new Set(ignoreHpoIds);
    for (const hit of data.hits) {
      if (hpoIds.has(hit._source.hpo_id)) continue;
      hpoIds.add(hit._source.hpo_id);
      const highlightName = hit.highlight?.name ? hit.highlight.name[0] : hit._source.name;
      const highlightId =
        (hit.highlight?.['hpo_id.autocomplete'] && hit.highlight['hpo_id.autocomplete'][0]) ||
        (hit.highlight?.hpo_id && hit.highlight.hpo_id[0]) ||
        hit._source.hpo_id;
      options.push({
        id: hit._source.hpo_id,
        highlight: `${highlightName} <span class="fl-auto-complete_highlight_id">( ${highlightId} )</span>`,
        data: hit._source,
      });
    }
    return options;
  });
}

export default PhenotypeSearch;
