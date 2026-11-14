import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import {
  StethoscopeIcon,
  EndoscopeIcon,
  MicroscopeIcon,
  ScissorsIcon,
  BalloonIcon,
  SurgeryIcon,
  PhoneIcon,
  CheckIcon,
  ArrowIcon,
  CloseIcon,
  RotateIcon,
} from './components/Icons';
import { LogoIcon } from './components/Logo';
import { Picture } from './components/Picture';

const DOCTOR_PHOTO = './8082192B-0B52-4BC5-B8B9-646CFA7B3B06.webp';
const RGMU_PHOTO = './rostgmu.webp';
const ONCO_PHOTO = './нииц.webp';
const RESIDENCY_PHOTO = './ординатура.webp';
const ENDOSCOPY_PHOTO = './endoscopy.webp';

const SERVICE_IMAGES = {
  consultation: './service-consultation.webp',
  gastroscopy: './service-gastroscopy.webp',
  colonoscopy: './service-colonoscopy.webp',
  polyps: './service-polyps.webp',
  balloon: './service-balloon.webp',
  gastroplasty: './service-gastroplasty.webp',
};

const PHONE_DISPLAY = '+7 918 568-05-99';
const PHONE_TEL = '+79185680599';
const TG_CONTACT_HREF =
  'https://t.me/Dr_161?text=' +
  encodeURIComponent('Здравствуйте! Пишу с сайта drgondusov.ru. Хочу задать вопрос. Опишу свою проблему: ');

// Форма временно отключена (юридический вопрос). Код формы сохранён, чтобы вернуть.
const FORM_ENABLED = false;

type CookieConsent = 'accepted' | 'rejected' | null;
const CONSENT_KEY = 'cookie_consent';
const METRIKA_ID = 113072145;

function loadMetrika() {
  const w = window as unknown as { ym?: (...args: unknown[]) => void };
  if (w.ym) return;
  /* eslint-disable */
  (function (m: any, e: any, t: any, r: any, i: any, k?: any, a?: any) {
    m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
    m[i].l = Date.now();
    for (let j = 0; j < document.scripts.length; j++) { if (document.scripts[j].src === r) { return; } }
    k = e.createElement(t); a = e.getElementsByTagName(t)[0]; k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
  })(window, document, 'script', `https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}`, 'ym');
  /* eslint-enable */
  (window as any).ym(METRIKA_ID, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  });
}

const WORKPLACES: { label: string; src?: string; href?: string; size?: 'sm' | 'lg'; text?: boolean }[] = [
  { label: 'СберЗдоровье', src: './logos/sber.svg', href: 'https://rnd.docdoc.ru/doctor/Gondusov_Denis?pid=27997' },
  { label: 'ПроДокторов', src: './logos/prodoctorov.webp', href: 'https://prodoctorov.ru/azov/vrach/1139434-gondusov/' },
  { label: 'НМИЦ Онкологии', src: './logos/нмицонкологии.webp' },
  { label: 'МЦ «Семья»', src: './logos/мцсемья.webp', href: 'https://mc-semya.ru/doktora/gastroenterologi/gondusov-denis-vadimovich/' },
  { label: 'РостГМУ', src: './logos/rostmu_logo.webp', href: 'https://rostgmu.ru/' },
  { label: 'НаПоправку', src: './logos/napopravku.webp', href: 'https://napopravku.ru/rostov-na-donu/doctor-profile/gondusov-denis-vadimovich/', size: 'lg' },
  { label: 'Doctu', src: './logos/doctu.svg', href: 'https://doctu.ru/rostov/doctor/gondusov-denis-vadimovich', size: 'sm' },
];

const SHORTS: {
  id: string;
  title: string;
  poster: string;
  embed: string;
  video: string;
}[] = [
  {
    id: 'sleep-after-food',
    title: 'Сонливость после еды — не норма',
    poster: './roliki/rolik-1.webp',
    embed: 'https://dzen.ru/embed/oNFuxaWMOAAA',
    video: './roliki/short-sleep.mp4',
  },
  {
    id: 'bloating-reasons',
    title: 'Вздутие — не всегда про еду',
    poster: './roliki/rolik-2.webp',
    embed: 'https://dzen.ru/embed/oNFsB4mAOAAA',
    video: './roliki/short-bloating.mp4',
  },
  {
    id: 'gut-treatment',
    title: 'Лечишь кишечник годами, а легче не становится?',
    poster: './roliki/rolik-3.webp',
    embed: 'https://dzen.ru/embed/oNFs3AGcOAAA',
    video: './roliki/short-gut.mp4',
  },
  {
    id: 'alt-ast',
    title: 'АЛТ и АСТ повышены — не всегда болезнь печени',
    poster: './roliki/rolik-4.webp',
    embed: 'https://dzen.ru/embed/oNFtAHnEOAAA',
    video: './roliki/short-alt.mp4',
  },
];

type ShortSummary = {
  lead: string;
  bullets: { title: string; text: React.ReactNode }[];
  takeaway: string;
  audience: string;
};

const SparkleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 2.5l1.7 5.8L19.5 10l-5.8 1.7L12 17.5l-1.7-5.8L4.5 10l5.8-1.7L12 2.5z" />
    <path d="M18.5 14.5l.8 2.7 2.7.8-2.7.8-.8 2.7-.8-2.7-2.7-.8 2.7-.8.8-2.7z" />
  </svg>
);

const SHORT_SUMMARIES: Record<string, ShortSummary> = {
  'sleep-after-food': {
    lead: 'Если после каждого обеда тянет в сон — это не просто «тяжёлый день». У этого есть три частые причины, которые стоит проверить.',
    bullets: [
      {
        title: 'Инсулинорезистентность.',
        text: (
          <>
            После еды сахар растёт, инсулина выбрасывается всё больше, а затем уровень глюкозы резко падает. <em>Этот провал и ощущается как внезапная сонливость.</em> Проблема может годами маскироваться под обычную усталость.
          </>
        ),
      },
      {
        title: 'Гипотиреоз.',
        text: (
          <>
            Если щитовидная железа вырабатывает мало гормонов, замедляется обмен веществ и пищеварение. После еды организм тратит последние силы — отсюда вялость. Иногда это <em>единственный заметный симптом</em>.
          </>
        ),
      },
      {
        title: 'Переедание и тяжёлая пища.',
        text: (
          <>
            Большая порция углеводов и жиров направляет кровоток к желудку и кишечнику. Чем больше жареного, мучного и сладкого, тем сильнее клонит в сон.
          </>
        ),
      },
      {
        title: 'Что проверить.',
        text: (
          <>
            Глюкоза натощак, инсулин, ТТГ и ферритин. С результатами — к терапевту или эндокринологу, а не на форум.
          </>
        ),
      },
      {
        title: 'Что помогает уже завтра.',
        text: (
          <>
            Белок и клетчатка в каждый приём пищи, умеренные порции и <em>10–15 минут ходьбы после еды</em>. Кофе — маскировка, а не решение.
          </>
        ),
      },
    ],
    takeaway: 'Сонливость после еды — не характер и не лень, а сигнал организма. Начните с анализов и простых изменений, а не с очередной чашки кофе.',
    audience: 'Тем, кто регулярно «выключается» после обеда и списывает это на усталость, стресс или возраст.',
  },
  'bloating-reasons': {
    lead: 'Вздутие — не всегда «много газа» и не всегда «плохая микрофлора». За одним симптомом стоят разные механизмы, и лечение зависит от причины.',
    bullets: [
      {
        title: 'Газ и FODMAP.',
        text: (
          <>
            Бактерии ферментируют непереваренные углеводы: пшеницу, лук, бобовые, яблоки, молоко, сахарозаменители. Газ образуется при СИБР и нарушении всасывания углеводов.
          </>
        ),
      },
      {
        title: 'Нарушение моторики.',
        text: (
          <>
            Газа может быть нормально, но кишечник не продвигает его. Стенки растягиваются — появляется распирание и боль. Часто так бывает при СРК.
          </>
        ),
      },
      {
        title: 'Висцеральная чувствительность.',
        text: (
          <>
            Газ и моторика в норме, но нервная система воспринимает обычное растяжение как боль. Это проблема оси <em>«кишечник — мозг»</em>, и стресс её усиливает.
          </>
        ),
      },
      {
        title: 'Желчь и жирная еда.',
        text: (
          <>
            Если желчеотделение нарушено, жиры перевариваются хуже — появляется тяжесть и вздутие, особенно после жирной пищи.
          </>
        ),
      },
      {
        title: 'Что делать.',
        text: (
          <>
            Исключить органику, сделать дыхательные тесты, вести дневник питания 2–4 недели, попробовать низко-FODMAP диету. Пробиотики — только по показаниям, а не «на всякий случай».
          </>
        ),
      },
    ],
    takeaway: 'Вздутие — симптом, а не диагноз. Лечить нужно не газ, а механизм, который его вызывает.',
    audience: 'Тем, у кого вздутие возвращается после «таблеток от живота» и диет.',
  },
};

const SERVICES: {
  title: string;
  desc: string;
  img: string;
  icon: React.ReactNode;
  details: string[];
}[] = [
  {
    title: 'Консультация гастроэнтеролога',
    desc: 'Диагностика и лечение заболеваний ЖКТ, рекомендации по питанию и образу жизни.',
    img: SERVICE_IMAGES.consultation,
    icon: <StethoscopeIcon />,
    details: [
      'Детальный разбор жалоб и истории болезни',
      'Оценка результатов анализов и ранее проведённых исследований',
      'Индивидуальные рекомендации по питанию и образу жизни',
      'Составление плана лечения и дальнейшего наблюдения',
    ],
  },
  {
    title: 'Гастроскопия',
    desc: 'Исследование пищевода, желудка и двенадцатиперстной кишки с биопсией.',
    img: SERVICE_IMAGES.gastroscopy,
    icon: <EndoscopeIcon />,
    details: [
      'Осмотр пищевода, желудка и двенадцатиперстной кишки',
      'Взятие биопсии при необходимости',
      'Контроль уже выявленных изменений слизистой',
      'Проводится быстро, по желанию — с седацией',
    ],
  },
  {
    title: 'Колоноскопия с NBI',
    desc: 'Осмотр толстого кишечника с технологией NBI для раннего обнаружения патологий.',
    img: SERVICE_IMAGES.colonoscopy,
    icon: <MicroscopeIcon />,
    details: [
      'Осмотр всей толстой кишки',
      'Технология NBI для раннего выявления патологий',
      'Биопсия и удаление образований за один сеанс',
      'Требует предварительной подготовки кишечника',
    ],
  },
  {
    title: 'Удаление полипов и аденом',
    desc: 'Эндоскопическое удаление образований без полостной операции.',
    img: SERVICE_IMAGES.polyps,
    icon: <ScissorsIcon />,
    details: [
      'Удаление образований без разреза и полостной операции',
      'Выполняется во время гастроскопии или колоноскопии',
      'Гистологическое исследование удалённого образования',
      'Короткий срок восстановления',
    ],
  },
  {
    title: 'Баллон в желудок',
    desc: 'Внутрижелудочный баллон для снижения веса и контроля аппетита.',
    img: SERVICE_IMAGES.balloon,
    icon: <BalloonIcon />,
    details: [
      'Установка баллона эндоскопически, без операции',
      'Снижение объёма желудка и контроль аппетита',
      'Сопровождение врача и план питания на весь период',
      'Удаляется так же эндоскопически',
    ],
  },
  {
    title: 'Эндоскопическая гастропластика',
    desc: 'Малоинвазивное уменьшение объёма желудка без хирургии.',
    img: SERVICE_IMAGES.gastroplasty,
    icon: <SurgeryIcon />,
    details: [
      'Ушивание стенки желудка через эндоскоп, без разрезов',
      'Значительное уменьшение объёма желудка',
      'Снижение веса без полостной операции',
      'Короткий период восстановления',
    ],
  },
];

const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: 'Как подготовиться к гастроскопии?',
    a: 'Исследование проводится натощак: не есть 8–12 часов, не пить за 2–3 часа (допустимо небольшое количество воды). Утром лучше не курить. Точную схему подготовки врач даёт при записи.',
  },
  {
    q: 'Больно ли делать гастроскопию и колоноскопию?',
    a: 'Неприятные ощущения возможны, но большинство пациентов переносят исследование спокойно. По желанию и показаниям обследование можно провести с медикаментозным сном (седацией) — это обсуждается заранее.',
  },
  {
    q: 'Сколько длится исследование?',
    a: 'Гастроскопия занимает около 10–15 минут, колоноскопия — 20–30 минут. С седацией немного дольше, так как нужно время на засыпание и пробуждение.',
  },
  {
    q: 'Как записаться на консультацию?',
    a: 'Записаться можно по телефону или через Telegram. Приём и исследования проводятся в клинике.',
  },
];

const VISITKA_THESES: { start: number; end: number; text: string }[] = [
  { start: 0.72, end: 3.8, text: 'Здравствуйте! Я — Гондусов Денис Вадимович.' },
  { start: 3.8, end: 8.7, text: 'Гастроэнтеролог · эндоскопист · врач превентивной медицины' },
  { start: 8.7, end: 15.5, text: 'Клиническая гастроэнтерология и эндоскопическая диагностика' },
  { start: 15.5, end: 18, text: 'Принципы превентивной медицины' },
  { start: 18, end: 25, text: 'Обоснованная диагностика, индивидуальный подход и понятные рекомендации' },
  { start: 25, end: 36.8, text: 'Цель — сохранить здоровье на годы вперёд' },
];

function formatPhone(raw: string): string {
  let d = raw.replace(/\D/g, '');
  if (d.startsWith('8')) d = '7' + d.slice(1);
  if (!d.startsWith('7')) d = '7' + d;
  d = d.slice(0, 11);
  const p1 = d.slice(1, 4);
  const p2 = d.slice(4, 7);
  const p3 = d.slice(7, 9);
  const p4 = d.slice(9, 11);
  let out = '+7';
  if (!p1) return out;
  out += ` (${p1}`;
  if (!p2) return out;
  out += `) ${p2}`;
  if (!p3) return out;
  out += `-${p3}`;
  if (p4) out += `-${p4}`;
  return out;
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tgPromptOpen, setTgPromptOpen] = useState(false);
  const [writeModalOpen, setWriteModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneValue, setPhoneValue] = useState('+7');
const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
const [showFloat, setShowFloat] = useState(false);
const [showToTop, setShowToTop] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const [isDataConsent, setIsDataConsent] = useState(false);
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const [flippedServices, setFlippedServices] = useState<Record<number, boolean>>({});
  const [showBack, setShowBack] = useState<Record<number, boolean>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [movieDone, setMovieDone] = useState(false);
  const [isVisitkaPlaying, setIsVisitkaPlaying] = useState(false);
  const [visitkaPreload, setVisitkaPreload] = useState(false);
  const [visitkaThesis, setVisitkaThesis] = useState(0);
  const visitkaRef = useRef<HTMLVideoElement | null>(null);
  const visitkaSectionRef = useRef<HTMLElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 769px)').matches
  );
  const [activeShort, setActiveShort] = useState<string | null>(null);
const [activeSummary, setActiveSummary] = useState<string | null>(null);
const [summaryPhase, setSummaryPhase] = useState<'loading' | 'typing'>('loading');
const summaryBodyRef = useRef<HTMLDivElement | null>(null);
const typewriterNodesRef = useRef<{
  el: HTMLElement;
  nodes: { node: Text; full: string }[];
  total: number;
  start: number;
}[]>([]);

useEffect(() => {
  if (!activeShort || !window.matchMedia('(max-width: 768px)').matches) return;
  const card = document.querySelector<HTMLElement>(`.short-card[data-short-id="${activeShort}"]`);
  if (!card) return;
  const timer = window.setTimeout(() => {
    card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, 60);
  return () => window.clearTimeout(timer);
}, [activeShort]);

useEffect(() => {
  if (!activeSummary) return;
  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setActiveSummary(null);
  };
  document.addEventListener('keydown', onKeyDown);
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  return () => {
    document.removeEventListener('keydown', onKeyDown);
    document.body.style.overflow = previousOverflow;
  };
}, [activeSummary]);

useEffect(() => {
  if (!activeSummary) return;
  setSummaryPhase('loading');
  const timer = window.setTimeout(() => setSummaryPhase('typing'), 1500);
  return () => window.clearTimeout(timer);
}, [activeSummary]);

useLayoutEffect(() => {
  if (summaryPhase !== 'typing' || !activeSummary) return;
  const root = summaryBodyRef.current;
  if (!root) return;

  if (typewriterNodesRef.current.length === 0) {
    const elements = [
      root.querySelector<HTMLElement>('.summary-lead'),
      ...Array.from(root.querySelectorAll<HTMLElement>('.summary-list li')),
      root.querySelector<HTMLElement>('.summary-takeaway'),
      root.querySelector<HTMLElement>('.summary-audience'),
      root.querySelector<HTMLElement>('.summary-note'),
    ].filter((element): element is HTMLElement => Boolean(element));

    let start = 0;
    typewriterNodesRef.current = elements.map((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes: { node: Text; full: string }[] = [];
      let current = walker.nextNode();
      while (current) {
        const text = current.nodeValue || '';
        if (text) nodes.push({ node: current as Text, full: text });
        current = walker.nextNode();
      }
      const total = nodes.reduce((sum, item) => sum + item.full.length, 0);
      const unit = { el, nodes, total, start };
      start += total;
      return unit;
    });
  }

  const units = typewriterNodesRef.current;
  let total = 0;
  units.forEach((unit) => {
    unit.nodes.forEach(({ node }) => {
      node.nodeValue = '';
    });
    unit.el.style.visibility = 'hidden';
    total += unit.total;
  });
  if (total === 0) return;

  const duration = 2400;
  const startedAt = performance.now();
  let frame = 0;

  const tick = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const revealed = Math.floor(total * progress);

    units.forEach((unit) => {
      let inUnit = Math.max(0, Math.min(unit.total, revealed - unit.start));
      if (revealed > unit.start) unit.el.style.visibility = 'visible';
      unit.nodes.forEach((item) => {
        const length = Math.min(item.full.length, inUnit);
        item.node.nodeValue = item.full.slice(0, length);
        inUnit -= length;
      });
    });

    if (progress < 1) frame = requestAnimationFrame(tick);
  };

  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}, [summaryPhase, activeSummary]);

const [cookieConsent, setCookieConsent] = useState<CookieConsent>(() => {
    try {
      return (localStorage.getItem(CONSENT_KEY) as CookieConsent) || null;
    } catch {
      return null;
    }
  });
  const totalSlides = 4;

  useEffect(() => {
    if (cookieConsent === 'accepted') loadMetrika();
  }, [cookieConsent]);

  const chooseCookies = (value: 'accepted' | 'rejected') => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setCookieConsent(value);
  };

  const playVisitka = () => {
    const video = visitkaRef.current;
    if (!video) return;
    if (video.ended) video.currentTime = 0;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  };

  const symptoms = [
    'Боль и тяжесть в животе',
    'Частая изжога',
    'Вздутие живота',
    'Нарушения стула',
    'Тошнота',
    'Проблемы с пищеварением',
    'Необъяснимое снижение или набор веса',
    'Заболевания ЖКТ у близких родственников',
    'Лечение помогает, но ненадолго: стало легче, а через несколько месяцев всё вернулось.',
    'Сдали все анализы, но не понимаете, что происходит с вашим организмом.',
    'Приходится постоянно ограничивать своё питание и менять планы из-за дискомфорта и болей.',
    'Не хотите снова тратить время и деньги на ненужные обследования и препараты.',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
      setShowFloat(window.scrollY > window.innerHeight * 0.6);
      setShowToTop(window.scrollY > 500);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const handler = () => setIsDesktop(mq.matches);
    handler();
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (!writeModalOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setWriteModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [writeModalOpen]);

  useEffect(() => {
    const video = visitkaRef.current;
    if (!isVisitkaPlaying || !video) return;
    const sync = () => {
      const time = video.currentTime;
      const index = VISITKA_THESES.findIndex((item) => time >= item.start && time < item.end);
      if (index !== -1) setVisitkaThesis(index);
      else if (time < VISITKA_THESES[0].start) setVisitkaThesis(0);
      else setVisitkaThesis(VISITKA_THESES.length - 1);
    };
    video.addEventListener('timeupdate', sync);
    sync();
    return () => video.removeEventListener('timeupdate', sync);
  }, [isVisitkaPlaying]);

  useEffect(() => {
    if (visitkaPreload) return;
    const el = visitkaSectionRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisitkaPreload(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisitkaPreload(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visitkaPreload]);

  useEffect(() => {
    const video = visitkaRef.current;
    if (!video || !visitkaPreload || isVisitkaPlaying) return;
    if (video.preload !== 'auto') video.preload = 'auto';
    if (video.readyState === 0) video.load();
  }, [visitkaPreload, isVisitkaPlaying]);

  useEffect(() => {
    if (document.querySelector('script[data-pd-widget]')) return;
    const s = document.createElement('script');
    s.src = 'https://prodoctorov.ru/static/js/widget_mini.js?v06';
    s.defer = true;
    s.setAttribute('data-pd-widget', '1');
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    let intervalId: number | undefined;
    const first = window.setTimeout(() => {
      setChatOpen(true);
      intervalId = window.setInterval(() => setChatOpen(true), 30000);
    }, 20000);
    return () => {
      window.clearTimeout(first);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const whenVisitSection = document.getElementById('when-visit');
    if (!whenVisitSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            symptoms.forEach((_, index) => {
              setTimeout(() => {
                const checkElement = document.querySelector(`.symptom-check-${index}`);
                if (checkElement) {
                  checkElement.classList.add('animate-check');
                  setTimeout(() => {
                    checkElement.classList.remove('animate-check');
                  }, 800);
                }
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(whenVisitSection);
    return () => observer.disconnect();
  }, [hasAnimated]);

  const openModal = () => {
    setIsSubmitted(false);
    setSubmittedName('');
    setIsDataConsent(false);
    setIsPolicyAgreed(false);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
  };

  const openTgPrompt = () => {
    setTgPromptOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeTgPrompt = () => {
    setTgPromptOpen(false);
    document.body.style.overflow = '';
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSubmit = async () => {
    const name = (document.getElementById('modalName') as HTMLInputElement)?.value?.trim() || '';
    const phone = (document.getElementById('modalPhone') as HTMLInputElement)?.value?.trim() || '';
    const message = '';

    if (!name || !phone) {
      alert('Пожалуйста, заполните имя и телефон.');
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      alert('Пожалуйста, введите корректный номер телефона.');
      return;
    }

    if (!isDataConsent || !isPolicyAgreed) {
      alert('Пожалуйста, подтвердите согласие на обработку персональных данных и ознакомьтесь с политикой конфиденциальности.');
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setSubmittedName(name);
        setIsSubmitted(true);
      } else {
        alert(data.error || 'Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.');
      }
    } catch {
      alert('Ошибка сети. Пожалуйста, попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (index: number) => {
    setFlippedServices((prev) => ({ ...prev, [index]: !prev[index] }));
    window.setTimeout(() => {
      setShowBack((prev) => ({ ...prev, [index]: !prev[index] }));
    }, 190);
  };

  const toggleSymptom = (index: number) => {
    setSelectedSymptoms((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const activeSummaryShort = activeSummary ? SHORTS.find((short) => short.id === activeSummary) : null;
  const activeSummaryData = activeSummary ? SHORT_SUMMARIES[activeSummary] : null;

  const openSummary = (id: string) => {
    typewriterNodesRef.current = [];
    setSummaryPhase('loading');
    setActiveSummary(id);
  };

  return (
    <div>
      {/* Header */}
      <header className={`header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="logo">
          <LogoIcon />
        </a>

        <nav className="nav">
          <a href="#obo-mne">Обо мне</a>
          <a href="#uslugi">Услуги</a>
          <a href="#podhod">Подход</a>
          <a href="#kogda-obratitsya">Когда обратиться</a>
          <a href="#stati">Статьи</a>
          <a href="#kontakty">Контакты</a>
        </nav>

        <div className="header-actions">
          <a href="tel:+79185680599" className="header-phone">+7 918 568-05-99</a>

          <a
            href="https://t.me/DrGondusov"
            target="_blank"
            rel="noopener noreferrer"
            className="header-social header-social-tg"
            aria-label="Телеграм-канал"
          >
            <img src="./telegram.webp" alt="" width={38} height={38} loading="eager" />
          </a>

          <a
            href="https://dzen.ru/drgondusov"
            target="_blank"
            rel="noopener noreferrer"
            className="header-social header-social-dzen"
            aria-label="Дзен"
          >
            <img src="./dzen.svg" alt="" width={38} height={38} loading="eager" />
          </a>

          <button
            type="button"
            className="btn-appointment"
            onClick={() => setWriteModalOpen(true)}
          >
            Написать
          </button>

          <button
            className={`burger-btn ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Меню"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
          <a href="#obo-mne" onClick={closeMobileMenu}>Обо мне</a>
          <a href="#uslugi" onClick={closeMobileMenu}>Услуги</a>
          <a href="#podhod" onClick={closeMobileMenu}>Подход</a>
          <a href="#kogda-obratitsya" onClick={closeMobileMenu}>Когда обратиться</a>
          <a href="#stati" onClick={closeMobileMenu}>Статьи</a>
          <a href="#kontakty" onClick={closeMobileMenu}>Контакты</a>
          <a href="tel:+79185680599" className="mobile-menu-phone" onClick={closeMobileMenu}>
            +7 918 568-05-99
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-specialty">ВРАЧ-ГАСТРОЭНТЕРОЛОГ<br />И ЭНДОСКОПИСТ<br />ВРАЧ ПРЕВЕНТИВНОЙ МЕДИЦИНЫ</span>
          <h1>ГОНДУСОВ<br />ДЕНИС<br />ВАДИМОВИЧ</h1>
        </div>
        <div className="hero-right">
          <Picture
            src={DOCTOR_PHOTO}
            alt="Доктор Гондусов Денис — гастроэнтеролог и эндоскопист"
            className="doctor-photo"
            loading="eager"
          />
          <div className="quote-bubble">
            <p>«Лучше предотвратить болезнь, чем лечить её»</p>
            <span className="quote-author">— Гиппократ</span>
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <div className="consultation-banner">
        <h2>КОНСУЛЬТАЦИЯ</h2>
        <a href={TG_CONTACT_HREF} target="_blank" rel="noopener noreferrer" className="arrow-btn" aria-label="Связаться в Telegram">
          <ArrowIcon />
        </a>
      </div>

      {/* Video Introduction */}
      <section className="visitka-section" id="video" ref={visitkaSectionRef}>
        <div className="visitka-inner">
          <div className="visitka-text">
            <h2 className="section-title visitka-title fade-in">Видео-визитка</h2>
            {isDesktop && isVisitkaPlaying ? (
              <p className="visitka-lead visitka-theses fade-in" aria-live="polite">
                <span key={visitkaThesis} className="visitka-thesis">
                  {VISITKA_THESES[visitkaThesis].text}
                </span>
              </p>
            ) : (
              <p className="visitka-lead fade-in">Обо мне, о подходе к диагностике и лечению — в коротком видео.</p>
            )}
          </div>
          <div className="visitka-card fade-in">
            <video
              key={isDesktop ? 'desktop' : 'mobile'}
              ref={visitkaRef}
              className="visitka-video"
              poster={isDesktop ? './visitka-poster.webp' : './visitka-540-poster.webp'}
              preload={visitkaPreload ? 'auto' : 'none'}
              playsInline
              controls={isVisitkaPlaying}
              onPlay={() => setIsVisitkaPlaying(true)}
              onEnded={() => setIsVisitkaPlaying(false)}
            >
              <source src={isDesktop ? './visitka.mp4' : './visitka-540.mp4'} type="video/mp4" />
              Ваш браузер не поддерживает воспроизведение видео.
            </video>
            {!isDesktop && isVisitkaPlaying && (
              <div className="visitka-subs" aria-hidden="true">
                <span key={visitkaThesis} className="visitka-subs-text">
                  {VISITKA_THESES[visitkaThesis].text}
                </span>
              </div>
            )}
            {!isVisitkaPlaying && (
              <button
                type="button"
                className="visitka-play"
                aria-label="Смотреть видео-визитку"
                onClick={playVisitka}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 5v14l10-7z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section" id="obo-mne">
        <div className="about-container">
          <div className="career-head fade-in">
            <div className="career-head-text">
              <h2 className="section-title">Путь в профессию</h2>
              <p className="about-intro">Врач-гастроэнтеролог и эндоскопист, диетолог, нутрициолог. Стаж работы — 8 лет. Врач высшей категории.</p>
            </div>
            <a
              className="career-profile-link"
              href="https://prodoctorov.ru/azov/vrach/1139434-gondusov/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="./logos/prodoctorov.webp" alt="Профиль на ПроДокторов" width={1890} height={209} loading="lazy" />
            </a>
          </div>

          <div className="career-grid fade-in">
            <article className="career-card">
              <div className="career-card-media">
                <Picture src={RGMU_PHOTO} alt="Ростовский государственный медицинский университет" loading="lazy" />
              </div>
              <div className="career-card-body">
                <span className="career-year">2018</span>
                <h3>Окончил РостГМУ</h3>
                <p>Ростовский государственный медицинский университет, лечебный факультет</p>
              </div>
            </article>

            <article className="career-card">
              <div className="career-card-media">
                <Picture src={RESIDENCY_PHOTO} alt="Ординатура по гастроэнтерологии" loading="lazy" />
              </div>
              <div className="career-card-body">
                <span className="career-year">2020</span>
                <h3>Ординатура</h3>
                <p>Завершил ординатуру по специальности «Гастроэнтерология» в РостГМУ</p>
              </div>
            </article>

            <article className="career-card">
              <div className="career-card-media">
                <Picture src={ENDOSCOPY_PHOTO} alt="Профессиональная переподготовка по эндоскопии" loading="lazy" />
              </div>
              <div className="career-card-body">
                <span className="career-year">2021</span>
                <h3>Эндоскопия</h3>
                <p>Профессиональная переподготовка по эндоскопии в РостГМУ</p>
              </div>
            </article>

            <article className="career-card">
              <div className="career-card-media">
                <Picture src={ONCO_PHOTO} alt="ФГБУ НМИЦ Онкологии" loading="lazy" />
              </div>
              <div className="career-card-body">
                <span className="career-year">2023</span>
                <h3>НМИЦ Онкологии</h3>
                <p>Врач-эндоскопист в ФГБУ «НМИЦ Онкологии» Минздрава России, Ростов-на-Дону</p>
              </div>
            </article>
          </div>

          <div className="about-facts fade-in">
            <div className="about-fact">
              <span className="about-fact-number">8</span>
              <span className="about-fact-label">лет стажа работы</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-number">Высшая</span>
              <span className="about-fact-label">врачебная категория</span>
            </div>
            <div className="about-fact">
              <span className="about-fact-number">5000+</span>
              <span className="about-fact-label">пациентов</span>
            </div>
          </div>

          <div className="about-experience fade-in">
            <h3>Опыт работы и повышение квалификации</h3>
            <p>Действующий сотрудник НМИЦ Онкологии г. Ростова-на-Дону, веду приём пациентов в МЦ «Семья».</p>
            <p>Регулярно прохожу повышение квалификации и участвую в медицинских конференциях. Это позволяет использовать современные методы обследования, лечения и профилактики заболеваний желудочно-кишечного тракта.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="uslugi">
        <h2 className="section-title fade-in">Услуги</h2>
        <p className="section-subtitle fade-in">Диагностика и лечение заболеваний желудочно-кишечного тракта, современные эндоскопические исследования, профилактика серьёзных заболеваний и помощь в снижении веса.</p>
        <div className="services-grid">
          {SERVICES.map((service, index) => (
            <div
              className={`service-card fade-in ${flippedServices[index] ? 'is-flipped' : ''}`}
              key={service.title}
              onClick={() => toggleService(index)}
            >
              <div className="service-card-inner">
                <div className="service-card-face service-card-front" style={{ display: showBack[index] ? 'none' : 'block' }}>
                  <Picture src={service.img} alt={service.title} className="service-card-img" loading="lazy" />
                  <div className="service-card-overlay"></div>
                  <div className="service-card-content">
                    <div className="service-icon">{service.icon}</div>
                    <h3>{service.title}</h3>
                    <p>{service.desc}</p>
                  </div>
                  <button
                    type="button"
                    className="service-card-flip-btn"
                    aria-label="Подробнее"
                    onClick={(e) => { e.stopPropagation(); toggleService(index); }}
                  >
                    <RotateIcon />
                  </button>
                </div>
                <div className="service-card-face service-card-back" style={{ display: showBack[index] ? 'flex' : 'none' }}>
                  <h3>{service.title}</h3>
                  <ul className="service-card-details">
                    {service.details.map((detail, j) => (
                      <li key={j}>{detail}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="service-card-flip-btn service-card-flip-btn-back"
                    aria-label="Вернуться"
                    onClick={(e) => { e.stopPropagation(); toggleService(index); }}
                  >
                    <RotateIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workplaces Marquee */}
      <div className="workplaces-marquee-section">
        <div className="workplaces-marquee">
          <div className="workplaces-marquee-track">
            {[...WORKPLACES, ...WORKPLACES].map((item, index) => (
              item.text ? (
                <a
                  key={index}
                  className="workplace-item workplace-item-text"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : item.href ? (
                <a
                  key={index}
                  className="workplace-item"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={item.src} alt={item.label} className={`workplace-logo${item.size ? ` workplace-logo-${item.size}` : ''}`} loading="lazy" decoding="async" />
                </a>
              ) : (
                <div key={index} className="workplace-item">
                  <img src={item.src} alt={item.label} className={`workplace-logo${item.size ? ` workplace-logo-${item.size}` : ''}`} loading="lazy" decoding="async" />
                </div>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Approach Section */}
      <div className="approach-section" id="podhod">
        <div className="approach-content">
          <h2 className="section-title fade-in">Комплексный подход к здоровью</h2>
          <p className="fade-in">Основная задача — не только убрать неприятные симптомы, но и понять их причину. Большое внимание уделяется ранней диагностике заболеваний желудка и кишечника. Многие серьёзные изменения могут долго не вызывать заметных симптомов, поэтому своевременное обследование играет важную роль.</p>
          <p className="fade-in">При необходимости используются гастроскопия, колоноскопия, лабораторные анализы и другие исследования. Также учитываются питание, вес, образ жизни и факторы риска.</p>
          <p className="fade-in">Особое направление работы — профилактика онкологических заболеваний желудочно-кишечного тракта. Современная эндоскопия позволяет обнаруживать некоторые опасные изменения на ранних стадиях и вовремя определять дальнейшую тактику.</p>
        </div>
        <div className="approach-photo">
          <Picture src="./IMG_3930.webp" alt="Медицинская литература по гастроэнтерологии и визитки врача" className="approach-photo-left" loading="lazy" />
          <Picture src="./фото2.webp" alt="Гондусов Денис надевает медицинские перчатки перед приёмом" className="approach-photo-right" loading="lazy" />
          <div className="approach-photo-overlay"></div>
        </div>
        {!movieDone && isDesktop && (
          <>
            <video
              className="approach-video"
              src="./komplex.mp4"
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => setMovieDone(true)}
              onError={() => setMovieDone(true)}
            />
            <div className="approach-video-overlay" aria-hidden="true"></div>
          </>
        )}
      </div>

      {/* When to Visit Section */}
      <section className="when-visit" id="kogda-obratitsya">
        <div className="when-visit-content">
          <h2 className="section-title fade-in">Когда стоит обратиться к врачу</h2>
          <p className="section-subtitle fade-in">Выбери свою проблему:</p>
          <div className="symptoms-list fade-in">
            {symptoms.map((symptom, index) => (
              <div
                key={index}
                className={`symptom-item ${selectedSymptoms.includes(index) ? 'selected' : ''}`}
                onClick={() => { toggleSymptom(index); openTgPrompt(); }}
              >
                <span className={`check symptom-check-${index} ${selectedSymptoms.includes(index) ? 'permanent' : ''}`}>
                  <CheckIcon />
                </span>
                <span>{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Process Section */}
      <section className="consult-process" id="konsultaciya">
        <div className="consult-process-container">
          <h2 className="section-title fade-in">Как проходит консультация</h2>
          <div className="consult-cards">
            <div className="consult-card fade-in">
              <div className="consult-card-head">
                <h3>Первичная консультация</h3>
                <span className="consult-duration">40 минут</span>
              </div>
              <ol className="consult-steps">
                <li>
                  <strong>Подробный разбор жалоб и истории.</strong>
                  <span>Вы рассказываете, что беспокоит, как давно, какое лечение уже проводилось.</span>
                </li>
                <li>
                  <strong>Анализ имеющихся обследований.</strong>
                  <span>Если есть анализы, УЗИ, гастроскопия или колоноскопия — разбираем их вместе.</span>
                </li>
                <li>
                  <strong>Разбор питания и образа жизни.</strong>
                </li>
                <li>
                  <strong>Определение первопричины.</strong>
                  <span>Объясняю простым языком, что могло спровоцировать ситуацию.</span>
                </li>
                <li>
                  <strong>План действий.</strong>
                  <span>Какие анализы досдать, какие обследования пройти, как корректировать питание и лечение.</span>
                </li>
                <li>
                  <strong>Ответы на вопросы.</strong>
                </li>
              </ol>
              <div className="consult-price">
                <span>Стоимость</span>
                <strong>3000 ₽</strong>
              </div>
            </div>

            <div
              className="consult-card consult-card-photo fade-in"
              style={{ backgroundImage: 'url(./консультация.webp)' }}
              role="img"
              aria-label="Повторная консультация гастроэнтеролога"
            >
              <div className="consult-card-overlay"></div>
              <div className="consult-card-inner">
                <div className="consult-card-head">
                  <h3>Повторная консультация</h3>
                  <span className="consult-duration">30 минут</span>
                </div>
                <ol className="consult-steps">
                  <li>
                    <strong>Оценка динамики.</strong>
                    <span>Смотрим, что изменилось на фоне проводимой терапии.</span>
                  </li>
                  <li>
                    <strong>Корректировка плана.</strong>
                    <span>При необходимости меняем стратегию.</span>
                  </li>
                  <li>
                    <strong>Ответы на новые вопросы.</strong>
                  </li>
                </ol>
                <div className="consult-price">
                  <span>Стоимость</span>
                  <strong>2000 ₽</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="results-section" id="rezultaty">
        <div className="results-container">
          <h2 className="section-title fade-in">Результат после работы</h2>
          <ul className="results-list">
            <li className="results-item fade-in">
              <span className="results-check"><CheckIcon /></span>
              <p>Поймёте первопричины вашей проблемы и почему симптомы возвращаются.</p>
            </li>
            <li className="results-item fade-in">
              <span className="results-check"><CheckIcon /></span>
              <p>Получите план дальнейших действий, которые помогут поддерживать стабильное хорошее самочувствие.</p>
            </li>
            <li className="results-item fade-in">
              <span className="results-check"><CheckIcon /></span>
              <p>Перестанете бояться еды и постоянно подстраивать под самочувствие свою жизнь.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* Reviews / ProDoktorov widget */}
      <section className="promo-section">
        <div className="promo-photo">
          <img src="./img_4263.webp" alt="Портрет Гондусова Дениса Вадимовича в медицинской маске" loading="lazy" />
        </div>
        <div className="promo-text">
          <h2 className="section-title promo-title fade-in">Врач, который <span>поможет</span></h2>
          <p className="fade-in">Врач получает положительные отзывы: пациенты отмечают внимательное отношение, подробное объяснение диагноза и понятные рекомендации по лечению.</p>
        </div>
        <div className="promo-widget">
          <div id="pd_widget_mini" className="pd_widget_mini" data-doctor="873904">
            <a
              target="_blank"
              className="pd_doctor_name"
              href="https://prodoctorov.ru/rostov-na-donu/vrach/873904-gondusov/"
              rel="noopener noreferrer"
            >
              Гондусов Денис Вадимович
            </a>
            <div className="pd_widget_mini_content" id="pd_widget_mini_content_d873904"></div>
            <a target="_blank" href="https://prodoctorov.ru/" rel="noopener noreferrer">
              <img
                className="pd_logo"
                width={96}
                src="https://prodoctorov.ru/static/_v1/pd/logos/logo-pd-widget.png"
                alt="ПроДокторов"
              />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section" id="faq">
        <div className="faq-container">
          <h2 className="section-title fade-in">Частые вопросы</h2>
          <div className="faq-list">
            {FAQ_ITEMS.map((item, i) => (
              <div className={`faq-item ${openFaq === i ? 'open' : ''}`} key={i}>
                <button
                  type="button"
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">{openFaq === i ? '−' : '+'}</span>
                </button>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="articles-section" id="stati">
        <div className="articles-container">
          <h2 className="section-title fade-in">Статьи</h2>
          <p className="section-subtitle fade-in">Разбираю вопросы ЖКТ, эндоскопии и снижения веса простым языком.</p>
          <div className="articles-grid">
            <a className="article-card fade-in" href="./articles/nbi-endoskopiya">
              <div className="article-card-media">
                <img
                  src="./articles/img/nbi-card.webp"
                  alt="Эндоскопия желудка и кишечника"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="article-card-body">
                <span className="article-card-tag">Эндоскопия</span>
                <h3>Почему обычная гастроскопия может не увидеть рак?</h3>
                <p>Как NBI и хромоэндоскопия повышают точность диагностики и кому нужно обследование в расширенном режиме.</p>
                <span className="article-card-more">Читать статью →</span>
              </div>
            </a>
            <a className="article-card fade-in" href="./articles/iskusstvennyy-intellekt-v-endoskopii">
              <div className="article-card-media">
                <img
                  src="./articles/img/ai-card.webp"
                  alt="Искусственный интеллект в эндоскопии"
                  width={600}
                  height={375}
                  loading="lazy"
                />
              </div>
              <div className="article-card-body">
                <span className="article-card-tag">ИИ в медицине</span>
                <h3>Вы доверите нейросети искать рак в кишечнике?</h3>
                <p>Что показал опрос врачей и пациентов в 2026 году и почему финальное решение остаётся за врачом.</p>
                <span className="article-card-more">Читать статью →</span>
              </div>
            </a>
            <a className="article-card fade-in" href="./articles/srk-simptomy-lechenie">
              <div className="article-card-media">
                <img
                  src="./articles/img/srk-card.webp?v=2"
                  alt="Синдром раздражённого кишечника"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="article-card-body">
                <span className="article-card-tag">СРК</span>
                <h3>Вздутие, боль, неустойчивый стул: что делать при СРК</h3>
                <p>Почему таблетки не помогают, как ставится диагноз и что реально работает.</p>
                <span className="article-card-more">Читать статью →</span>
              </div>
            </a>
            <a className="article-card fade-in" href="./articles/probiotiki-shramm">
              <div className="article-card-media">
                <img
                  src="./articles/img/probiotic-card.webp?v=2"
                  alt="Пробиотики"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="article-card-body">
                <span className="article-card-tag">Пробиотики</span>
                <h3>Почему пробиотик не работает: дело в штамме</h3>
                <p>Когда пробиотики действительно работают, а когда это трата денег.</p>
                <span className="article-card-more">Читать статью →</span>
              </div>
            </a>
            <a className="article-card fade-in" href="./articles/gastrit-ne-prohodit">
              <div className="article-card-media">
                <img
                  src="./articles/img/gastritis-card.webp?v=2"
                  alt="Гастрит"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="article-card-body">
                <span className="article-card-tag">Гастрит</span>
                <h3>Гастрит не проходит: в чём ошибка</h3>
                <p>Почему диагноз «хронический гастрит» часто не объясняет симптомы.</p>
                <span className="article-card-more">Читать статью →</span>
              </div>
            </a>
            <a className="article-card fade-in" href="./articles/vzdutie-lechenie">
              <div className="article-card-media">
                <img
                  src="./articles/img/bloating-card.webp?v=2"
                  alt="Вздутие живота"
                  width={600}
                  height={400}
                  loading="lazy"
                />
              </div>
              <div className="article-card-body">
                <span className="article-card-tag">Вздутие</span>
                <h3>Вздутие не проходит: почему лечение не работает</h3>
                <p>Вздутие — симптом, а не диагноз. Разбираем механизмы и алгоритм.</p>
                <span className="article-card-more">Читать статью →</span>
              </div>
            </a>
          </div>
          <a className="articles-more fade-in" href="./articles/">
            <span className="articles-more-desktop">Все статьи</span>
            <span className="articles-more-mobile">Читать другие статьи</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Shorts */}
      <section className="shorts-section" id="roliki">
        <div className="shorts-container">
          <div className="shorts-head fade-in">
            <div>
              <h2 className="section-title">Ролики</h2>
              <p className="section-subtitle">Короткие видео о ЖКТ, эндоскопии и снижении веса.</p>
            </div>
            <a
              className="shorts-all"
              href="https://dzen.ru/drgondusov"
              target="_blank"
              rel="noopener noreferrer"
            >
              Все ролики в Дзене <span aria-hidden="true">→</span>
            </a>
          </div>
          <div className="shorts-track">
            {SHORTS.map((short) => (
              <div
                className={`short-card ${activeShort === short.id ? 'is-playing' : ''}`}
                data-short-id={short.id}
                key={short.id}
              >
                {activeShort === short.id ? (
                  <video
                    className="short-video"
                    src={short.video}
                    poster={short.poster}
                    controls
                    autoPlay
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <button
                    type="button"
                    className="short-card-button"
                    onClick={() => setActiveShort(short.id)}
                    aria-label={`Смотреть ролик: ${short.title}`}
                  >
                    <img src={short.poster} alt="" width={540} height={959} loading="lazy" />
                    <span className="short-play" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 5v14l10-7z" />
                      </svg>
                    </span>
                  </button>
                )}
                {SHORT_SUMMARIES[short.id] && (
                  <button
                    type="button"
                    className="short-summary-btn"
                    onClick={() => openSummary(short.id)}
                    aria-label={`ИИ-выжимка: ${short.title}`}
                  >
                    <SparkleIcon />
                    <span>ИИ-выжимка</span>
                  </button>
                )}
              </div>
            ))}
          </div>
          <a className="articles-more fade-in" href="./roliki/">
            <span className="articles-more-desktop">Все ролики</span>
            <span className="articles-more-mobile">Смотреть все ролики</span>
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {activeSummaryData && activeSummaryShort && (
        <div className="summary-overlay" onClick={() => setActiveSummary(null)}>
          <div
            className="summary-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="summary-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="summary-head">
              <div className="summary-handle" aria-hidden="true" />
              <button
                type="button"
                className="summary-close"
                onClick={() => setActiveSummary(null)}
                aria-label="Закрыть выжимку"
                autoFocus
              >
                <CloseIcon />
              </button>
              <div className="summary-badge">
                <SparkleIcon />
                <span>ИИ-выжимка</span>
                <span className="summary-time">≈30 секунд</span>
              </div>
              <h2 id="summary-title" className="summary-title">{activeSummaryShort.title}</h2>
            </div>
            <div className="summary-body" ref={summaryBodyRef}>
              <div className={`summary-content ${summaryPhase === 'loading' ? 'is-loading' : ''}`}>
                <p className="summary-lead">{activeSummaryData.lead}</p>
                <ul className="summary-list">
                  {activeSummaryData.bullets.map((bullet, index) => (
                    <li key={index}>
                      <strong>{bullet.title}</strong> {bullet.text}
                    </li>
                  ))}
                </ul>
                <div className="summary-takeaway">
                  <span>Главный вывод</span>
                  <p>{activeSummaryData.takeaway}</p>
                </div>
                <p className="summary-audience">
                  <strong>Кому смотреть:</strong> {activeSummaryData.audience}
                </p>
                <p className="summary-note">
                  Краткий пересказ ролика. Не заменяет консультацию врача.
                </p>
                <button
                  type="button"
                  className="summary-write-btn"
                  onClick={() => {
                    setActiveSummary(null);
                    setWriteModalOpen(true);
                  }}
                >
                  Написать врачу
                  <span aria-hidden="true">→</span>
                </button>
              </div>
              {summaryPhase === 'loading' && (
                <div className="summary-loading">
                  <span className="summary-spinner" aria-hidden="true" />
                  <p className="summary-loading-title">ИИ изучает ролик…</p>
                  <p className="summary-loading-sub">Выделяю главное</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Useful Content + Appointment */}
      <section className="content-appointment-section">
        <div className="content-appointment-inner">
          <div className="useful-content-block">
            <h2 className="section-title fade-in">Полезный контент</h2>
            <p className="section-subtitle fade-in">Подписывайтесь на мои социальные сети, где я делюсь полезной информацией о здоровье ЖКТ, питании и профилактике заболеваний.</p>
          </div>

          <div className="appointment-block" id="kontakty">
            {/* <h2 className="section-title fade-in">Запись на консультацию</h2> */}
            <h2 className="section-title fade-in">Написать врачу</h2>
            {/* <p className="fade-in">Записаться можно по телефону или через Telegram. Приём и исследования — в клинике.</p> */}
            <p className="fade-in">Написать врачу можно в Telegram или позвонить. Приём и исследования — в клинике.</p>
            <div className="appointment-buttons fade-in">
              <a href="tel:+79185680599" className="btn-primary">
                <PhoneIcon />
                Позвонить
              </a>
              <a
                href={TG_CONTACT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <img src="./telegram.webp" className="btn-tg-icon" alt="" width={18} height={18} />
                Написать в Telegram
              </a>
            </div>
            <p className="appointment-legal fade-in">
              Нажимая кнопку, вы подтверждаете, что ознакомлены с{' '}
              <a href="./privacy.html" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a> и даёте{' '}
              <a href="./agreement.html" target="_blank" rel="noopener noreferrer">согласие на обработку персональных данных</a>.
            </p>
          </div>

          <div className="social-buttons fade-in">
            <a href="https://t.me/DrGondusov" target="_blank" rel="noopener noreferrer" className="social-button social-button-telegram">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span className="social-label-desktop">Телеграм</span>
              <span className="social-label-mobile">Канал</span>
            </a>
            <a href="https://dzen.ru/drgondusov" target="_blank" rel="noopener noreferrer" className="social-button social-button-dzen">
              <img src="./dzen.svg" className="social-icon" alt="Дзен" />
              <span>Дзен</span>
            </a>
          </div>

          <div className="content-appointment-photo">
            <Picture src="./ff2.webp" alt="Гондусов Денис" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-about">
            <h4>Гондусов Денис Вадимович</h4>
            <p>Врач-гастроэнтеролог, эндоскопист, диетолог-нутрициолог. Приём в Ростове-на-Дону: консультации, гастроскопия, колоноскопия с NBI, удаление полипов, программы снижения веса. Действующий сотрудник ФГБУ «НМИЦ Онкологии».</p>
            <p className="footer-addr">Ростов-на-Дону · ФГБУ «НМИЦ Онкологии» · МЦ «Семья»</p>
          </div>

          <nav aria-label="Разделы сайта">
            <h4>Разделы</h4>
            <p><a href="#obo-mne">О враче</a></p>
            <p><a href="#uslugi">Услуги</a></p>
            <p><a href="#podhod">Комплексный подход</a></p>
            <p><a href="#kogda-obratitsya">Когда обратиться к врачу</a></p>
            <p><a href="#konsultaciya">Как проходит консультация</a></p>
            <p><a href="#stati">Статьи</a></p>
            <p><a href="./roliki/">Ролики</a></p>
            {/* <p><a href="#kontakty">Запись на консультацию</a></p> */}
            <p><a href="#kontakty">Написать врачу</a></p>
          </nav>

          <nav aria-label="Услуги врача">
            <h4>Услуги</h4>
            <p><a href="#uslugi">Консультация гастроэнтеролога</a></p>
            <p><a href="#uslugi">Гастроскопия</a></p>
            <p><a href="#uslugi">Колоноскопия с NBI</a></p>
            <p><a href="#uslugi">Удаление полипов и аденом</a></p>
            <p><a href="#uslugi">Баллон в желудок</a></p>
            <p><a href="#uslugi">Эндоскопическая гастропластика</a></p>
          </nav>

          <div>
            <h4>Контакты</h4>
            <p><a href="tel:+79185680599">+7 918 568-05-99</a></p>
            <p><a href="https://yandex.ru/maps/?text=Смартклиник%20на%20Московской%2C%20Азов%2C%20ул.%20Московская%2C%20292В" target="_blank" rel="noopener noreferrer">Смартклиник, Азов — ул. Московская, 292В</a></p>
            <p><a href="https://yandex.ru/maps/?text=Смартклиник%20на%20Васильева%2C%20Азов%2C%20ул.%20Васильева%2C%2089" target="_blank" rel="noopener noreferrer">Смартклиник, Азов — ул. Васильева, 89</a></p>
            <p><a href="https://yandex.ru/maps/?text=МЦ%20Семья%20на%20Дачной%2C%20Ростов-на-Дону%2C%20ул.%20Дачная%2C%208" target="_blank" rel="noopener noreferrer">МЦ «Семья», Ростов — ул. Дачная, 8</a></p>
            <p><a href="https://yandex.ru/maps/?text=НМИЦ%20онкологии%2C%20Ростов-на-Дону%2C%20ул.%2014-я%20линия%2C%2063" target="_blank" rel="noopener noreferrer">НМИЦ онкологии — 14-я линия, 63</a></p>
          </div>

          <nav aria-label="Профили врача и соцсети">
            <h4>Профили и соцсети</h4>
            <p><a href="https://t.me/Dr_161" target="_blank" rel="noopener noreferrer">Telegram</a></p>
            <p><a href="https://max.ru/u/f9LHodD0cOJ6Wuc1B1I1zpOqAY2QRnkXkD8DKaQuWvtWCRcO91v-DPp2YI8" target="_blank" rel="noopener noreferrer">Max</a></p>
            <p><a href="https://dzen.ru/drgondusov" target="_blank" rel="noopener noreferrer">Дзен</a></p>
            <p><a href="https://prodoctorov.ru/azov/vrach/1139434-gondusov/" target="_blank" rel="noopener noreferrer">ПроДокторов — 5,0 · 44 отзыва</a></p>
            <p><a href="https://rnd.docdoc.ru/doctor/Gondusov_Denis?pid=27997" target="_blank" rel="noopener noreferrer">СберЗдоровье</a></p>
            <p><a href="https://napopravku.ru/rostov-na-donu/doctor-profile/gondusov-denis-vadimovich/" target="_blank" rel="noopener noreferrer">НаПоправку</a></p>
            <p><a href="https://doctu.ru/rostov/doctor/gondusov-denis-vadimovich" target="_blank" rel="noopener noreferrer">Doctu</a></p>
            <p><a href="https://smart-azov.ru/company/staff/otdel-gastroenterologii/gondusov-denis-vadimovich/" target="_blank" rel="noopener noreferrer">Smart Азов</a></p>
            <p><a href="https://zoon.ru/rostov/p-doctor/denis_vadimovich_gondusov/" target="_blank" rel="noopener noreferrer">Zoon</a></p>
          </nav>
        </div>
        <nav className="footer-sitemap" aria-label="Карта сайта">
          <h4>Карта сайта</h4>
          <p><a href="#obo-mne">О враче</a></p>
          <p><a href="#uslugi">Услуги</a></p>
          <p><a href="#podhod">Комплексный подход к здоровью</a></p>
          <p><a href="#kogda-obratitsya">Когда обратиться к врачу</a></p>
          <p><a href="#konsultaciya">Как проходит консультация</a></p>
          <p><a href="#rezultaty">Результаты</a></p>
          <p><a href="#faq">Частые вопросы</a></p>
          <p><a href="#stati">Статьи</a></p>
          <p><a href="./roliki/">Ролики</a></p>
          {/* <p><a href="#kontakty">Запись на консультацию</a></p> */}
          <p><a href="#kontakty">Написать врачу</a></p>
          <p><a href="./privacy.html" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a></p>
          <p><a href="./agreement.html" target="_blank" rel="noopener noreferrer">Согласие на обработку ПД</a></p>
        </nav>
        <div className="footer-disclaimer">
          <p>Сайт принадлежит частному лицу — Гондусову Денису Вадимовичу — и носит исключительно справочно-информационный характер. Сайт не является медицинской организацией и не оказывает медицинские услуги.</p>
          <p>Медицинские услуги (консультации, диагностика, эндоскопические исследования и др.) оказываются лицензированными медицинскими организациями по месту работы врача. Постановка диагноза и назначение лечения возможны только по итогам очной консультации.</p>
          <p>Информация на сайте не является публичной офертой. Указанные цены носят справочный характер и могут отличаться от действующих в клинике. Имеются противопоказания, необходима консультация специалиста.</p>
          <p>Копирование материалов сайта без согласия правообладателя не допускается.</p>
        </div>
        <div className="footer-bottom">
          © 2026 Гондусов Денис. Все права защищены. · <a href="./privacy.html" target="_blank" rel="noopener noreferrer">Политика конфиденциальности</a> · <a href="./agreement.html" target="_blank" rel="noopener noreferrer">Согласие на обработку ПД</a> · <button type="button" className="footer-cookie-btn" onClick={() => setCookieConsent(null)}>Настройки cookie</button>
        </div>
      </footer>

      {/* Modal (форма временно отключена — FORM_ENABLED = false) */}
      {FORM_ENABLED && isModalOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <div className="modal">
            <button className="modal-close" onClick={closeModal} aria-label="Закрыть">
              <CloseIcon />
            </button>
            {isSubmitted ? (
              <div className="modal-success">
                <h3>Заявка принята</h3>
                <p>Спасибо{submittedName ? `, ${submittedName}` : ''}! Мы свяжемся с вами в ближайшее время.</p>
                {/* <p>Если у вас срочный вопрос, свяжитесь со мной по номеру:</p>
                <a href={`tel:${PHONE_TEL}`} className="modal-phone">{PHONE_DISPLAY}</a> */}
                {/* <a
                  href="https://mc-semya.ru/doktora/gastroenterologi/gondusov-denis-vadimovich/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-link"
                >
                  Записаться на сайте МЦ «Семья»
                </a> */}
                <button className="modal-submit" onClick={closeModal}>Закрыть</button>
              </div>
            ) : (
              <>
                {/* <h3>Запись на консультацию</h3> */}
                <h3>Написать врачу</h3>
                <input type="text" placeholder="Ваше имя" id="modalName" />
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="+7 (___) ___-__-__"
                  id="modalPhone"
                  value={phoneValue}
                  onChange={(e) => setPhoneValue(formatPhone(e.target.value))}
                />
                <label className="modal-consent">
                  <input
                    type="checkbox"
                    checked={isDataConsent}
                    onChange={(e) => setIsDataConsent(e.target.checked)}
                  />
                  <span>
                    Я даю согласие на обработку персональных данных{' '}
                    <a href="./agreement.html" target="_blank" rel="noopener noreferrer">(согласие)</a>
                  </span>
                </label>
                <label className="modal-consent">
                  <input
                    type="checkbox"
                    checked={isPolicyAgreed}
                    onChange={(e) => setIsPolicyAgreed(e.target.checked)}
                  />
                  <span>
                    Я ознакомлен(а) и согласен(а) с{' '}
                    <a href="./privacy.html" target="_blank" rel="noopener noreferrer">политикой конфиденциальности</a>
                  </span>
                </label>
                <button className="modal-submit" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Отправка…' : 'Отправить заявку'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Telegram prompt (вместо формы) */}
      {tgPromptOpen && (
        <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) closeTgPrompt(); }}>
          <div className="modal tg-prompt">
            <button className="modal-close" onClick={closeTgPrompt} aria-label="Закрыть">
              <CloseIcon />
            </button>
            <h3>Напишите мне в Telegram</h3>
            <p className="tg-prompt-text">Опишите свою проблему — я отвечу лично и подскажу, что делать дальше.</p>
            <a
              href={TG_CONTACT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-submit tg-prompt-btn"
            >
              <img src="./telegram.webp" className="btn-tg-icon" alt="" width={18} height={18} />
              Написать в Telegram
            </a>
          </div>
        </div>
      )}

      {/* Write / contact chooser modal */}
      {writeModalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setWriteModalOpen(false);
          }}
        >
          <div className="modal write-modal" role="dialog" aria-modal="true" aria-label="Куда написать врачу">
            <button className="modal-close" onClick={() => setWriteModalOpen(false)} aria-label="Закрыть">
              <CloseIcon />
            </button>
            <h3>Куда написать?</h3>
            <p className="write-modal-sub">Выберите удобный способ связи.</p>
            <div className="write-choices">
              <a
                className="write-choice"
                href="https://max.ru/u/f9LHodD0cOJ6Wuc1B1I1zpOqAY2QRnkXkD8DKaQuWvtWCRcO91v-DPp2YI8"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWriteModalOpen(false)}
              >
                <img src="./max.webp" alt="" width={36} height={36} />
                <span>Max</span>
              </a>
              <a
                className="write-choice"
                href={TG_CONTACT_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setWriteModalOpen(false)}
              >
                <img src="./telegram.webp" alt="" width={36} height={36} />
                <span>Telegram</span>
              </a>
              <a
                className="write-choice"
                href="tel:+79185680599"
                onClick={() => setWriteModalOpen(false)}
              >
                <span className="write-choice-icon"><PhoneIcon /></span>
                <span>Позвонить</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Cookie consent banner */}
      {cookieConsent === null && (
        <div
          className="cookie-banner"
          role="dialog"
          aria-live="polite"
          aria-label="Использование файлов cookie"
        >
          <p className="cookie-banner-text">
            Мы используем файлы cookie для аналитики, чтобы улучшать работу сайта. Подробнее — в{' '}
            <a href="./privacy.html" target="_blank" rel="noopener noreferrer">политике конфиденциальности</a>.
          </p>
          <div className="cookie-banner-actions">
            <button type="button" className="cookie-btn cookie-btn-accept" onClick={() => chooseCookies('accepted')}>
              Принять
            </button>
            <button type="button" className="cookie-btn cookie-btn-reject" onClick={() => chooseCookies('rejected')}>
              Отклонить
            </button>
          </div>
        </div>
      )}

      {/* Chat widget */}
      {chatOpen && (
        <div className="chat-widget" role="dialog" aria-label="Чат с врачом">
          <div className="chat-head">
            <img src="./chatlogo.webp" alt="Гондусов Денис" className="chat-avatar" width={38} height={38} />
            <span className="chat-head-text">
              <span className="chat-head-name">Гондусов Денис</span>
              <span className="chat-head-status">онлайн · гастроэнтеролог</span>
            </span>
            <button type="button" className="chat-close" onClick={() => setChatOpen(false)} aria-label="Закрыть">
              <CloseIcon />
            </button>
          </div>
          <div className="chat-body">
            <div className="chat-bubble">
              <p>Здравствуйте! Я — врач Денис Вадимович Гондусов. Задайте свой вопрос — отвечу лично.</p>
            </div>
            <button
              type="button"
              className="chat-cta"
              onClick={() => setWriteModalOpen(true)}
            >
              Написать
            </button>
          </div>
        </div>
      )}

      {showToTop && !chatOpen && (
        <button
          type="button"
          className="to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Наверх"
          title="Наверх"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 19V5M5 12l7-7 7 7" />
          </svg>
        </button>
      )}

      {/* Floating Telegram */}
      {showFloat && (
        <a
        href={TG_CONTACT_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="float-telegram"
        aria-label="Написать в Telegram"
        title="Написать в Telegram"
      >
        <img src="./chat.webp" alt="Написать в Telegram" className="float-telegram-icon" />
        </a>
      )}
    </div>
  );
}

export default App;
