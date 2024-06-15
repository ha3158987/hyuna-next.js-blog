---
title: "Next.js로 운영을 하면 생기는 일 ep.1: SSR에서 마운트 순서를 제어하면 안되는 이유"
date: "2024-05-31"
---

## 🚨 문제상황

- 100으로 올려두었던 Heath Score가 어느 새 34점으로 뚝 떨어져버렸다 <br>

![image](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/f4bc3bce-d34b-43ce-a8f1-909abfa1f163)

- 설상가상으로 슬랙 등 기타 플랫폼에서 링크 공유 시 나오던 메타 정보도 언제부터인가 보이질 않고 있었다...<br>

| BEFORE                                                                                                         | AFTER                                                                                                          |
| -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| ![image](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/cefe4d92-a0f2-4f3e-8d94-f1fa78c0ac8a) | ![image](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/3c8b6eb7-165d-47ef-84ad-d0243bb7b8f9) |

## 🔍 배경: 어떻게 된 거냐면...

Heath Score 가 100점에서 34점으로 떨어졌던 그 사이 기간에 반영되었던 모든 변경사항을 추적해보니 원인이 아래와 같이 좁혀졌다:

- 페이지 퍼포먼스를 개선 / Lazy Loading을 적용하기 위해 Suspense를 Layout에 추가 (추후 이것 또한 좀 더 지역적으로 추가했어야 했음을 알게 되었다🥲)
- 개발환경에서 Next.js hydration 에러 대거 발생
- hydration 에러 픽스를 위해 mount 시점을 state로 반환해주는 `useMounted()`라는 커스텀 훅을 만들어 `_app.tsx`에 반영해둠. 그리고 `_app.tsx`에는 헤더에 og meta 태그를 만들어주는 코드가 있었던 것!

```jsx
// useMounted.ts

import { useEffect, useState } from "react";

export const useMounted = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted;
};
```

```jsx
// _app.tsx

function App({ Component, pageProps }: AppProps) {
  const isMounted = useMounted();

 (... 생략)

  // local storage로 인한 hydration error handling
  if (!isMounted) return <></>;

  return (
    <Providers>
      <Layout>
        <OGMetas />
        <Component {...pageProps} key={router.asPath} />
        <CookieConsentBanner />
      </Layout>
      <OverlayLayout>{useVersionInfo && <VersionInfoOverlay />}</OverlayLayout>
      <OverlayBanner />
    </Providers>
  );
}

```

## 🩺 해결방법: 고쳐보자!

- 원인이 좁혀졌기 때문에 `_app.tsx`에 있던 `useMounted()` hook과 `isMounted`에 의존하던 부분을 제거했다.
- 그리고 POSTMAN에서 localhost:3000으로 GET을 요청해서 리턴받는 HTML을 비교해보았다. 제거 전 / 후 `<head>`의 og meta 태그에서 확연한 차이가 있었다:
  | BEFORE | AFTER |
  | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
  | ![image](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/5952a859-9ea4-46dd-b1e7-8750e9839c9e) | ![image](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/f15c7626-1629-4ff9-95e9-bca218f72f5a) |

  - 이전에는 보이지 않던 메타태그들이 `useMounted()` 제거 후 확실하게 보여지기 시작했다!

- 적용 후에 Health Score도 이전처럼 돌아온 걸 확인할 수 있었다:
  | BEFORE | AFTER |
  | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
  |![image](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/f4bc3bce-d34b-43ce-a8f1-909abfa1f163)|![image](https://github.com/ha3158987/hyuna-next.js-blog/assets/65105537/d720adf8-391d-4d14-9fbf-2dd0281f6595)|

## 💡 오늘의 교훈: Next.js의 pre-rendering을 막지 말 것 (WIP)

- 부끄럽지만 이번 일은 Next.js의 동작방식을 제대로 이해하지 못하고 눈앞의 에러만 해결하려다 일어난 일이었다.
- "Next.js가 SEO 특화되어 있다"라는 건 공식처럼 외우고 있으면서도 pre-rendering으로 생성하고 있던 걸 마운트 이후 시점에 생성하도록 바꾸면 SEO에 영향을 줄 수밖에 없다는 사실을 간과했었다. 마치 SSR에게 CSR과 같이 동작하라고 주문한 격.
- 즉, pre-rendering을 임의로 조정해서까지 렌더링 순서를 제어해야한다면, SSR 방식이 적절하지 않을 수 있다.
- 그래서 개발환경에서 나던 hydration 에러는 어떻게 픽스했는 지!? 는 **to be continued**...

## 📚 Reference

[https://velog.io/@kykim/Next.js-공유-미리보기-오류-CSR-SSR](https://velog.io/@kykim/Next.js-%EA%B3%B5%EC%9C%A0-%EB%AF%B8%EB%A6%AC%EB%B3%B4%EA%B8%B0-%EC%98%A4%EB%A5%98-CSR-SSR)
