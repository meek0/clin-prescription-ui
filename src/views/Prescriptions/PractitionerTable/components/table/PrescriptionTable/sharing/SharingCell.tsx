import { useEffect, useState } from 'react';
import intl from 'react-intl-universal';
import { getPractitionnerName } from '@ferlab/ui/core/components/Assignments/AssignmentsFilter';
import AssignmentSelect from '@ferlab/ui/core/components/Assignments/AssignmentsSelect';
import { AssignmentsTag } from '@ferlab/ui/core/components/Assignments/AssignmentsTag';
import { UnAssignAvatar } from '@ferlab/ui/core/components/Assignments/AssignmentsTag/UnsassignAvatar';
import { TPractitionnerInfo } from '@ferlab/ui/core/components/Assignments/types';
import UserAvatar from '@ferlab/ui/core/components/UserAvatar';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Avatar, Button, Popover, Space, Tooltip, Typography } from 'antd';
import { PrescriptionFormApi } from 'api/form';
import { AnalysisResult } from 'graphql/prescriptions/models/Prescription';

import { Roles, validate } from 'components/Roles/Rules';
import { useRpt } from 'hooks/useRpt';
import { getShareDictionary } from 'utils/translation';

import styles from './index.module.css';

export type TAssignmentsCell = {
  results: AnalysisResult;
  list?: TPractitionnerInfo[];
};

export type TAssignmentsData = {
  analysis_id: string;
  assignments: string[];
};

const userPopOverContent = (userInfos: TPractitionnerInfo[]) =>
  userInfos.map((ui) => (
    <StackLayout vertical={true} key={ui.practitionerRoles_Id}>
      <AssignmentsTag
        background={false}
        email={ui.email ? ui.email : ''}
        name={getPractitionnerName(ui.name)}
        organization={ui.ldm}
        showLdm={false}
      />
      <Button
        onClick={(event) => {
          event.stopPropagation();
          window.location.href = `mailto:${ui.email ? ui.email : ''}`;
        }}
        className={styles.emailLink}
        type="link"
        size="small"
      >
        <Typography.Text
          className={styles.emailTextGroup}
          copyable={{
            tooltips: [
              intl.get('assignment.popOver.copy.tooltip'),
              intl.get('assignment.popOver.copy.tooltip.copied'),
            ],
            text: ui.email ? ui.email : '',
          }}
          type="secondary"
        >
          <span className={styles.emailText}>{ui.email ? ui.email : ''}</span>
        </Typography.Text>
      </Button>
    </StackLayout>
  ));

const renderAvatarGroup = (selectedInfoList: TPractitionnerInfo[]) => {
  const shareCount = selectedInfoList.length;
  const result: React.ReactNode[] = selectedInfoList.reduce(
    (acc: React.ReactNode[], item, index) => {
      if (index <= 1) {
        const element = (
          <Popover
            trigger="hover"
            key={item.practitionerRoles_Id}
            overlayClassName={styles.userPopOverContent}
            content={
              index <= 1 ? (
                shareCount > 2 && index === 1 ? (
                  <Space size={8} direction="vertical">
                    {userPopOverContent(selectedInfoList.slice(1))}
                  </Space>
                ) : (
                  userPopOverContent([item])
                )
              ) : null
            }
          >
            {shareCount > 2 && index === 1 ? (
              <Avatar className={styles.moresharing} size={24}>
                {`+${shareCount - 1}`}
              </Avatar>
            ) : (
              <div>
                <UserAvatar
                  className={
                    index === 1 ? `${styles.outlineAvatar} ${styles.userAvatar}` : styles.userAvatar
                  }
                  size={24}
                  userName={getPractitionnerName(item.name)}
                />
              </div>
            )}
          </Popover>
        );
        acc.push(element);
      }
      return acc;
    },
    [],
  );
  return <div className={styles.sharingCell}>{result}</div>;
};

export const SharingCell = ({ results, list }: TAssignmentsCell): React.ReactElement => {
  const { decodedRpt } = useRpt();
  const filterSecurityTag = results.security_tags.reduce((securityTags: string[], s: string) => {
    if (s.includes('PractitionerRole')) securityTags.push(s.split('/')[1]);
    return securityTags;
  }, []);
  const [practitionerInfoList, setPractitionerInfoList] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSharing, setSelectedSharing] = useState<string[]>(filterSecurityTag);
  const [loadingSelect, setLoadingSelect] = useState<boolean>();
  const handleSelect = (practitionerRoles_ids: string[]) => {
    if (practitionerRoles_ids?.sort().toString() !== selectedSharing?.sort().toString()) {
      setLoadingSelect(true);
      PrescriptionFormApi.prescriptionShare(results.prescription_id, practitionerRoles_ids)
        .then(({ data }) => {
          setSelectedSharing(data?.roles || []);
        })
        .finally(() => {
          setLoadingSelect(false);
        });
    }
  };
  useEffect(() => {
    if (list) {
      const filteredList = list.filter(
        (l) => l.ldm === results.ep && l.practitionerRoles_Id !== results.requester,
      );
      setPractitionerInfoList(filteredList);
    }
  }, [list, decodedRpt]);

  const canShare = decodedRpt ? validate([Roles.Variants], decodedRpt, false) : false;
  const selectedInfoList = list?.filter((r) => selectedSharing?.includes(r.practitionerRoles_Id));

  const content = (
    <AssignmentSelect
      dictionary={getShareDictionary()}
      options={practitionerInfoList}
      handleSelect={handleSelect}
      assignedPractionnerRoles={selectedSharing}
      visibleOptions={true}
      loading={loadingSelect}
      showLdm={false}
      userIdToRemove={decodedRpt?.fhir_practitioner_id}
    />
  );
  return (
    <Space>
      <Popover
        overlayClassName={styles.sharingPopOver}
        placement="bottomLeft"
        trigger="click"
        content={content}
        open={open}
        onOpenChange={(open: boolean) => setOpen(open)}
        destroyTooltipOnHide
      >
        {selectedSharing.length > 0 ? (
          <div>
            <Space direction="horizontal">
              {selectedSharing.length > 0 && renderAvatarGroup(selectedInfoList || [])}
            </Space>
          </div>
        ) : (
          <Tooltip
            title={canShare ? intl.get('sharing.tooltip') : intl.get('assignment.tooltip.disable')}
            placement="top"
          >
            <div className={styles.unAssignAvatar}>
              <UnAssignAvatar canAssign={canShare} />
            </div>
          </Tooltip>
        )}
      </Popover>
    </Space>
  );
};

export default SharingCell;
