export interface Attachment {
  id: string
  name: string
  url: string
  size?: number
  type?: string
}

export interface Lecture {
  id: number
  title: string
  instructor: string
  thumbnail: string
  price: number
  link: string
}

export type MockRecruitment = {
  id: number
  title: string
  author: { id: number; name: string }
  createdAt: string
  participants: number
  maxParticipants: number
  thumbnail: string
  thumbnailType: string
  tags: string[]
  description: string
  lectureList: Lecture[]
  attachments: Attachment[]
  views: number
  bookmarks: number
  deadline: string
  points?: number
  studyType?: string
}

export const CATEGORY_MAP: Record<string, string[]> = {
  '전체 카테고리': [],
  'AI/인공지능': ['AI', '딥러닝', '머신러닝', 'TensorFlow'],
  '응용 AI': ['머신러닝', 'Kaggle', 'python'],
  'IT/프로그래밍': [
    'JavaScript',
    'TypeScript',
    'Python',
    'Java',
    'Backend',
    'Frontend',
    'API',
  ],
  '게임 개발': ['Unity', 'C#', '게임개발', '3D게임'],
  '데이터 사이언스': ['데이터분석', 'Tableau', 'Power BI'],
  IT: ['DevOps', 'Docker', 'Kubernetes'],
  하드웨어: ['IoT', '라즈베리파이', '하드웨어'],
  디자인: ['Figma', 'UI/UX', '디자인'],
}

export function filterByCategory(
  category: string,
  recruitments: MockRecruitment[]
) {
  if (category === '전체 카테고리') return recruitments

  const tagsToMatch = CATEGORY_MAP[category]
  if (!tagsToMatch) return []

  return recruitments.filter((r) =>
    r.tags.some((tag) => tagsToMatch.includes(tag))
  )
}

export const mockRecruitments: MockRecruitment[] = [
  {
    id: 1,
    title: 'Unity 게임 개발 프로젝트 팀원 모집',
    author: { id: 1, name: '엄준식' },
    createdAt: '2025.11.28',
    participants: 4,
    maxParticipants: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Unity', 'C#', '게임개발', '3D게임'],
    description: `Unity를 활용한 3D 게임 개발 프로젝트를 함께 진행할 팀원을 모집합니다.

**스터디 내용**
- Unity 기초부터 고급까지
- 실전 3D 게임 개발
- 팀 프로젝트 진행

**이런 분을 찾습니다**
- C# 기본 문법을 아시는 분
- 게임 개발에 열정이 있으신 분
- 꾸준히 참여 가능하신 분

**스터디 일정**
- 주 2회 (화, 목) 오후 7시
- 온라인 진행`,
    lectureList: [
      {
        id: 1,
        title: 'Unity 게임 개발 마스터클래스',
        instructor: '박유니티',
        thumbnail:
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=240&fit=crop',
        price: 120000,
        link: 'https://www.inflearn.com/course/unity-game',
      },
      {
        id: 2,
        title: 'C# 게임 프로그래밍',
        instructor: '김씨샵',
        thumbnail:
          'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400&h=240&fit=crop',
        price: 60000,
        link: 'https://www.inflearn.com/course/csharp-programming',
      },
    ],
    attachments: [
      {
        id: 'r1-file-1',
        name: '개요_기획서.pdf',
        url: '/mock-files/개요_기획서.pdf',
      },
      {
        id: 'r1-file-2',
        name: 'Unity_개발환경_설정가이드.docx',
        url: '/mock-files/Unity_개발환경_설정가이드.docx',
      },
    ],
    views: 412,
    bookmarks: 105,
    deadline: '2025.12.28',
  },

  {
    id: 2,
    title: '블록체인 & Web3 개발자 팀원 모집',
    author: { id: 2, name: '박코딩' },
    createdAt: '2025.11.27',
    participants: 2,
    maxParticipants: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Blockchain', 'Web3', 'Solidity'],
    description: `블록체인 기술과 Web3 개발에 관심 있는 분들을 모집합니다.

**스터디 내용**
- 블록체인 기초 이론
- Solidity 스마트 컨트랙트 개발
- DApp 프로젝트 구현

**이런 분을 찾습니다**
- JavaScript 기본 지식이 있으신 분
- 블록체인 기술에 관심이 많으신 분
- 실습 프로젝트에 적극적으로 참여하실 분`,
    lectureList: [
      {
        id: 3,
        title: '블록체인 개발 프로젝트',
        instructor: '디파이앱',
        thumbnail:
          'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=240&fit=crop',
        price: 150000,
        link: 'https://www.inflearn.com/course/blockchain',
      },
    ],
    attachments: [
      {
        id: 'r2-file-1',
        name: '블록체인_기초_개념.pdf',
        url: '/mock-files/블록체인_기초_개념.pdf',
      },
      {
        id: 'r2-file-2',
        name: 'Solidity_스마트컨트랙트_가이드.pdf',
        url: '/mock-files/Solidity_스마트컨트랙트_가이드.pdf',
      },
    ],
    views: 980,
    bookmarks: 32,
    deadline: '2025.12.27',
  },

  {
    id: 3,
    title: 'Spring Boot 백엔드 마스터 스터디',
    author: { id: 3, name: '이자바' },
    createdAt: '2025.11.26',
    participants: 3,
    maxParticipants: 6,
    thumbnail:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Spring', 'Java', 'Backend'],
    description: `Spring Boot를 활용한 실전 백엔드 개발 스터디입니다.

**스터디 내용**
- Spring Boot 심화 학습
- JPA & Hibernate 실무 적용
- RESTful API 설계

**이런 분을 찾습니다**
- Java 기본 문법을 아시는 분
- Spring 프레임워크에 관심 있으신 분
- 중급 이상의 백엔드 개발자를 목표로 하시는 분`,
    lectureList: [
      {
        id: 4,
        title: 'Spring Boot 중급 과정',
        instructor: '심화학습',
        thumbnail:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=240&fit=crop',
        price: 100000,
        link: 'https://www.inflearn.com/course/spring-boot',
      },
    ],
    attachments: [
      {
        id: 'r3-file-1',
        name: 'Spring_Boot_프로젝트_구조.pdf',
        url: '/mock-files/Spring_Boot_프로젝트_구조.pdf',
      },
      {
        id: 'r3-file-2',
        name: 'JPA_실습_예제.zip',
        url: '/mock-files/JPA_실습_예제.zip',
      },
    ],
    views: 2100,
    bookmarks: 67,
    deadline: '2025.12.26',
  },

  {
    id: 4,
    title: 'React 프론트엔드 스터디',
    author: { id: 4, name: '최리액트' },
    createdAt: '2025.12.01',
    participants: 5,
    maxParticipants: 6,
    thumbnail:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['React', 'TypeScript', '프론트엔드'],
    description: `React 18 최신 기능을 학습하고 실전 프로젝트를 진행합니다.

**스터디 내용**
- React 18 신규 기능 학습
- TypeScript와 함께하는 React 개발
- 실전 프로젝트 개발

**이런 분을 찾습니다**
- JavaScript 기본 지식이 있으신 분
- React에 관심 있으신 분
- 함께 성장하고 싶으신 분`,
    lectureList: [
      {
        id: 5,
        title: 'React 18 완벽 가이드',
        instructor: '리액트마스터',
        thumbnail:
          'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=240&fit=crop',
        price: 90000,
        link: 'https://www.inflearn.com/course/react-18',
      },
    ],
    attachments: [
      {
        id: 'r4-file-1',
        name: 'React_18_신기능_정리.pdf',
        url: '/mock-files/React_18_신기능_정리.pdf',
      },
      {
        id: 'r4-file-2',
        name: 'TypeScript_React_설정가이드.docx',
        url: '/mock-files/TypeScript_React_설정가이드.docx',
      },
    ],
    views: 1750,
    bookmarks: 55,
    deadline: '2026.01.01',
  },

  {
    id: 5,
    title: '실전 AI 프로젝트 스터디 모집',
    author: { id: 5, name: '강인공지능' },
    createdAt: '2025.11.30',
    participants: 4,
    maxParticipants: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['AI', '딥러닝', 'TensorFlow'],
    description: `딥러닝을 활용한 실전 AI 프로젝트 스터디입니다.

**스터디 내용**
- 딥러닝 기초 이론
- TensorFlow 실습
- 실전 프로젝트 진행

**이런 분을 찾습니다**
- Python 기본 문법을 아시는 분
- AI/머신러닝에 관심 있으신 분
- TensorFlow 기초 지식이 있으신 분`,
    lectureList: [
      {
        id: 6,
        title: '딥러닝 프로젝트 실전',
        instructor: 'AI전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=240&fit=crop',
        price: 130000,
        link: 'https://www.inflearn.com/course/deep-learning',
      },
    ],
    attachments: [
      {
        id: 'r5-file-1',
        name: 'TensorFlow_설치_가이드.pdf',
        url: '/mock-files/TensorFlow_설치_가이드.pdf',
      },
      {
        id: 'r5-file-2',
        name: '딥러닝_프로젝트_예제.zip',
        url: '/mock-files/딥러닝_프로젝트_예제.zip',
      },
    ],
    views: 2450,
    bookmarks: 89,
    deadline: '2025.12.30',
  },

  {
    id: 6,
    title: '알고리즘 코딩테스트 대비 스터디',
    author: { id: 1, name: '엄준식' },
    createdAt: '2025.12.02',
    participants: 6,
    maxParticipants: 8,
    thumbnail:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['알고리즘', '코딩테스트', 'Python'],
    description: `코딩테스트 합격을 목표로 하는 알고리즘 스터디입니다.

**스터디 내용**
- 매일 1문제 풀이
- 주 2회 화상 리뷰
- 백준, 프로그래머스 활용

**이런 분을 찾습니다**
- 코딩테스트를 준비하시는 분
- 꾸준히 문제를 풀 수 있으신 분
- 함께 합격을 목표로 하시는 분`,
    lectureList: [
      {
        id: 7,
        title: '알고리즘 문제 풀이',
        instructor: '코테마스터',
        thumbnail:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=240&fit=crop',
        price: 70000,
        link: 'https://www.inflearn.com/course/algorithm',
      },
    ],
    attachments: [
      {
        id: 'r6-file-1',
        name: '알고리즘_기본_정리.pdf',
        url: '/mock-files/알고리즘_기본_정리.pdf',
      },
      {
        id: 'r6-file-2',
        name: '코딩테스트_준비_체크리스트.docx',
        url: '/mock-files/코딩테스트_준비_체크리스트.docx',
      },
    ],
    views: 3200,
    bookmarks: 120,
    deadline: '2026.01.02',
  },

  {
    id: 7,
    title: 'UI/UX 디자인 스터디',
    author: { id: 7, name: '디자이너김' },
    createdAt: '2025.11.30',
    participants: 2,
    maxParticipants: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Figma', 'UI/UX', '디자인'],
    description: `Figma를 활용한 UI/UX 디자인 스터디입니다.

**스터디 내용**
- Figma 마스터
- UI/UX 이론 학습
- 실전 포트폴리오 제작

**이런 분을 찾습니다**
- 디자인에 관심 있으신 분
- Figma를 배우고 싶으신 분
- 포트폴리오를 만들고 싶으신 분`,
    lectureList: [
      {
        id: 8,
        title: 'Figma UI/UX 디자인',
        instructor: 'UI전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=240&fit=crop',
        price: 85000,
        link: 'https://www.inflearn.com/course/figma-uiux',
      },
    ],
    attachments: [
      {
        id: 'r7-file-1',
        name: 'Figma_단축키_모음.pdf',
        url: '/mock-files/Figma_단축키_모음.pdf',
      },
      {
        id: 'r7-file-2',
        name: 'UI_디자인_가이드라인.pdf',
        url: '/mock-files/UI_디자인_가이드라인.pdf',
      },
    ],
    views: 1450,
    bookmarks: 48,
    deadline: '2026.12.30',
  },

  {
    id: 8,
    title: '데이터 분석 & 시각화 스터디',
    author: { id: 8, name: '데이터박' },
    createdAt: '2025.12.03',
    participants: 5,
    maxParticipants: 6,
    thumbnail:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Python', '데이터분석', 'Tableau'],
    description: `Python과 Tableau를 활용한 데이터 분석 스터디입니다.

**스터디 내용**
- Python 데이터 분석
- Tableau 시각화
- Power BI 활용

**이런 분을 찾습니다**
- 데이터 분석에 관심 있으신 분
- Python 기본 지식이 있으신 분
- 실전 프로젝트로 포트폴리오를 만들고 싶으신 분`,
    lectureList: [
      {
        id: 9,
        title: 'Python 데이터 분석',
        instructor: '데이터전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=240&fit=crop',
        price: 95000,
        link: 'https://www.inflearn.com/course/python-data',
      },
    ],
    attachments: [
      {
        id: 'r8-file-1',
        name: 'Python_데이터분석_라이브러리.pdf',
        url: '/mock-files/Python_데이터분석_라이브러리.pdf',
      },
      {
        id: 'r8-file-2',
        name: 'Tableau_샘플_데이터.csv',
        url: '/mock-files/Tableau_샘플_데이터.csv',
      },
    ],
    views: 1890,
    bookmarks: 61,
    deadline: '2026.01.03',
  },

  {
    id: 9,
    title: '라즈베리파이 IoT 프로젝트',
    author: { id: 9, name: '하드웨어이' },
    createdAt: '2025.11.29',
    participants: 3,
    maxParticipants: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['IoT', '라즈베리파이', '하드웨어'],
    description: `라즈베리파이를 활용한 IoT 프로젝트 스터디입니다.

**스터디 내용**
- 라즈베리파이 기초
- 센서 연동 실습
- IoT 프로젝트 구현

**이런 분을 찾습니다**
- 하드웨어에 관심 있으신 분
- IoT 기술을 배우고 싶으신 분
- 실습 프로젝트에 적극적인 분`,
    lectureList: [
      {
        id: 10,
        title: '라즈베리파이 IoT 실전',
        instructor: 'IoT전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=240&fit=crop',
        price: 75000,
        link: 'https://www.inflearn.com/course/raspberry-iot',
      },
    ],
    attachments: [
      {
        id: 'r9-file-1',
        name: '라즈베리파이_초기_설정.pdf',
        url: '/mock-files/라즈베리파이_초기_설정.pdf',
      },
      {
        id: 'r9-file-2',
        name: 'IoT_프로젝트_회로도.pdf',
        url: '/mock-files/IoT_프로젝트_회로도.pdf',
      },
    ],
    views: 920,
    bookmarks: 34,
    deadline: '2025.12.29',
  },

  {
    id: 10,
    title: '머신러닝 응용 프로젝트',
    author: { id: 10, name: 'ML최' },
    createdAt: '2025.11.22',
    participants: 4,
    maxParticipants: 6,
    thumbnail:
      'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['머신러닝', 'Python', 'Kaggle'],
    description: `머신러닝을 활용한 실전 프로젝트 스터디입니다.

**스터디 내용**
- 머신러닝 이론 학습
- Kaggle 대회 참여
- 실전 프로젝트 개발

**이런 분을 찾습니다**
- Python 기본 지식이 있으신 분
- 머신러닝에 관심 있으신 분
- Kaggle 도전에 관심 있으신 분`,
    lectureList: [
      {
        id: 11,
        title: '실전 머신러닝',
        instructor: 'ML전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=240&fit=crop',
        price: 110000,
        link: 'https://www.inflearn.com/course/machine-learning',
      },
    ],
    attachments: [
      {
        id: 'r10-file-1',
        name: '머신러닝_알고리즘_정리.pdf',
        url: '/mock-files/머신러닝_알고리즘_정리.pdf',
      },
      {
        id: 'r10-file-2',
        name: 'Kaggle_시작_가이드.docx',
        url: '/mock-files/Kaggle_시작_가이드.docx',
      },
    ],
    views: 2280,
    bookmarks: 78,
    deadline: '2025.12.22',
  },

  {
    id: 11,
    title: 'Vue.js 프론트엔드 마스터',
    author: { id: 1, name: '연은식' },
    createdAt: '2025.11.28',
    participants: 3,
    maxParticipants: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Vue.js', 'JavaScript', 'Frontend'],
    description: `Vue 3를 활용한 프론트엔드 개발 스터디입니다.

**스터디 내용**
- Vue 3 Composition API
- Pinia 상태 관리
- 실전 프로젝트 개발

**이런 분을 찾습니다**
- JavaScript 기본 지식이 있으신 분
- Vue에 관심 있으신 분
- 깊이 있는 학습을 원하시는 분`,
    lectureList: [
      {
        id: 12,
        title: 'Vue 3 완벽 가이드',
        instructor: 'Vue전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=400&h=240&fit=crop',
        price: 88000,
        link: 'https://www.inflearn.com/course/vue3',
      },
    ],
    attachments: [
      {
        id: 'r11-file-1',
        name: 'Vue3_Composition_API_가이드.pdf',
        url: '/mock-files/Vue3_Composition_API_가이드.pdf',
      },
      {
        id: 'r11-file-2',
        name: 'Pinia_상태관리_예제.zip',
        url: '/mock-files/Pinia_상태관리_예제.zip',
      },
    ],
    views: 1650,
    bookmarks: 52,
    deadline: '2025.12.28',
  },

  {
    id: 12,
    title: 'Docker & Kubernetes 실전',
    author: { id: 12, name: '데브옵스김' },
    createdAt: '2025.12.02',
    participants: 5,
    maxParticipants: 7,
    thumbnail:
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Docker', 'Kubernetes', 'DevOps'],
    description: `컨테이너 오케스트레이션 실전 스터디입니다.

**스터디 내용**
- Docker 마스터
- Kubernetes 운영
- CI/CD 파이프라인 구축

**이런 분을 찾습니다**
- Linux 기본 지식이 있으신 분
- DevOps에 관심 있으신 분
- 클라우드 엔지니어를 꿈꾸시는 분`,
    lectureList: [
      {
        id: 13,
        title: 'Docker & Kubernetes 실전',
        instructor: 'DevOps전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=240&fit=crop',
        price: 140000,
        link: 'https://www.inflearn.com/course/docker-k8s',
      },
    ],
    attachments: [
      {
        id: 'r12-file-1',
        name: 'Docker_명령어_치트시트.pdf',
        url: '/mock-files/Docker_명령어_치트시트.pdf',
      },
      {
        id: 'r12-file-2',
        name: 'Kubernetes_배포_가이드.pdf',
        url: '/mock-files/Kubernetes_배포_가이드.pdf',
      },
    ],
    views: 2890,
    bookmarks: 95,
    deadline: '2026.01.02',
  },

  {
    id: 13,
    title: 'GraphQL API 개발',
    author: { id: 13, name: 'API전문가' },
    createdAt: '2025.11.26',
    participants: 2,
    maxParticipants: 4,
    thumbnail:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['GraphQL', 'API', 'Backend'],
    description: `GraphQL을 활용한 API 개발 스터디입니다.

**스터디 내용**
- GraphQL 기초 이론
- Apollo Server 구축
- 실전 API 설계

**이런 분을 찾습니다**
- REST API 경험이 있으신 분
- GraphQL에 관심 있으신 분
- 최신 기술을 배우고 싶으신 분`,
    lectureList: [
      {
        id: 14,
        title: 'GraphQL 완벽 가이드',
        instructor: 'GraphQL전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=240&fit=crop',
        price: 92000,
        link: 'https://www.inflearn.com/course/graphql',
      },
    ],
    attachments: [
      {
        id: 'r13-file-1',
        name: 'GraphQL_스키마_설계.pdf',
        url: '/mock-files/GraphQL_스키마_설계.pdf',
      },
      {
        id: 'r13-file-2',
        name: 'Apollo_Server_예제코드.zip',
        url: '/mock-files/Apollo_Server_예제코드.zip',
      },
    ],
    views: 1420,
    bookmarks: 46,
    deadline: '2025.12.26',
  },

  {
    id: 14,
    title: 'Next.js SSR/SSG 마스터',
    author: { id: 14, name: '넥스트고수' },
    createdAt: '2025.12.02',
    participants: 4,
    maxParticipants: 6,
    thumbnail:
      'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['Next.js', 'React', 'SSR'],
    description: `Next.js 14 App Router를 마스터하는 스터디입니다.

**스터디 내용**
- Next.js 14 최신 기능
- 서버 컴포넌트 활용
- SEO 최적화

**이런 분을 찾습니다**
- React 기본 지식이 있으신 분
- Next.js를 배우고 싶으신 분
- 최신 프론트엔드 기술에 관심 있으신 분`,
    lectureList: [
      {
        id: 15,
        title: 'Next.js 14 완벽 가이드',
        instructor: 'Next전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=240&fit=crop',
        price: 115000,
        link: 'https://www.inflearn.com/course/nextjs-14',
      },
    ],
    attachments: [
      {
        id: 'r14-file-1',
        name: 'Next.js_14_App_Router_가이드.pdf',
        url: '/mock-files/Next.js_14_App_Router_가이드.pdf',
      },
      {
        id: 'r14-file-2',
        name: 'SEO_최적화_체크리스트.docx',
        url: '/mock-files/SEO_최적화_체크리스트.docx',
      },
    ],
    views: 3150,
    bookmarks: 108,
    deadline: '2026.01.02',
  },

  {
    id: 15,
    title: 'MongoDB & NoSQL DB',
    author: { id: 15, name: '디비마스터' },
    createdAt: '2025.11.24',
    participants: 3,
    maxParticipants: 5,
    thumbnail:
      'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=400&fit=crop',
    thumbnailType: 'image',
    tags: ['MongoDB', 'NoSQL', 'Database'],
    description: `MongoDB를 활용한 NoSQL 데이터베이스 스터디입니다.

**스터디 내용**
- MongoDB 기초 이론
- 스키마 설계 실습
- Aggregation Pipeline

**이런 분을 찾습니다**
- 데이터베이스에 관심 있으신 분
- NoSQL을 배우고 싶으신 분
- 실습 위주의 학습을 원하시는 분`,
    lectureList: [
      {
        id: 16,
        title: 'MongoDB 완벽 가이드',
        instructor: 'DB전문가',
        thumbnail:
          'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=240&fit=crop',
        price: 78000,
        link: 'https://www.inflearn.com/course/mongodb',
      },
    ],
    attachments: [
      {
        id: 'r15-file-1',
        name: 'MongoDB_설치_가이드.pdf',
        url: '/mock-files/MongoDB_설치_가이드.pdf',
      },
      {
        id: 'r15-file-2',
        name: 'NoSQL_스키마_설계_패턴.pdf',
        url: '/mock-files/NoSQL_스키마_설계_패턴.pdf',
      },
    ],
    views: 1780,
    bookmarks: 63,
    deadline: '2025.12.24',
  },
]
