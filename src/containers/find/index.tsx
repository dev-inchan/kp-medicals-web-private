'use client';
import style from './index.module.scss';
import Header from '@/components/header';

import Article from './article';
import Form from './form';
import Intro from './intro';
import { Fragment, useEffect, useState } from 'react';
import { Hospital } from '@/types/hospital';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getHospitals } from '@/service/search';

export default function Find() {
  // const [hospitals, setHospitals] = useState<Hospital[]>([]);

  const [keyword, setKeyword] = useState<string>('');
  const { ref, inView } = useInView({ threshold: 0, delay: 0 });

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['posts', 'recommends'],
    queryFn: ({ pageParam = 0 }) => getHospitals(keyword, pageParam, 10),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      // lastPage: 가장 최근에 로드된 페이지의 데이터 pages: 지금까지 로드된 모든 페이지의 배열
      const totalLoadedHospitals = pages.flat().reduce((sum, page) => sum + page.data.hospitals.length, 0); // 로드된 총 데이터의 개수
      return lastPage.data.hospitals.length > 0 ? totalLoadedHospitals : undefined;
    },
    enabled: !!keyword, // keyword가 있을 때만 쿼리 실행
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  useEffect(() => {
    // 다음페이지가 있을때 다음페이지 요청
    if (inView && !isFetching && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetching, fetchNextPage]);
  return (
    <>
      <Header />
      <div className={style.container}>
        <Intro />
        <div className={style.formContainer}>
          {/* <Form setInitialHospitals={setHospitals} setKeyword={setKeyword} /> */}
          <Form setKeyword={setKeyword} />
        </div>
      </div>
      <main>
        <div className={style.mainContainer}>
          <div className={style.articleWrapper}>
            {data?.pages.map((page, i) => {
              console.log(page);
              console.log(i);
              return (
                <Fragment key={i}>
                  {page.data.hospitals.map((hospital) => (
                    <Article key={hospital.hospital_id} hospital={hospital} />
                  ))}
                </Fragment>
              );
            })}
            <div ref={ref} style={{ height: 50 }}></div>
          </div>
        </div>
      </main>
    </>
  );
}
