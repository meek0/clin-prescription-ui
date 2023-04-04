import { CalendarOutlined } from '@ant-design/icons';
import { MaskedInput } from 'antd-mask-input';
import { MaskedInputProps } from 'antd-mask-input/build/main/lib/MaskedInput';
import { MaskedRange } from 'imask';

import { useLang } from 'store/global';
import { LANG } from 'utils/constants';

const MASK = 'yyyy / mm / dd';
const MASKFR = 'aaaa / mm / jj';
export const INPUT_DATE_OUTPUT_FORMAT = 'yyyy-MM-dd';

const MaskedDateInput = (props: Omit<MaskedInputProps, 'mask'>) => {
  const lang = useLang();
  const isFr = lang === LANG.FR;
  const mask = isFr ? MASKFR : MASK;

  return (
    <MaskedInput
      {...props}
      style={{ ...props.style, width: props.style?.width ?? 150 }}
      placeholder={mask}
      mask={mask}
      onChange={(e) => {
        e.unmaskedValue = e.maskedValue.replace(/\s/g, '').replaceAll('/', '-');
        props.onChange && props.onChange(e);
      }}
      maskOptions={{
        blocks: {
          [isFr ? 'aaaa' : 'yyyy']: {
            mask: '0000',
            placeholderChar: isFr ? 'a' : 'y',
          },
          mm: {
            mask: MaskedRange,
            from: 1,
            to: 12,
            placeholderChar: 'm',
          },

          [isFr ? 'jj' : 'dd']: {
            mask: MaskedRange,
            from: 1,
            to: 31,
            placeholderChar: isFr ? 'j' : 'd',
          },
        },
      }}
      suffix={<CalendarOutlined />}
    />
  );
};

export default MaskedDateInput;
