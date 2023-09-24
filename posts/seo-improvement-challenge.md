---
title: "SEO Health Score 올리기 챌린지"
date: "2023-09-17"
---

## 배경

**비상!!!!!** 😱

<br>
마케팅 팀으로부터 스틱페이의 SEO 점수가 저조하다는 리포트를 받았다. <br>
Ahrefs SEO 툴로 확인해본 SEO 점수는 12점으로 가히 참담한 수준이었다... <br>

![image-1](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/643e2487-41ae-42ff-911c-dfe0c32c6207)

![image-2](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/9d9d2191-d1e2-4a5a-bffd-c1f1184a381a)

![image-3](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/677b3128-7649-4206-8980-bef2e9519d28)

다행히 Ahrefs에서 무엇이 개선되어야 하는지도 가이드라인을 주고 있어서 하나씩 해결해가며 점수를 올려보기로 했다 💪

## 해결방법

### 1. sitemap 수정 (12 ➡️ 41)

기존에 만들어둔 sitemap은 News 메뉴 하위의 페이지들과 크게 두개로
스틱페이 '[News 페이지](https://sticpay.com/ko-KR/news/news_list)' 하위에 있는 expo, blog 페이지들은 작성된 지 상당기간 지나 유효하지 않은 internal link들이 많았다. <br> 그러나 모든 게시글들을 확인하며 유효하지 않은 링크들을 삭제하는 것은 무모한 짓을 뿐더러 리소스도 충분하지 않았다........ 결국 News 페이지를 제외한 sitemap을 생성하기로 했다. <br>

![image-4](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/4177cb36-25ae-457a-bda3-07026f053cb7)

점수는 41점으로 향상되었지만 여전히 아래 이슈들이 보여졌다.

![image-5](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/30ccb04a-d809-4526-9c79-56339997e7f5)

### 2. robots.txt에서 Allow 와 Disallow 명시적으로 표시 (41 ➡️ 63)

Google Search Console 또한 좋은 힌트가 되었다. <br>

![image-7](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/f01318ed-93a6-49c5-85cb-7df925a3fdf8)

robots.txt 파일에서 현재 크롤링 되어서는 안되는 페이지나 더이상 쓰이지 않는 페이지들을 Disallow로 선언해주었다. <br>

```
User-agent: *

Allow: /
Allow: /about_sticpay/
Allow: /open_account/merchant-fast-track/

Disallow: /about/
Disallow: /mail_template/
Disallow: /mail_sender/
Disallow: /news/*
Disallow: /open_account/merchant/
Disallow: /stic_card/
Disallow: /support/
Disallow: /merchant/
Disallow: /partners/

```

수정된 파일을 적용하자 63점까지 Health Score가 향상되었다.
![image-8](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/9c376259-90b4-4ece-8b64-11ce5d328228)

### 3. Double slash in URL 컨텐츠 수정 (63 ➡️ 68)

- Orphan page (has no incoming internal links)

news 페이지는 admin에서 잘못된 링크를 수정하거나, robots.txt에 new_list 링크를 disallow로 추가하는 등 위 이슈에 대해 추가 핸들링을 진행하니 5점이 추가로 향상되었다.

![image-9](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/0230d313-3e01-4b1e-ab35-d8eb9b4de512)

### 4. Missing reciprocal hreflang (no return-tag)

추가로 hreflang 태그로 감싸진 그룹의 모든 페이지가 동일한 x-default 태그를 갖고 있도록 수정했다.

![image-10](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/d697b6b9-78f7-4105-a2f0-28c0102374e9)

**BEFORE**
![image-11](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/3e24ae82-6e29-497c-8f64-8cfb21253dc8)

**AFTER**
![image-12](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/c0acbed0-36ee-4f54-8bf8-8fa441fc687a)

```
const NextSeo = ({ path, lang }: NextSeoProps) => {
  const reciprocal = [{ hrefLang: 'x-default', href: `${BASEURL}/${path}` }];
  const alternatedLang = supportedLngs
    .map((lang) => {
      return { hrefLang: lang, href: href(path, lang) };
    })
    .filter((alternate) => alternate.hrefLang !== lang);

  return <Seo canonical={href(path, lang)} languageAlternates={[...reciprocal, ...alternatedLang]} />;
};

```

### 5. 400, 4xx 페이지 링크 수정

URL에 중복된 부분이 있는 링크의 경우 중복부분을 삭제하는 작업을 진행했다.
![image-13](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/a93950a9-ef81-44af-b4f9-f4c7d1290990)

![image-14](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/c8b6480c-85cf-40f1-a276-6e76cb656e13)

### 6. Canonical URL has no incoming internal links

![image-15](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/6fc4a24f-5e27-4247-86d5-8d43b98072bb)

support 페이지는 아래 스크린샷처럼 하위에 탭이 있어서 항상 쿼리스트링으로 탭 이름까지 물고 들어올 수 밖에 없다. 즉, https://sticpay.com/support 로 진입하는 링크가 웹 안에 존재하지 않는다는 뜻이다. (/support?tab=customer로 바로 진입) 이로 인해 incoming internal links 오류가 나고 있었다. <br>
support 페이지를 들어갈 수 없도록 만들고, sitemap.xml 에서 support를 제거, support?tab=customer support?tab=faq를 추가했다.

![image-16](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/1db91d04-0f5e-4248-80f4-ec9a0eee84bb)

```
// Support/index.tsx
  useEffect(() => {
    const tab = router.query.tab;
    if (!tab) router.replace(`/support?tab=customer`);

    if (tab === 'faq') {
      setKey('faq');
    } else {
      setKey('customer');
    }
  }, [router.query.tab]);


... 생략

  return (
    <>
      <NextSeo path={`support?tab=${key}`} lang={i18n.language} />
      <Wrapper>
      ...
    </>
  )

```

## 결과

### 1. 키워드 검색 노출이 향상되면서 특정 페이지의 진입률이 폭발적으로 증가했다!!

![image-17](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/e8c53fdf-e756-4adb-b4bb-da69cdf2063b)

![image-18](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/d9d7091f-fcf6-40c7-8af7-08622e9a1d15)

마케팅 팀에서 확인해준 바로는 SEO개선으로 인해 키워드 검색이 잘 노출되어서 진입한 사용자가 늘어난 것으로 보여진다.

![image-19](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/039ca711-b191-4943-a035-fdee1015d149)

실제로 해당 키워드로 구글 검색 시 가장 상위에 스틱페이 페이지가 노출되는 것을 확인할 수 있었다!

![image-20](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/babe9d7d-5181-4f8b-9c26-fce982041a88)

### 2. Health Score가 큰 폭으로 향상되었다! (12 ➡️ 74)

12점이었던 Health Score가 최종적으로 74점까지 향상되었다 👍
