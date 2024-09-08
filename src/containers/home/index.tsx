import '@/styles/globals.scss';
import Introduction from './introduction';
import SearchSection from './searchSection';
import TopSearched from './topSearched';
import Header from '@/components/header/index';

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ overflow: 'hidden' }}>
        {/* 검색 section */}
        <SearchSection />
        {/* Top Searched */}
        <TopSearched />
        <Introduction />
        <section></section>
      </main>
    </>
  );
}
