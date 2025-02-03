/* eslint-disable max-len */
import intl from 'react-intl-universal';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import { Checkbox, Form, Modal, Select, Typography } from 'antd';

import { useAppDispatch } from 'store';
import { useGlobals } from 'store/global';
import { usePrescriptionForm } from 'store/prescription';
import { isMuscularAnalysisAndNotGlobal } from 'store/prescription/helper';
import { prescriptionFormActions } from 'store/prescription/slice';
import { fetchFormConfig } from 'store/prescription/thunk';
import { MuscularAnalysisType, OtherAnalysisType } from 'store/prescription/types';

import { defaultFormItemsRules } from '../Analysis/AnalysisForm/ReusableSteps/constant';

import styles from './index.module.css';

const { Text, Link } = Typography;

export enum ANALYSIS_CHOICE_FI_KEY {
  ANALYSIS_TYPE = 'analysis_type',
  ANALYSE_REFLEX = 'analyse_reflex',
}

const AnalysisChoiceModal = () => {
  const dispatch = useAppDispatch();
  const { getAnalysisNameByCode } = useGlobals();
  const [form] = Form.useForm();
  const { analysisChoiceModalVisible, formState } = usePrescriptionForm();

  return (
    <Modal
      title={intl.get('prescription.analysis.choici.modal.title')}
      data-cy="AnalysisModal"
      open={analysisChoiceModalVisible}
      onCancel={() => {
        dispatch(prescriptionFormActions.cancel());
        form.resetFields();
      }}
      okText={intl.get('prescription.analysis.choici.modal.start')}
      destroyOnClose
      okButtonProps={{ loading: formState.isLoadingConfig }}
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={(value) => {
          dispatch(
            fetchFormConfig({
              code: value[ANALYSIS_CHOICE_FI_KEY.ANALYSIS_TYPE],
            }),
          )
            .unwrap()
            .then(() => {
              dispatch(
                prescriptionFormActions.completeAnalysisChoice({
                  type: value[ANALYSIS_CHOICE_FI_KEY.ANALYSIS_TYPE],
                  extraData: {
                    isReflex: value[ANALYSIS_CHOICE_FI_KEY.ANALYSE_REFLEX],
                  },
                }),
              );
              form.resetFields();
            });
        }}
        validateMessages={{
          required: intl.get('this.field.is.required'),
        }}
        layout="vertical"
      >
        <Form.Item
          label={
            <ProLabel title={intl.get('prescription.analysis.choici.modal.select.panel')} colon />
          }
          name={ANALYSIS_CHOICE_FI_KEY.ANALYSIS_TYPE}
          rules={defaultFormItemsRules}
          className="noMarginBtm"
        >
          <Select placeholder="Sélectionner" data-cy="SelectAnalysis">
            <Select.Option value={OtherAnalysisType.GLOBAL_DEVELOPMENTAL_DELAY} title={null}>
              {getAnalysisNameByCode(OtherAnalysisType.GLOBAL_DEVELOPMENTAL_DELAY, false)}
            </Select.Option>
            <Select.Option value={OtherAnalysisType.NUCLEAR_MITOCHONDRIOPATHY} title={null}>
              {getAnalysisNameByCode(OtherAnalysisType.NUCLEAR_MITOCHONDRIOPATHY, false)}
            </Select.Option>
            <Select.OptGroup label="Maladies musculaires">
              <Select.Option
                value={MuscularAnalysisType.MUSCULAR_DISEASE_GLOBAL}
                data-cy={`SelectOption${MuscularAnalysisType.MUSCULAR_DISEASE_GLOBAL}`}
                title={null}
              >
                {getAnalysisNameByCode(MuscularAnalysisType.MUSCULAR_DISEASE_GLOBAL, false)}
              </Select.Option>
              <Select.Option value={MuscularAnalysisType.MUSCULAR_DISEASE_DYSTROPHIES} title={null}>
                {getAnalysisNameByCode(MuscularAnalysisType.MUSCULAR_DISEASE_DYSTROPHIES, false)}
              </Select.Option>
              <Select.Option
                value={MuscularAnalysisType.MUSCULAR_DISEASE_MALIGNANT_HYPERTHERMIA}
                title={null}
              >
                {getAnalysisNameByCode(
                  MuscularAnalysisType.MUSCULAR_DISEASE_MALIGNANT_HYPERTHERMIA,
                  false,
                )}
              </Select.Option>
              <Select.Option
                value={MuscularAnalysisType.MUSCULAR_DISEASE_CONGENITAL_MYASTHENIA}
                title={null}
              >
                {getAnalysisNameByCode(
                  MuscularAnalysisType.MUSCULAR_DISEASE_CONGENITAL_MYASTHENIA,
                  false,
                )}
              </Select.Option>
              <Select.Option
                value={MuscularAnalysisType.MUSCULAR_DISEASE_CONGENITAL_MYOPATHIES}
                title={null}
              >
                {getAnalysisNameByCode(
                  MuscularAnalysisType.MUSCULAR_DISEASE_CONGENITAL_MYOPATHIES,
                  false,
                )}
              </Select.Option>
              <Select.Option
                value={MuscularAnalysisType.MUSCULAR_DISEASE_RHABDOMYOLYSIS}
                title={null}
              >
                {getAnalysisNameByCode(MuscularAnalysisType.MUSCULAR_DISEASE_RHABDOMYOLYSIS, false)}
              </Select.Option>
            </Select.OptGroup>
          </Select>
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            isMuscularAnalysisAndNotGlobal(getFieldValue(ANALYSIS_CHOICE_FI_KEY.ANALYSIS_TYPE)) ? (
              <Form.Item
                name={ANALYSIS_CHOICE_FI_KEY.ANALYSE_REFLEX}
                valuePropName="checked"
                className="marginTop noMarginBtm"
              >
                <Checkbox>
                  {intl.get('prescription.analysis.choici.modal.analysis.globel.panel.checkbox')}
                </Checkbox>
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {({ getFieldValue }) =>
            getFieldValue(ANALYSIS_CHOICE_FI_KEY.ANALYSIS_TYPE) ? (
              <Form.Item className="marginTop noMarginBtm">
                <Text className={styles.recommandationColor}>
                  {intl.get('prescription.analysis.choici.modal.consult.algo.1')}{' '}
                  <Link
                    href="https://www.chusj.org/fr/soins-services/L/Laboratoires/Analyses-genomiques-(SNG)-du-Reseau-quebecois-de-d"
                    target="_blank"
                  >
                    {intl.get('prescription.analysis.choici.modal.consult.algo.2')}
                  </Link>
                  {intl.get('prescription.analysis.choici.modal.consult.algo.3')}
                </Text>
              </Form.Item>
            ) : null
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AnalysisChoiceModal;
