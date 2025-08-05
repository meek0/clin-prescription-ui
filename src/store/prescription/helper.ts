import { AnalysisType, MuscularAnalysisType, SoloAnalysisType, TrioAnalysisType } from 'store/prescription/types';

export const isMuscularAnalysis = (analysis: AnalysisType) =>
  Object.values(MuscularAnalysisType).includes(analysis as MuscularAnalysisType);

export const isMuscularAnalysisAndNotGlobal = (analysis: AnalysisType) =>
  isMuscularAnalysis(analysis) &&
  (analysis as MuscularAnalysisType) !== MuscularAnalysisType.MUSCULAR_DISEASE_GLOBAL;

export const isSoloAnalysis = (analysis: AnalysisType) =>
  Object.values(SoloAnalysisType).includes(analysis as SoloAnalysisType);
export const isTrioAnalysis = (analysis: AnalysisType) =>
  Object.values(TrioAnalysisType).includes(analysis as TrioAnalysisType);