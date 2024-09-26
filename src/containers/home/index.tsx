import '@/styles/globals.scss';

import SearchSection from './searchSection';
import TopSearched from './topSearched';
import Header from '@/components/header/index';
import Footer from './footer';
export default function Home() {
  return (
    <>
      <Header />
      <main style={{ overflow: 'hidden' }}>
        {/* 검색 section */}
        <SearchSection />
        {/* Top Searched */}
        <TopSearched />
      </main>
      <Footer />
    </>
  );
}
