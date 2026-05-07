# Photo Curator (사진 큐레이터)

수천 장 단위의 사진 더미에서 "남길 사진"을 빠르게 추려내기 위한 웹 앱입니다.
한 번에 여러 장을 비교하면서 줌·드래그로 디테일을 살피고, 마음에 드는 사진을 골라
별도 폴더로 복사해 둘 수 있어요. 추린 사진들로 **이상형 월드컵**을 돌려서
"이 중 최고 한 장"까지 자동으로 뽑아주는 기능도 들어 있습니다.

> 약 2,000장 규모를 한나절에 한 장 한 장 돌려보는 워크플로우를 가정해서 만들었습니다.

## 데모

![Photo Curator Demo](demo.gif)

## 주요 기능

### 1. 사진 비교 (Photo Curation)
- 한 페이지에 1·2·4장씩 사진을 띄워서 옆자리 친구처럼 동시에 비교
- 사진 위에서 마우스 휠로 줌, 드래그로 팬(이동)
- 사진 한 장씩의 줌 컨트롤 + 모든 사진을 동시에 줌하는 글로벌 줌 컨트롤
- "Select" 버튼으로 마음에 드는 사진 토글, 선택한 장수 실시간 카운트
- 페이지 단위 이동(First / Previous / 1 2 3 / Next / Last) + 페이지 번호 직접 입력
- "Save Selection" 누르면 선택한 사진들이 `public/selected/` 로 복사됨 (원본은 그대로)
- 다음에 다시 켜도 `public/selected/` 안의 사진은 자동으로 "선택됨" 상태로 복원

### 2. 사진 월드컵 (World Cup) 🏆
- 화면에서 **🏆 World Cup** 버튼을 누르면 시작
- 둘 중 하나를 클릭하는 토너먼트 — 1번 클릭이 곧 1표
- 라운드가 한 단계 끝날 때마다 진출자들이 자동으로 폴더에 백업됨
  - 16강 진출자 → `public/round-16/`
  - 8강 → `public/round-8/`
  - 4강 → `public/round-4/`
  - 결승 진출자 2명 → `public/round-2/`
  - 우승작 → `public/champion/`
- 중간에 마음 바뀌면 **Restart** (같은 후보군으로 처음부터),
  **Exit** 으로 큐레이션 화면으로 복귀
- 우승 화면에서 **Replay** 누르면 새 셔플로 다시 한 판

> 💡 월드컵 결과 폴더(`round-*`, `champion`)는 매 라운드마다 덮어써집니다.
> 이전 결과를 남기고 싶으면 다른 이름으로 복사해두세요.

## 시작하기

### 사전 준비

- Node.js 16.x 이상
- npm 또는 yarn

### 설치

1. 저장소 클론
   ```bash
   git clone https://github.com/symoon94/photo-curator.git
   cd photo-curator
   ```

2. 의존성 설치
   ```bash
   npm install
   # 또는
   yarn install
   ```

3. 사진 넣기
   - 추리고 싶은 사진을 `public/images/` 안에 그대로 복사해 주세요
   - 지원 포맷: `.jpg`, `.jpeg`, `.png`, `.gif`
   - 예: `public/images/IMG_1234.jpg`

4. 개발 서버 실행
   ```bash
   npm run dev
   # 또는
   yarn dev
   ```

5. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 사용법

### Step 1. 1차 큐레이션 — 마음에 드는 사진 고르기
1. 페이지 하단 **Photos per page** 에서 한 화면에 보고 싶은 장수 선택 (1/2/4)
2. 사진 위에서 휠로 줌, 드래그로 팬 — 여러 장을 동시에 비교
3. 마음에 드는 사진의 **Select** 버튼 클릭 (선택 시 파란 테두리)
4. 상단 **Save Selection** 으로 저장
   → 선택한 사진들이 `public/selected/` 로 복사됨

### Step 2. 월드컵 — 그 중 최고 한 장 뽑기
1. 우측 상단 **🏆 World Cup (N)** 버튼 클릭 (N = 현재 로딩된 사진 장수)
2. 두 사진 중 더 좋은 쪽을 클릭 → 다음 매치로 자동 진행
3. 8강·4강·결승을 거치며 진행자 폴더가 자동 저장됨
4. 우승작 화면에서 **Replay** 또는 **Exit**

### 폴더 구조 예시

```
public/
├── images/             # 원본 사진 (입력)
│   ├── IMG_1234.jpg
│   ├── IMG_5678.jpg
│   └── ...
├── selected/           # 1차로 추려낸 사진 (Save Selection 결과)
│   ├── IMG_1234.jpg
│   └── IMG_5678.jpg
├── round-8/            # 월드컵 8강 진출자 (자동 저장)
├── round-4/            # 4강 진출자
├── round-2/            # 결승 진출자
└── champion/           # 우승작 1장
```

> `images/` 와 `selected/` 의 실제 파일은 git에 올라가지 않습니다(`.gitignore`).
> `round-*/`, `champion/`, `*_backup/` 폴더도 마찬가지로 무시되니
> 안심하고 로컬에서 사진을 굴려도 됩니다.

## 단축 팁

- 한 장씩 빠르게 보고 싶을 때: **Photos per page = 1** + 사진 클릭 (자동으로 다음 페이지로 넘어감)
- 정밀 비교: **Photos per page = 2** 로 두고 글로벌 줌으로 같은 위치 동시 확대
- 어차피 다 좋은 사진들 중 베스트만 뽑고 싶을 때: 먼저 큐레이션으로 50~100장으로 줄인 뒤 월드컵

## 기술 스택

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch) — 사진 줌·팬
- [Tailwind CSS](https://tailwindcss.com/) — 스타일링
- 서버 사이드 파일 복사 = Next.js API Route + Node `fs`

## 라이선스

MIT License — 자세한 내용은 LICENSE 파일을 참고하세요.
