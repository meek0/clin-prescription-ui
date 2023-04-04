import intl from 'react-intl-universal';
import { Modal } from 'antd';
import axios from 'axios';
import cx from 'classnames';
import { usePatientFilesData } from 'graphql/patients/actions';
import { FhirDoc, PatientFileResults } from 'graphql/patients/models/Patient';
import { DonorsEntity, VariantEntity } from 'graphql/variants/models';
import { GraphqlBackend } from 'providers';
import ApolloProvider from 'providers/ApolloProvider';

import Igv from 'components/Igv';
import { IIGVTrack } from 'components/Igv/type';
import ServerError from 'components/Results/ServerError';
import { GENDER, PARENT_TYPE, PATIENT_POSITION } from 'utils/constants';
import { appendBearerIfToken, formatLocus, getPatientPosition } from 'utils/helper';

import style from './index.module.scss';

interface OwnProps {
  donor: DonorsEntity;
  variantEntity: VariantEntity;
  isOpen?: boolean;
  toggleModal: (visible: boolean) => void;
  rpt: string;
}

interface ITrackFiles {
  indexFile: string | undefined;
  mainFile: string | undefined;
}

const FHIR_CRAM_CRAI_DOC_TYPE = 'ALIR';
const FHIR_CRAM_TYPE = 'CRAM';
const FHIR_CRAI_TYPE = 'CRAI';

const FHIR_VCF_TBI_DOC_TYPE = 'GCNV';
const FHIR_VCF_TYPE = 'VCF';
const FHIR_TBI_TYPE = 'TBI';

const getPresignedUrl = (file: string, rpt: string) =>
  axios
    .get(`${file}?format=json`, {
      headers: { Authorization: appendBearerIfToken(rpt) },
    })
    .then((response) => response.data.url);

const findDoc = (files: PatientFileResults, docType: string): FhirDoc | undefined =>
  files.docs.find((doc) => doc.type === docType);

const findFiles = (doc: FhirDoc, mainType: string, indexType: string): ITrackFiles => ({
  mainFile: doc?.content!.find((content) => content.format === mainType)?.attachment.url,
  indexFile: doc?.content!.find((content) => content.format === indexType)?.attachment.url,
});

const trackName = (
  doc: FhirDoc | undefined,
  patientId: string,
  gender: GENDER,
  position: PATIENT_POSITION | PARENT_TYPE,
) => `${doc?.sample.value!} ${getPatientPosition(gender, position)}`;

const generateTracks = (
  files: PatientFileResults,
  patientId: string,
  gender: GENDER,
  position: PATIENT_POSITION | PARENT_TYPE,
  rpt: string,
): IIGVTrack[] => {
  const cramDoc = findDoc(files, FHIR_CRAM_CRAI_DOC_TYPE);
  const cramFiles = findFiles(cramDoc!, FHIR_CRAM_TYPE, FHIR_CRAI_TYPE);

  const vcfDoc = findDoc(files, FHIR_VCF_TBI_DOC_TYPE);
  const vcfFiles = findFiles(vcfDoc!, FHIR_VCF_TYPE, FHIR_TBI_TYPE);

  return [
    {
      type: 'variant',
      format: 'vcf',
      url: getPresignedUrl(vcfFiles.mainFile!, rpt),
      indexURL: getPresignedUrl(vcfFiles.indexFile!, rpt),
      name: 'CNVs: ' + trackName(vcfDoc, patientId, gender, position),
      autoHeight: true,
      colorBy: 'SVTYPE',
    },
    {
      type: 'alignment',
      format: 'cram',
      url: getPresignedUrl(cramFiles.mainFile!, rpt),
      indexURL: getPresignedUrl(cramFiles.indexFile!, rpt),
      name: 'Reads: ' + trackName(cramDoc, patientId, gender, position),
      autoHeight: true,
      maxHeight: 500,
      colorBy: 'strand',
      sort: {
        chr: 'chr8',
        option: 'BASE',
        position: 128750986,
        direction: 'ASC',
      },
    },
  ];
};

const buildTracks = (
  patientFiles: PatientFileResults,
  motherFiles: PatientFileResults,
  fatherFiles: PatientFileResults,
  rpt: string,
  donor: DonorsEntity,
) => {
  if (!patientFiles.docs) {
    return [];
  }

  const tracks: IIGVTrack[] = [];

  tracks.push(
    ...generateTracks(
      patientFiles,
      donor.patient_id,
      donor.gender as GENDER,
      donor.is_proband ? PATIENT_POSITION.PROBAND : PATIENT_POSITION.PARENT,
      rpt,
    ),
  );

  if (donor.mother_id && motherFiles) {
    tracks.push(
      ...generateTracks(motherFiles, donor.mother_id, GENDER.FEMALE, PARENT_TYPE.MOTHER, rpt),
    );
  }

  if (donor.father_id && fatherFiles) {
    tracks.push(
      ...generateTracks(fatherFiles, donor.father_id, GENDER.MALE, PARENT_TYPE.FATHER, rpt),
    );
  }

  return tracks;
};

const IGVModal = ({ donor, variantEntity, isOpen = false, toggleModal, rpt }: OwnProps) => {
  const { loading, results, error } = usePatientFilesData(donor?.patient_id, !isOpen);
  const {
    loading: motherLoading,
    results: motherResults,
    error: motherError,
  } = usePatientFilesData(donor?.mother_id!, !isOpen || !donor?.mother_id);
  const {
    loading: fatherLoading,
    results: fatherResults,
    error: fatherError,
  } = usePatientFilesData(donor?.father_id!, !isOpen || !donor?.father_id);

  return (
    <Modal
      width="90vw"
      visible={isOpen}
      footer={false}
      title={intl.get('screen.patientsnv.drawer.igv.title')}
      onCancel={() => toggleModal(false)}
      className={cx(style.igvModal, 'igvModal')}
      wrapClassName={cx(style.igvModalWrapper, 'igvModalWrapper')}
    >
      {error || motherError || fatherError ? (
        <ServerError />
      ) : (
        isOpen &&
        !(loading || motherLoading || fatherLoading) && (
          <Igv
            className={cx(style.igvContainer, 'igvContainer')}
            options={{
              palette: ['#00A0B0', '#6A4A3C', '#CC333F', '#EB6841'],
              reference: {
                id: 'hg38_1kg',
                ucscID: 'hg38',
                blatDB: 'hg38',
                name: 'Human (hg38 1kg/GATK)',
                fastaURL:
                  'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome' +
                  '/GRCh38_full_analysis_set_plus_decoy_hla.fa',
                indexURL:
                  'https://1000genomes.s3.amazonaws.com/technical/reference/GRCh38_reference_genome' +
                  '/GRCh38_full_analysis_set_plus_decoy_hla.fa.fai',
                cytobandURL:
                  'https://s3.amazonaws.com/igv.org.genomes/hg38/annotations/cytoBandIdeo.txt.gz',
                tracks: [
                  {
                    name: 'Refseq Genes',
                    format: 'refgene',
                    url: 'https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz',
                    indexURL:
                      'https://s3.amazonaws.com/igv.org.genomes/hg38/ncbiRefSeq.sorted.txt.gz.tbi',
                    order: 0,
                    visibilityWindow: -1,
                    displayMode: 'EXPANDED',
                    autoHeight: true,
                    maxHeight: 160,
                  },
                ],
              },
              locus: formatLocus(variantEntity?.start, variantEntity?.chromosome, 20),
              tracks: buildTracks(results!, motherResults, fatherResults, rpt, donor!),
            }}
          />
        )
      )}
    </Modal>
  );
};

const IGVModalWrapper = (props: OwnProps) => (
  <ApolloProvider backend={GraphqlBackend.FHIR}>
    <IGVModal {...props} />
  </ApolloProvider>
);

export default IGVModalWrapper;
