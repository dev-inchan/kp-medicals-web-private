import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { HospitalResponse, Hospital } from '@/types/hospital';

export const handlers = [
  http.get('api/medical-wallet/hospitals', ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword') || '';
    const start = Number(url.searchParams.get('start')) || 0;
    const limit = Number(url.searchParams.get('limit')) || 10;

    const hospitals: Hospital[] = Array.from({ length: 5 }, (_, index) => ({
      hospital_id: index + 1,
      hospital_name: faker.company.name() + ' 병원',
      icon: `https://loremflickr.com/640/480/hospital?random=${index}`,
      location: faker.address.streetAddress(),
      department_id: Array.from({ length: 2 }, () => faker.datatype.number({ min: 1, max: 10 }).toString()),
      start_time: '09:00',
      end_time: '24:00',
    }));

    const response: HospitalResponse = {
      status: 200,
      success: 'success',
      message: 'searched hospitals',
      data: {
        hospitals,
        error_code: -1,
        error_stack: '',
      },
    };

    return HttpResponse.json(response);
  }),
];
