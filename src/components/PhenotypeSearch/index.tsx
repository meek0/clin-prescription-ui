import intl from 'react-intl-universal';
import FLAutoComplete, {
  FLAutoCompleteOption,
  FLAutoCompleteProps,
} from '@ferlab/ui/core/components/Search/FLAutoComplete';
import { HpoApi } from 'api/hpo';
import { IHpoNode } from 'api/hpo/models';

import styles from './phenotype-search.module.css';

export interface PhenotypeSearchProps
  extends Omit<FLAutoCompleteProps, 'getResults' | 'placeholder' | 'onSelect' | 'defaultValue'> {
  onSelect: (hpos: HPOResult) => void;
  ignoreHpoIds?: string[];
  defaultOption?: { id: string; name: string };
  onClear?: () => void;
}

const ID_FROM_DISPLAY_VALUE_REGEX = /^[^(]+\s\(\s(hp:\d{7})\s\)$/;

const PhenotypeSearch: React.FC<PhenotypeSearchProps> = ({
  allowClear = true,
  setSelectedValue = (option) => `${option.data.name} (${option.data.hpo_id})`,
  onSelect,
  ignoreHpoIds = [],
  defaultOption,
  onClear,
  ...props
}) => (
  <div className={styles['phenotype-search']}>
    <FLAutoComplete
      key={ignoreHpoIds.toString()}
      debounceInterval={500}
      defaultValue={
        defaultOption?.id &&
        setSelectedValue({
          id: defaultOption.id,
          highlight: '',
          data: { hpo_id: defaultOption.id, name: defaultOption.name },
        })
      }
      placeholder={intl.get('component.phenotypeSearch.placeholder')}
      getResults={async (term) => {
        const isValidDisplayValue = term.match(ID_FROM_DISPLAY_VALUE_REGEX);
        return await handleHpoSearchTermChanged(
          isValidDisplayValue ? isValidDisplayValue[1] : term,
          ignoreHpoIds,
        );
      }}
      allowClear={allowClear}
      setSelectedValue={setSelectedValue}
      onClear={onClear}
      onSelect={(option) => {
        const hpo = option.data as IHpoNode;
        onSelect({ id: hpo.hpo_id, name: hpo.name });
      }}
      {...props}
    />
  </div>
);

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
        highlight: `${highlightName} <span class="fl-auto-complete_highlight_id">(${highlightId})</span>`,
        data: hit._source,
      });
    }
    return options;
  });
}

export default PhenotypeSearch;
