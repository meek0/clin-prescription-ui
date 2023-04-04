import { TermOperators } from '@ferlab/ui/core/data/sqon/operators';
import { ISqonGroupFilter } from '@ferlab/ui/core/data/sqon/types';

export const wrapSqonWithPatientIdAndRequestId = (
  resolvedSqon: ISqonGroupFilter,
  patientId?: string,
  prescriptionId?: string,
) => {
  if (patientId || prescriptionId) {
    const subContent: any[] = [];

    if (patientId) {
      subContent.push({
        content: { field: 'patient_id', value: [patientId] },
        op: TermOperators.in,
      });
    }

    // Not used yet
    // if (prescriptionId) {
    //   subContent.push({
    //     content: { field: 'service_request_id', value: [prescriptionId] },
    //     op: TermOperators.in,
    //   });
    // }

    return {
      content: [
        {
          content: subContent,
          op: 'and',
        },
        { ...resolvedSqon },
      ],
      op: 'and',
    };
  }

  return resolvedSqon;
};
