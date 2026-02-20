# Adults-Nara_FE

## ⚙️ 기능 소개
| 기능 미리보기 | 기능 설명 |
|:---:|:---|
|<img width="200" alt="image" src="https://github.com/user-attachments/assets/6e9b104b-ef4c-4a85-ac75-a6ce2e6a0572" /> <img width="200" alt="image" src="https://github.com/user-attachments/assets/551fa63c-e31c-4e64-b258-ea492b0b8a07" />| **홈페이지** <br/> - 1. 인기 영상 10위 리스트 (찜하기 기준) <br/> - 2. 주제별 인기영상 리스트 <br/> - 3. 사용자가 선호도기반 추천영상 리스트|
|<img width="200" alt="image" src="https://github.com/user-attachments/assets/7512abd6-bbaf-4376-8d8f-07a5ed118fe8" /> <img width="200" alt="image" src="https://github.com/user-attachments/assets/96dfc6e2-0b05-415a-b4fa-1c9473d03c3e" />| **마이페이지** <br/> - 1. 사용자 정보 확인 및 수정 <br/> - 2. 선호 주제를 간략하게 볼수있다. <br/>(자세히보기 클릭시 통계 및 선호주제 편집가능) <br/> - 3. 사용자의 리워드 확인 가능 <br/> - 4. 최근 시청 이력 리스트 <br/> - 5. 찜한 영상을 영상 타입별로 재생목록 확인 <br/> (최근시청 이력 및 찜한영상 클릭시 바텀시트로 표현) |
|<img width="200" alt="image" src="https://github.com/user-attachments/assets/fe585787-6461-44d5-86dd-b224ab2fa1fd" />| **통계 및 선호주제편집** <br/> - 1. 사용자가 시청한 주제별 시청시간 순위 <br/> - 2. 선호주제 확인 및 수정가능 |
|<img width="200" alt="image" src="https://github.com/user-attachments/assets/c602b938-d750-45a6-bf78-9260d8858329" />| **숏폼페이지** <br/> - 1. 숏폼타입 영상 및 반응 확인가능 <br/> - 2. 세로로 스와이프시 사용자 선호도 기반 추천영상 재생 <br/> - 3. 가로로 스와이프시 현재영상의 주제관련 영상 재생 |
|<img width="200" alt="image" src="https://github.com/user-attachments/assets/4bee9e6b-de60-4aad-8c61-8fc0afcdb27e" /> <img width="200" alt="image" src="https://github.com/user-attachments/assets/60260671-3c0f-4bd9-ab72-3e5667a819dc" />| **롱폼페이지** <br/> - 1. 롱폼타입 영상 및 반응 확인가능 <br/> - 2. 현재영상 시청완료시 자동으로 연속재생 <br/> - 3. 하단에 현재 영상 기반 추천영상 리스트|
|<img width="200" alt="image" src="https://github.com/user-attachments/assets/4125a3d8-d6cd-432a-8e9e-76f4e1d7bc08" /> <img width="200" alt="image" src="https://github.com/user-attachments/assets/a4decb51-5795-4c40-b15c-1625ccb5907c" />| **검색** <br/> - 1. 헤더의 돋보기 클릭시 사용가능 <br/> - 2. 입력된 검색어 기반 자동완성 기능 <br/> - 3. 검색어 기반 영상 리스트 확인가능|

## 🛠 기술 스택

| 분야 | 기술 스택 |
|------|------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=nextdotjs&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38B2AC?style=flat&logo=tailwindcss&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-EF008F?style=flat&logo=framer&logoColor=white)|
| **State Management** | ![Zustand](https://img.shields.io/badge/Zustand-000000?style=flat) ![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=reactquery&logoColor=white)|
| **Package & Monorepo** | ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat&logo=pnpm&logoColor=white) ![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=flat&logo=turbo&logoColor=white)|
| **Code Quality** | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=flat&logo=prettier&logoColor=black) ![Husky](https://img.shields.io/badge/Husky-000000?style=flat)|

## 📂 디렉토리 구조

```
apps/
├──admin                        #관리자 페이지 프로젝트 (웹뷰 기반)
├──service                      #유저 서비스 프로젝트 (모바일뷰 기반)
│	 └──src/
│			├── app/                  # App Router: 페이지 라우팅 및 레이아웃
│			├── components/           # 재사용 가능한 UI 컴포넌트
│			├── constant/             # 상수 모음 (path경로, 에러코드등
│			├── hooks/                # 커스텀 React 훅
│			├── lib/                  # 외부 라이브러리 설정 및 클라이언트 정의
│			├── types/                # DTO가 아닌 type 정의 시 사용
│			├── models/               # DTO type 정의, 도메인별 관리
│			├── store/                # 전역상태 스토어 관리(Zustand)
│			├── services/             # API 통신 및 비즈니스 로직
│			└── utils/                # 공통 유틸리티 함수
│
└──packages/
   ├──configs/                  # 프로젝트 공통 Config 관리
   └──ui/                       # 프로젝트 공통 UI 관리
      └──src/
         ├── common/            # 공통 컴포넌트 
         ├── icons/             # svg파일 및 .tsx로 변환한 icon
         ├── styles/            # 폰트 및 디자인 토큰
         └── utils/             # 공통 유틸리티 함수 (ex.cn)
```
