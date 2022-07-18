import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import utilStyles from '../styles/utils.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{"Hyuna's Log"}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>안녕하세요, 소소하게 오래 개발하고 싶은 개발자입니다.</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
    </Layout>
  );
}