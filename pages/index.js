import Head from "next/head";
import Link from "next/link";
import Date from "../components/date";
import Layout from "../components/layout";
import utilStyles from "../styles/utils.module.css";
import { getSortedPostsData } from "../lib/posts";
import React from "react";
import styled from "@emotion/styled";

// server-side에서만 동작 (JS 번들링에 포함되지 않음)
// getStaticProps: page디렉토리 안에서만 실행
export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{"Dico's Log"}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <MainDescription>
          안녕하세요, 소소하게 오래 개발하고 싶은 Dico 입니다.
        </MainDescription>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Posts</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <React.Fragment key={id}>
              <hr className={utilStyles.listBorder} />
              <li className={utilStyles.listItem} key={id}>
                <Link href={`${process.env.assetPrefix}/posts/${id}`}>
                  <a>{title}</a>
                </Link>
                <br />
                <small className={utilStyles.lightText}>
                  <Date dateString={date} />
                </small>
              </li>
            </React.Fragment>
          ))}
        </ul>
      </section>
    </Layout>
  );
}

const MainDescription = styled.div`
  color: #888888;
  font-size: 18px;
  text-align: center;
  margin-bottom: 30px;
`;
