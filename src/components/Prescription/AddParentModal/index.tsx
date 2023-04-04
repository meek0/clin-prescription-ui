import { useState } from 'react';
import intl from 'react-intl-universal';
import { useDispatch } from 'react-redux';
import ProLabel from '@ferlab/ui/core/components/ProLabel';
import GridCard from '@ferlab/ui/core/view/v2/GridCard';
import { AutoComplete, Form, Modal, Select, Typography } from 'antd';

import SelectItem from 'components/uiKit/select/SelectItem';
import { usePrescriptionForm } from 'store/prescription';
import { prescriptionFormActions } from 'store/prescription/slice';

import { defaultFormItemsRules, STEPS_ID } from '../Analysis/AnalysisForm/ReusableSteps/constant';

import PrescriptionSummary from './PrescriptionSummary';

import styles from './index.module.scss';

export enum ADD_PARENT_FI_KEY {
  PRESCRIPTION_SEARCH_TERM = 'prescription_search_term',
  PARENT_RELATION = 'parent_relation',
}

const { Text } = Typography;

const AddParentModal = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [selectedPrescription, setSelectedPrescription] = useState(undefined);
  const { addParentModalVisible } = usePrescriptionForm();

  const onDone = () => {
    form.resetFields();
    setSelectedPrescription(undefined);
  };

  return (
    <Modal
      title={intl.get('prescription.add.parent.modal.title')}
      visible={addParentModalVisible}
      onCancel={() => {
        dispatch(prescriptionFormActions.cancel());
        onDone();
      }}
      okText={intl.get('prescription.add.parent.modal.start')}
      destroyOnClose
      onOk={() => form.submit()}
    >
      <Form
        form={form}
        onFinish={(value) => {
          onDone();
          dispatch(
            prescriptionFormActions.completeAddParentChoice({
              selectedAnalysis: {},
              stepId: value[ADD_PARENT_FI_KEY.PARENT_RELATION],
            }),
          );
        }}
        validateMessages={{
          required: intl.get('this.field.is.required'),
        }}
        layout="vertical"
      >
        <Form.Item
          label={
            <ProLabel title={intl.get('prescription.add.parent.modal.search.placeholder')} colon />
          }
          name={ADD_PARENT_FI_KEY.PRESCRIPTION_SEARCH_TERM}
          rules={defaultFormItemsRules}
          className="noMarginBtm"
          required
        >
          <AutoComplete
            placeholder="RAMQ, SR111111"
            allowClear
            onChange={(value) => {
              if (!value) {
                setSelectedPrescription(undefined);
              }
            }}
            onClear={() => {
              setSelectedPrescription(undefined);
            }}
            onSelect={(value: any) => {
              setSelectedPrescription(value);
            }}
            options={[
              {
                label: (
                  <SelectItem
                    title={
                      <Text strong>Retard global de développement / Déficience intellectuelle</Text>
                    }
                    caption="SR769810 (2022-02-26) — ROY Léon (ROYL 1234 5678)"
                  />
                ),
                value: 'SR769810',
              },
            ]}
          />
        </Form.Item>
        <Form.Item noStyle shouldUpdate>
          {() =>
            selectedPrescription ? (
              <>
                <Form.Item className="marginTop">
                  <GridCard
                    content={<PrescriptionSummary className={styles.prescriptionDescWrapper} />}
                    theme="shade"
                  />
                </Form.Item>
                <Form.Item
                  name={ADD_PARENT_FI_KEY.PARENT_RELATION}
                  label={
                    <ProLabel
                      title={intl.get('prescription.add.parent.modal.parent.relation')}
                      colon
                    />
                  }
                  rules={defaultFormItemsRules}
                  required
                  className="noMarginBtm"
                >
                  <Select
                    placeholder={intl.get('prescription.add.parent.modal.select')}
                    options={[
                      {
                        label: intl.get('FTH'),
                        value: STEPS_ID.FATHER_IDENTIFICATION,
                      },
                      {
                        label: intl.get('MTH'),
                        value: STEPS_ID.MOTHER_IDENTIFICATION,
                      },
                    ]}
                  />
                </Form.Item>
              </>
            ) : null
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddParentModal;
