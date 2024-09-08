// components/SelectDoctor.tsx
'use client';

import Select from 'react-select';
import departmentData from './data/department';
import { customStyles } from './customStyles';
import { OptionType } from '@/types/selectDoctor';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Props {
  handleChange: (option: OptionType | null) => void;
}

const options: OptionType[] = departmentData.map((item) => ({
  id: item.id,
  name: item.name,
  value: item.value,
  label: item.label,
}));

const SELECT_DEPARTMENT = '진료과목을 선택하세요';

const selectDepartment = ({ handleChange }: Props) => {
  // 선택한 진료과목
  const [selectedDepartment, setSelectedDepartment] = useState<OptionType | null>(null);

  // URL 파라미터 값 가져옴
  const searchParams = useSearchParams();
  const departmentParam = searchParams.get('department_id');

  useEffect(() => {
    if (departmentParam) {
      // 'department' 파라미터가 존재할 경우, 해당 값을 사용하여 옵션을 설정
      const selected = options.find((option) => String(option.id) === departmentParam);
      if (selected) {
        setSelectedDepartment(selected);
        handleChange(selected); // 선택값을 handleChange로 전달
      }
    }
  }, []);

  const handleChangeOption = (option: OptionType | null) => {
    setSelectedDepartment(option);
    handleChange(option); // 선택값을 handleChange로 전달
  };

  return (
    <Select
      options={options}
      styles={customStyles}
      placeholder={SELECT_DEPARTMENT}
      isSearchable={false}
      onChange={handleChangeOption}
      value={selectedDepartment}
    />
  );
};

export default selectDepartment;
