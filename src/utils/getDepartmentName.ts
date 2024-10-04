import departmentData from '@/components/selectDepartment/data/department';

// 진료과목 이름 파싱
export const getDepartmentName = (departmentIds: string[]) => {
  const getNames = departmentIds.map((departmentId) => {
    const department = departmentData.find((dep) => String(dep.id) === departmentId);
    return department ? department.name : '알 수 없음';
  });

  return getNames;
};
