import { StylesConfig } from 'react-select';
import { OptionType } from '@/types/selectDoctor';

export const customStyles: StylesConfig<OptionType, false> = {
  control: (provided) => ({
    ...provided,
    border: 'none', // 테두리 제거
    boxShadow: 'none', // 포커스 시 그림자 제거
    width: '100%', // 고정된 넓이로 설정
  }),
  indicatorSeparator: () => ({
    display: 'none', // 세로 구분선 (|) 제거
  }),
  dropdownIndicator: () => ({
    display: 'none', // 아래 화살표 제거
  }),
};
