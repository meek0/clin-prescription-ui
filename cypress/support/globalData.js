const globalData = {
  presc_EP_CHUSJ_LDM_CHUSJ: {
    mrnProb: 'MRN-283773',
    stampDate: 'willBeSetByFetchFhirValues',
    prescriptionId: 'willBeSetByFetchFhirValues',
    patientProbId: 'willBeSetByFetchFhirValues',
    firstNameProb: 'Jacob',
    lastNameProb: 'CHAMPAGNE',
    ramqProb: 'CHAJ 1202 0376',
    birthdayProb: '2012-02-03',
    genderProb: 'Masculin',
    bioAnalProbId: 'willBeSetByFetchFhirValues',
    requestProbId: 'willBeSetByFetchFhirValues',
    sampleProbId: 'NA24835_A',
    aliquotProbId: '16774',
    patientMthId: 'willBeSetByFetchFhirValues',
    mrnMth: 'MRN-283774',
    requestMthId: 'willBeSetByFetchFhirValues',
    ramqMth: 'MORL 7051 3037',
    firstNameMth: 'Lea',
    lastNameMth: 'MORIN',
    birthdayMth: '1970-01-30',
    statusMth: 'Non atteint',
    sampleMthId: 'na24143_a',
    patientFthId: 'willBeSetByFetchFhirValues',
    mrnFth: 'MRN-283775',
    bioAnalFthId: 'willBeSetByFetchFhirValues',
    requestFthId: 'willBeSetByFetchFhirValues',
    ramqFth: 'CHAT 7303 2326',
    firstNameFth: 'Thomas',
    lastNameFth: 'CHAMPAGNE',
    birthdayFth: '1973-03-23',
    statusFth: 'Non atteint',
    sampleFthId: 'NA24149_A',
  },
  presc_EP_CUSM_LDM_CHUSJ: {
    mrnProb: 'MRN-283824',
    prescriptionId: 'willBeSetByFetchFhirValues',
    patientProbId: 'willBeSetByFetchFhirValues',
    firstNameProb: 'Henri',
  },
  presc_EP_CUSM_LDM_CUSM: {
    mrnProb: 'MRN-283897',
    prescriptionId: 'willBeSetByFetchFhirValues',
    patientProbId: 'willBeSetByFetchFhirValues',
    firstNameProb: 'Maya',
  },
  presc_EP_CHUS_LDM_CHUS: {
    mrnProb: 'MRN-283834',
    prescriptionId: 'willBeSetByFetchFhirValues',
    patientProbId: 'willBeSetByFetchFhirValues',
    firstNameProb: 'Tristan',
  },
};

function getGlobalData() {
  return globalData;
}

export default {
  getGlobalData,
};
