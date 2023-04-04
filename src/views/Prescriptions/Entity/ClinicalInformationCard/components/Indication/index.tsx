import { useGeneralObservationEntity } from 'graphql/prescriptions/actions';

type IDOwnProps = {
  id: string;
};

export const Indication = ({ id }: IDOwnProps) => {
  const { generalObervationValue } = useGeneralObservationEntity(id);
  return <>{generalObervationValue?.valueString}</>;
};
