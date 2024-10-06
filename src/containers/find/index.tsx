'use client';
import style from './index.module.scss';
import Header from '@/components/header';

import Article from './article';
import Form from './form';
import Intro from './intro';
import { Fragment, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getHospitals } from '@/service/search';
import { OptionType } from '@/types/selectDoctor';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export default function Find() {
  const [keyword, setKeyword] = useState<string>(''); // 검색어
  const [selectDepart, setSelectDepart] = useState<OptionType | null>(null); // 진료과목
  const [searchParams, setSearchParams] = useState({ keyword: '', departmentId: 0 }); // 실제 쿼리에 사용할 검색 상태
  const searchparam = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [canFetch, setCanFetch] = useState(false); // API 호출 가능 여부

  const handleChange = (option: OptionType | null) => {
    setSelectDepart(option);
  };

  const handleSearch = () => {
    // 검색 버튼을 누르면 검색어와 선택한 진료과목 값으로 검색 상태를 업데이트
    const queryParams = new URLSearchParams();
    if (keyword && keyword.trim() !== '') {
      queryParams.append('keyword', keyword.trim());
    }

    if (selectDepart) {
      queryParams.append('department_id', String(selectDepart?.id ?? 0));
    }

    const queryString = queryParams.toString();
    const targetUrl = queryString ? `/find?${queryString}` : `/find`;

    // 페이지 리로드는 방지하고 쿼리만 업데이트
    router.replace(targetUrl);

    setSearchParams({
      keyword,
      departmentId: selectDepart?.id ?? 0, // 선택된 진료과목이 없으면 0
    });
  };

  const { ref, inView } = useInView({ threshold: 0, delay: 0 });

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading } = useInfiniteQuery({
    queryKey: ['hospitals', searchParams.keyword, searchParams.departmentId], // 검색 상태를 기반으로 쿼리 실행
    queryFn: ({ pageParam = 0 }) => getHospitals(keyword, selectDepart?.id ?? 0, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // lastPage: 가장 최근에 로드된 페이지의 데이터 pages: 지금까지 로드된 모든 페이지의 배열
      const totalLoadedHospitals = pages.flat().reduce((sum, page) => sum + page.data.hospitals.length, 0); // 로드된 총 데이터의 개수
      return lastPage.data.hospitals.length > 0 ? totalLoadedHospitals : undefined;
    },
    // enabled: !!keyword || !!searchParams.departmentId, // keyword가 있을 때만 쿼리 실행

    staleTime: 0, // fresh -> stale,
    gcTime: 300 * 1000,
  });

  useEffect(() => {
    const keyword = searchparam.get('keyword');
    const departmentId = searchparam.get('department_id');

    // URL 파라미터에서 검색어와 departmentId를 추출하여 설정
    if (keyword || departmentId) {
      setKeyword(keyword || '');
      setSearchParams({
        keyword: keyword || '',
        departmentId: departmentId ? parseInt(departmentId) : 0,
      });
    }
  }, [searchparam]);

  useEffect(() => {
    // 다음페이지가 있을때 다음페이지 요청
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);

  // searchParams가 업데이트되면 API 호출 가능하게 설정
  useEffect(() => {
    if (searchParams.keyword || searchParams.departmentId) {
      setCanFetch(true);
    }
  }, [searchParams]);

  return (
    <div style={{ overflow: 'hidden' }}>
      <Header />
      <div className={style.container}>
        <Intro />
        <div className={style.formContainer}>
          <Form
            keyword={keyword}
            setKeyword={setKeyword}
            handleChange={handleChange}
            handleSearch={handleSearch}
            selectDepart={selectDepart}
          />
        </div>
      </div>
      <main>
        <div className={style.mainContainer}>
          <div className={style.articleWrapper}>
            {isLoading ? (
              <p></p> // 로딩 중일 때 보여줌
            ) : data?.pages.some((page) => page.data.hospitals.length > 0) ? (
              data.pages.map((page, i) => (
                <Fragment key={i}>
                  {page.data.hospitals.map((hospital) => (
                    <Article key={hospital.hospital_id} hospital={hospital} />
                  ))}
                </Fragment>
              ))
            ) : (
              <div className={style.no_search_wrapper}>
                <p className={style.no_search_data}>찾는 병원이 없습니다.</p>
              </div>
            )}
            <div ref={ref} style={{ height: 50 }}></div>
          </div>
        </div>
      </main>
    </div>
  );
}
