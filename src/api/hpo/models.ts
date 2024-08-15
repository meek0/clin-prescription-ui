export {};

export interface IHpoNode {
  hpo_id: string;
  is_leaf: boolean;
  name: string;
  parents: string[];
}

export interface IHpoChild {
  _source: IHpoNode;
  highlight: {
    name: string;
    hpo_id: string;
    'hpo_id.autocomplete': string;
  };
}

export interface IHpoPayload {
  hits: IHpoChild[];
  total: number;
}

export interface IHpoCount {
  count: number;
}
