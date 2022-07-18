// default는 반드시 포함되어야 함.
// url: http://localhost:3000/posts/first-post
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/layout';
// import Script from 'next/script';


export default function FirstPost() {
  return (
    <Layout>
      <Head>
        {/** 브라우저 tab 위에 생기는 이름 */}
        <title>첫번째 포스팅</title>
      </Head>
      {/* <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      /> */}
      <h1>First Post</h1>
      <h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </h2>
    </Layout>
  );
}