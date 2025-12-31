import { ArrowUpRight } from 'lucide-react';

const highlights = [
  {
    title: '경험',
    items: ['프론트엔드 중심의 웹 서비스 구현', '디자인 시스템과 UI 라이브러리 구축', '개발 문화와 문서화에 관심 많은 엔지니어'],
  },
  {
    title: '가치관',
    items: ['명확한 커뮤니케이션과 책임감', '사용자 경험을 먼저 생각하는 시선', '꾸준한 학습과 공유를 통한 성장'],
  },
  {
    title: '스킬셋',
    items: ['TypeScript · React · Next.js', 'Tailwind CSS · 디자인 시스템', 'CI/CD · 클라우드 배포 (Vercel, AWS)'],
  },
];

const projects = [
  {
    name: '개인 소개 페이지',
    description: '심플한 애니메이션과 가벼운 인터랙션을 담은 자기소개 사이트',
    link: '#',
    badges: ['Next.js', 'Tailwind CSS'],
  },
  {
    name: 'UI 컴포넌트 라이브러리',
    description: '일관된 디자인 토큰과 접근성을 고려한 React 컴포넌트 세트',
    link: '#',
    badges: ['React', 'Storybook'],
  },
  {
    name: '작업 노트 & 블로그',
    description: '개발 과정에서 얻은 인사이트를 글과 코드로 정리',
    link: '#',
    badges: ['Technical Writing', 'MDX'],
  },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Email', href: 'mailto:you@example.com' },
];

export default function HomePage() {
  return (
    <main className="px-6 py-12 sm:px-10 lg:px-16 xl:px-24 max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Hello, 안녕하세요</p>
          <h1 className="text-4xl sm:text-5xl font-semibold font-display text-white leading-tight">
            나를 소개하는 <span className="text-coral">개인 홈페이지</span>
          </h1>
          <p className="text-lg text-slate-200 max-w-2xl leading-relaxed">
            사람들과 아이디어를 나누고, 함께 성장하는 일을 좋아합니다. 이 페이지는 저의 경험,
            가치관, 그리고 앞으로 만들고 싶은 것들을 담아두는 공간입니다.
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <a
              className="inline-flex items-center gap-2 rounded-full bg-coral px-4 py-2 text-sm font-semibold text-midnight shadow-soft transition hover:-translate-y-0.5"
              href="#contact"
            >
              함께 이야기해요
              <ArrowUpRight size={16} />
            </a>
            <span className="text-sm text-slate-300">
              최신 프로젝트와 작업 노트를 이곳에 정리하고 있습니다.
            </span>
          </div>
        </div>
        <div className="section-card section-gradient w-full sm:w-[320px] p-6 flex flex-col gap-4 text-slate-100">
          <div className="text-sm uppercase tracking-[0.25em] text-slate-300">Focus</div>
          <div className="space-y-2">
            <div className="text-lg font-semibold">사용자 경험, 생산성, 그리고 즐거운 협업</div>
            <p className="text-sm text-slate-300">
              사용자 여정을 세심하게 관찰하며, 개발팀이 빠르게 실험하고 성장할 수 있는 환경을 만듭니다.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Product Thinking', 'DX', 'Design System', 'A11y'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-slate-700/80 bg-slate-900/50 px-3 py-1 text-xs uppercase tracking-wide text-slate-200"
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-3">
        {highlights.map((group) => (
          <div key={group.title} className="section-card p-6 space-y-3">
            <h2 className="text-lg font-semibold text-white">{group.title}</h2>
            <ul className="space-y-2 text-sm text-slate-200 leading-relaxed list-disc list-inside">
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="section-card p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Works</p>
            <h2 className="text-2xl font-semibold text-white">최근 작업</h2>
            <p className="text-sm text-slate-300 mt-2">
              실제로 진행했거나 시도해보고 싶은 아이디어를 정리했어요.
            </p>
          </div>
          <div className="hidden sm:flex gap-2">
            <div className="h-2 w-2 rounded-full bg-coral" />
            <div className="h-2 w-2 rounded-full bg-sky-300" />
            <div className="h-2 w-2 rounded-full bg-emerald-300" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article key={project.name} className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                <a
                  href={project.link}
                  className="inline-flex items-center gap-1 text-sm text-sky-200 hover:text-white transition"
                >
                  보기
                  <ArrowUpRight size={14} />
                </a>
              </div>
              <p className="mt-2 text-sm text-slate-300 leading-relaxed">{project.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.badges.map((badge) => (
                  <span
                    key={badge}
                    className="rounded-full bg-slate-800/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="section-card p-8 grid gap-6 md:grid-cols-[2fr,1fr] items-center">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">Contact</p>
          <h2 className="text-2xl font-semibold text-white">함께 만들고 싶은 이야기가 있나요?</h2>
          <p className="text-sm text-slate-200 leading-relaxed">
            메일이나 SNS를 통해 편하게 연락 주세요. 새로운 도전을 함께 고민하고, 필요한 경우 빠르게 프로토타이핑해 볼 수 있습니다.
          </p>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700/80 bg-slate-900/40 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-coral hover:text-white"
              >
                {link.label}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>
        <div className="section-gradient rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 text-sm text-slate-200 shadow-soft">
          <div className="text-sm uppercase tracking-[0.25em] text-slate-300 mb-3">Snapshot</div>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>현재: 제품 경험 개선을 위한 실험 설계와 UI 개선 작업</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-coral" />
              <span>관심사: 인터랙션 디자인, 접근성, 팀 생산성 도구</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-300" />
              <span>목표: 사람들이 좋아하는 경험을 빠르게 만들고, 이를 공유하기</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}
