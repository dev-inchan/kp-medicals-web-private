// 해당 요일이 휴일이면 true 반환
export function isDayOff(dayoff: string, dayOfWeek: number): boolean {
  // getDay()가 0이면 일요일이므로 dayoff[6]과 매칭, 나머지는 getDay() - 1
  const dayOffIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  return dayoff[dayOffIndex] === '1';
}

export function generateTimeSlots(startTime: string, endTime: string, timeSlot: number) {
  const slots = [];
  // 시작시간과 죵료시간을 시간과 분으로 분리.
  let [currentHour, currentMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // 현재 시간이 종료 시간보다 빠르거나 같을때 까지
  while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
    const time = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
    slots.push(time);

    currentMinute += timeSlot; // 분에 예약 시간 간격을 더함
    if (currentMinute >= 60) {
      // 만약 분이 60 이상이 되면
      currentHour += 1; // 시간을 1시간 증가시키고
      currentMinute -= 60; // 분에서 60을 뺌 (분을 0~59로 유지)
    }
  }

  return slots;
}
/**
 * 주어진 연도, 월, 일(day)을 사용해 YYYY-MM-DD 형식의 문자열을 반환하는 함수
 * @param year - 기준 날짜의 연도 (예: 2024)
 * @param month - 기준 날짜의 월 (0-based, 0: 1월, 11: 12월)
 * @param day - 선택된 날짜 (예: 24)
 * @returns YYYY-MM-DD 형식의 날짜 문자열
 */
export function formatDateToYYYYMMDD(day: number): string {
  const today = new Date(); // 오늘의 연도와 월 정보를 가져옴

  const year = today.getFullYear();

  const month = today.getMonth(); // 월은 0부터 시작 (0: 1월)

  const date = new Date(year, month, day);

  const yearString = date.getFullYear();

  const monthString = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1

  const dayString = String(date.getDate()).padStart(2, '0');

  return `${yearString}-${monthString}-${dayString}`;
}

// api 요청사항에 맞추기 위해 선택한 날짜를 year-month-day 형식으로 포맷
export function formatDate(date: Date): string {
  const year = date.getFullYear(); // 연도 추출
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1, 두 자리 숫자로 변환
  const day = String(date.getDate()).padStart(2, '0'); // 일자를 두 자리 숫자로 변환

  return `${year}-${month}-${day}`;
}
