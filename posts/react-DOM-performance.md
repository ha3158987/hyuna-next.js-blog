---
title: "Lighthouse로 측정한 React DOM 최적화"
date: "2022-08-22"
---

## 뉴스룸 페이지

[![images/newsroom-before.mov]()](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d0747dc9-5e28-4ba4-ae02-7497137643f7/%ED%99%94%EB%A9%B4_%EA%B8%B0%EB%A1%9D_2022-07-06_%EC%98%A4%ED%9B%84_6.57.55_%282%29.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220824%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220824T094358Z&X-Amz-Expires=86400&X-Amz-Signature=5d15677e84afa6e7da7b54744a4b0b53d9cda450ad4808636d4577ec91632345&X-Amz-SignedHeaders=host&x-id=GetObject)

### 1. 메인뉴스와 컨텐츠 컴포넌트 분리

- `MainDisplayArticle`컴포넌트 → `MainDisplayCarousel` & `NewsArticleList`컴포넌트로 분리
- 메인뉴스캐로셀과 하위의 기사리스트를 분리해서 기존에 둘 중 하나가 변경되면 같이 리렌더링 되던 문제를 해결. 각각의 컴포넌트가 독립적으로 렌더링되게 함.

### 2. 하위 컴포넌트 React.memo 적용

> 컴포넌트가 `React.memo()`로 래핑될 때, React는 컴포넌트를 렌더링하고 결과를 메모이징(memoizing)한다. 그리고 다음 렌더링이 일어날 때 `props`가 같다면 React는 메모이징된 내용을 재사용한다.
> 메모이징 한 결과를 재사용함으로써, React에서 리렌더링을 할 떄 가상 DOM에서 달라진 부분을 확인하지 않기 떄문에 성능상의 이점을 누릴 수 있다.

- Toast UI ‘[React.memo() 현명하게 사용하기](https://ui.toast.com/weekly-pick/ko_20190731)’
  >

```jsx
// 부모 컴포넌트
import { MemoizedCategoryList } from 'pages/NewsRoom/CategoryList';
import { MemoizedSwitchSectionBtns } from 'pages/NewsRoom/SwitchSectionBtns';

const NewsArticleList = () => {
	return (
		<ContentContainer>
			<MemoizedCategoryList selected={category} handleClick={handleCategoryChange} />
			<MemoizedSwitchSectionBtns section={section} handleClick={handleSectionChange} />
		</ContentContainer>
	)
}

-----------------------------------------------------------------------------
// 자식 컴포넌트
import React from 'react';

const CategoryList = () => {
	return (<>...생략</>)
}

export const MemoizedCategoryList = React.memo(CategoryList);
```

### 3. handle함수 useCallback 적용

- 자식 컴포넌트인 `MemoizedCategoryList` 와 `MemoizedSwitchSectionBtns` 는 메모이징을 위해 React.memo()로 감싸진 컴포넌트들.
- 그렇지만 props로 전달되는 handle 함수(handleCategoryChange, handleSectionChange)를 useCallback으로 감싸지 않으면 매번 handle 함수가 새롭게 정의되므로 `MemoizedCategoryList` 와 `MemoizedSwitchSectionBtns`는 여전히 리렌더링 된다.
- 메모이징 된 컴포넌트에 전달되는 콜백함수까지 useCallback으로 감싸야만 진정한 리렌더링 방지가 가능!

```jsx
// 부모 컴포넌트
import { useState, useCallback } from 'react';

const handleCategoryChange = useCallback((id: number) => {
    setCategory(id);
  }, []);

const handleSectionChange = useCallback((section: 'latest' | 'popularity') => {
    setSection(section);
  }, []);

const NewsArticleList = () => {
	return (
		<ContentContainer>
			<MemoizedCategoryList selected={category} handleClick={handleCategoryChange} />
			<MemoizedSwitchSectionBtns section={section} handleClick={handleSectionChange} />
		</ContentContainer>
	)
}

---------------------------------------------------------------------------
// 자식 컴포넌트에서
export const MemoizedCategoryList = React.memo(CategoryList);
export const MemoizedSwitchSectionBtns = React.memo(SwitchSectionBtns);
```

### 4. React.lazy및 Suspense 적용 (코드 스플리팅과 지연로딩)

> 사용하지 않는 소스코드를 전부 한번에 불러오면 번들 파일의 크기가 커지기 때문에 화면 로딩 시간이 길어져 사용자 경험을 저해한다.
> 실제 로드될 화면에 필요한 번들 파일만 불러오고 나머지 번들 파일은 호출하지 않고 지연시킴으로써 더 빠른 속도로 화면이 보여지게 된다.

- [[React] 코드 스플리팅으로 최적화하기](https://jforj.tistory.com/162)
  >
- `React.lazy()` 를 이용한 dynamic import

```jsx
// Router.tsx
import React, {Suspense} from 'react'
const MainPage = React.lazy(()=> import('./MainPage'))
const ViewPage = React.lazy(()=> import('./ViewPage'))

<Suspense fallback={<div>loading...</div>}>
	<Routes>
		<Route path='/' element={MainPage} />
		<Route path='/view' element={ViewPage} />
	</Routes>
</Suspense>
```

- `Suspense` 를 이용한 결합 시 로딩 상태 처리

> 네트워크를 통해 컴포넌트 내부의 분할 구성 요소를 가져올때면 사용자는 항상 약간의 지연을 경험하게 된다. 따라서 로딩 상태를 표시하는 것이 중요하다. Suspense를 이용하면 모든 구성 요소가 로딩될 때까지 `fallback`으로 설정된 로딩상태를 보여준다.

- [React.lazy 및 Suspense를 사용한 코드 분할](https://web.dev/i18n/ko/code-splitting-suspense/)
  >

```jsx
// NewsRoomPage
import React, { Suspense } from "react";

const NewsArticleList = React.lazy(() =>
  import("pages/NewsRoom/NewsArticleList")
);
const MainDisplayCarousel = React.lazy(() =>
  import("pages/NewsRoom/MainDisplayCarousel")
);

function NewsRoomPage() {
  return (
    <>
      <Suspense fallback={<div>로딩중입니다...</div>}>
        <Title>뉴스룸</Title>
        <MainDisplayCarousel />
        <NewsArticleList />
      </Suspense>
    </>
  );
}
```

### 5. 캐로셀 방식으로 리렌더링 최소화 (pre-rendering)

![image Untitled](https://hyunahpark.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F211bd81f-0e8d-45ae-b88e-0c94980c5a3f%2FUntitled.png?table=block&id=d0b5d7e9-79ac-40e7-afc4-080f329fddca&spaceId=8a82258c-2d6f-430c-8447-c480cc77bd43&width=2000&userId=&cache=v2)

- 기존에 `slice`와 `map`으로 화살표 클릭시 보여지는 4개의 속보 리스트를 매번 새롭게 그려주던 방식에서 미리 모든 리스트를 렌더링하고 노출되는 부분을 `transform: translateX(__px)`로 이동시키는 방식으로 변경. 페이지 초기 렌더링 시간은 살짝 증가했지만, 불필요한 리렌더링을 최소화해서 DOM 최적화를 도모.

```
transform: translateX(${(props) => props.xAxis}px);
```

---

## 결과

- BEFORE
  ![image before-screenshot](https://hyunahpark.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fb7ebe963-a4a1-4f54-9277-c41f462591ec%2FUntitled.png?table=block&id=7cd47ac7-4022-43e6-8fe3-734b10068791&spaceId=8a82258c-2d6f-430c-8447-c480cc77bd43&width=2000&userId=&cache=v2)
- AFTER
  ![image after-screenshot](https://hyunahpark.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Feb3a7112-4364-4e14-a1ce-9102e0beb1cc%2FUntitled.png?table=block&id=19159d7e-4664-4a2a-93c8-eb5977585534&spaceId=8a82258c-2d6f-430c-8447-c480cc77bd43&width=2000&userId=&cache=v2)

### Performance: 35 → 58

- First Contentful Paint(첫 컨텐츠의 첫 픽셀이 그려지는 시간): 4.3s → 0.6s
- Speed Index(브라우저의 시각적 완료 단계를 정량적으로 계산): 4.3s → 1.6s
- Largest Contentful Paint(주요 컨텐츠를 볼 수 있는 시점): 6.6s → 4.4s
- Time to Interactive(사용자와의 상호작용이 가능해지는 시간): 5.8s → 3.8s
- Total Blocking Time(총 차단시간: First Contentful Paint 와 Time to Interactive 사이): 70ms → 0ms
- Cumulative Layout Shift(사용자가 예상치 못한 레이아웃 이동을 경험하는 빈도): 0.773s → 0.835s
  - 이미지 요소에 크기 속성을 미리 확보하지 않은 점과 캐로셀로 좀 더 많은 이미지를 더 그려야 하는 점때문인 것으로 추측… CLS 개선방법
