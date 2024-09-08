import departmentData from '@/components/selectDepartment/data/department';

export const getDepartmentName = (departmentIds: string[]) => {
  const getNames = departmentIds.map((departmentId) => {
    const department = departmentData.find((dep) => String(dep.id) === departmentId);
    return department ? department.name : '알 수 없음';
  });

  console.log('getname :', getNames);
  return getNames;
};
