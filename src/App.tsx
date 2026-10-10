import React, { useState, useEffect } from 'react';
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
  TimelineArrowIcon,
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
    q: 'Можно ли записаться онлайн?',
    a: 'Да, через сайт доступна онлайн-запись на консультацию. На приём и исследования в клинике можно записаться по телефону.',
  },
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [phoneValue, setPhoneValue] = useState('+7');
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [showFloat, setShowFloat] = useState(false);
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
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    const interval = setInterval(() => {
      if (window.innerWidth <= 768) {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }
    }, 4000);

    return () => clearInterval(interval);
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

  return (
    <div>
      {/* Header */}
      <header className={`header ${isHeaderScrolled ? 'scrolled' : ''}`}>
        <a href="#" className="logo">
          <LogoIcon />
        </a>

        <nav className="nav">
          <a href="#about">Обо мне</a>
          <a href="#services">Услуги</a>
          <a href="#approach">Подход</a>
          <a href="#when-visit">Когда обратиться</a>
          <a href="#contacts">Контакты</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <a
            href="#"
            className="btn-appointment"
            onClick={(e) => { e.preventDefault(); openModal(); }}
          >
            <span className="btn-full">ЗАПИСАТЬСЯ</span>
            <span className="btn-short">Запись</span>
          </a>

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
          <a href="#about" onClick={closeMobileMenu}>Обо мне</a>
          <a href="#services" onClick={closeMobileMenu}>Услуги</a>
          <a href="#approach" onClick={closeMobileMenu}>Подход</a>
          <a href="#when-visit" onClick={closeMobileMenu}>Когда обратиться</a>
          <a href="#contacts" onClick={closeMobileMenu}>Контакты</a>
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
        <button className="arrow-btn" onClick={openModal} aria-label="Записаться">
          <ArrowIcon />
        </button>
      </div>

      {/* About Section */}
      <section className="about-section" id="about">
        <div className="about-container">
          <h2 className="section-title fade-in">О враче</h2>
          <p className="about-intro fade-in">Врач-гастроэнтеролог и эндоскопист, диетолог, нутрициолог. Стаж работы — 8 лет. Врач высшей категории.</p>

          {/* Timeline */}
          <div className="timeline fade-in">
            <div className="timeline-track" style={{ transform: `translateX(-${currentSlide * (100 / totalSlides)}%)` }}>
              <div className="timeline-card">
                <div className="timeline-card-image">
                  <Picture src={RGMU_PHOTO} alt="Ростовский государственный медицинский университет" loading="lazy" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2018</span>
                  <h3>Окончил РостГМУ</h3>
                  <p>Ростовский государственный медицинский университет, лечебный факультет</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-image">
                  <Picture src={RESIDENCY_PHOTO} alt="Ординатура по гастроэнтерологии" loading="lazy" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2020</span>
                  <h3>Ординатура</h3>
                  <p>Завершил ординатуру по специальности «Гастроэнтерология» в РостГМУ</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-image">
                  <Picture src={ENDOSCOPY_PHOTO} alt="Профессиональная переподготовка по эндоскопии" loading="lazy" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2021</span>
                  <h3>Эндоскопия</h3>
                  <p>Профессиональная переподготовка по эндоскопии в РостГМУ</p>
                </div>
              </div>

              <div className="timeline-arrow">
                <TimelineArrowIcon />
                <TimelineArrowIcon />
                <TimelineArrowIcon />
              </div>

              <div className="timeline-card">
                <div className="timeline-card-image">
                  <Picture src={ONCO_PHOTO} alt="ФГБУ НМИЦ Онкологии" loading="lazy" />
                </div>
                <div className="timeline-card-body">
                  <span className="timeline-year">2023</span>
                  <h3>НМИЦ Онкологии</h3>
                  <p>Врач-эндоскопист в ФГБУ «НМИЦ Онкологии» Минздрава России, Ростов-на-Дону</p>
                </div>
              </div>
            </div>
            <div className="timeline-dots">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  className={`timeline-dot ${currentSlide === i ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Слайд ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Description under timeline */}
          <div className="about-details fade-in">
            <div className="about-details-text">
              <p>Действующий сотрудник НМИЦ Онкологии г. Ростова-на-Дону, веду приём пациентов в МЦ «Семья».</p>
              <p>Регулярно прохожу повышение квалификации и участвую в медицинских конференциях. Это позволяет использовать современные методы обследования, лечения и профилактики заболеваний желудочно-кишечного тракта.</p>
            </div>
            <div className="about-stats">
              <div className="stats-marquee">
                <div className="stats-marquee-track">
                  <div className="stat-card">
                    <div className="number">8</div>
                    <div className="label">лет стажа работы</div>
                  </div>
                  <div className="stat-card">
                    <div className="number">Высшая</div>
                    <div className="label">врачебная категория</div>
                  </div>
                  <div className="stat-card">
                    <div className="number">5000+</div>
                    <div className="label">Пациентов</div>
                  </div>
                  <div className="stat-card">
                    <div className="number">8</div>
                    <div className="label">лет стажа работы</div>
                  </div>
                  <div className="stat-card">
                    <div className="number">Высшая</div>
                    <div className="label">врачебная категория</div>
                  </div>
                  <div className="stat-card">
                    <div className="number">5000+</div>
                    <div className="label">Пациентов</div>
                  </div>
                </div>
              </div>
              <div className="stat-card">
                <div className="number">8</div>
                <div className="label">лет стажа работы</div>
              </div>
              <div className="stat-card">
                <div className="number">Высшая</div>
                <div className="label">врачебная категория</div>
              </div>
              <div className="stat-card">
                <div className="number">5000+</div>
                <div className="label">Пациентов</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services">
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
      <div className="approach-section" id="approach">
        <div className="approach-content">
          <h2 className="section-title fade-in">Комплексный подход к здоровью</h2>
          <p className="fade-in">Основная задача — не только убрать неприятные симптомы, но и понять их причину. Большое внимание уделяется ранней диагностике заболеваний желудка и кишечника. Многие серьёзные изменения могут долго не вызывать заметных симптомов, поэтому своевременное обследование играет важную роль.</p>
          <p className="fade-in">При необходимости используются гастроскопия, колоноскопия, лабораторные анализы и другие исследования. Также учитываются питание, вес, образ жизни и факторы риска.</p>
          <p className="fade-in">Особое направление работы — профилактика онкологических заболеваний желудочно-кишечного тракта. Современная эндоскопия позволяет обнаруживать некоторые опасные изменения на ранних стадиях и вовремя определять дальнейшую тактику.</p>
        </div>
        <div className="approach-photo">
          <Picture src="./IMG_3930.webp" alt="Комплексный подход к здоровью" className="approach-photo-left" loading="lazy" />
          <Picture src="./фото2.webp" alt="Комплексный подход к здоровью" className="approach-photo-right" loading="lazy" />
          <div className="approach-photo-overlay"></div>
        </div>
      </div>

      {/* When to Visit Section */}
      <section className="when-visit" id="when-visit">
        <div className="when-visit-content">
          <h2 className="section-title fade-in">Когда стоит обратиться к врачу</h2>
          <p className="section-subtitle fade-in">Выбери свою проблему:</p>
          <div className="symptoms-list fade-in">
            {symptoms.map((symptom, index) => (
              <div
                key={index}
                className={`symptom-item ${selectedSymptoms.includes(index) ? 'selected' : ''}`}
                onClick={() => { toggleSymptom(index); openModal(); }}
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
      <section className="consult-process" id="consultation">
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

            <div className="consult-card consult-card-photo fade-in" style={{ backgroundImage: 'url(./консультация.webp)' }}>
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
      <section className="results-section" id="results">
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

      {/* Useful Content + Appointment */}
      <section className="content-appointment-section">
        <div className="content-appointment-inner">
          <div className="useful-content-block">
            <h2 className="section-title fade-in">Полезный контент</h2>
            <p className="section-subtitle fade-in">Подписывайтесь на мои социальные сети, где я делюсь полезной информацией о здоровье ЖКТ, питании и профилактике заболеваний.</p>
          </div>

          <div className="appointment-block" id="contacts">
            <h2 className="section-title fade-in">Запись на консультацию</h2>
            <p className="fade-in">На сайте можно записаться на онлайн-консультацию. Остальные услуги — по телефону или через онлайн-запись в клинике.</p>
            <div className="appointment-buttons fade-in">
              <a href="tel:+79185680599" className="btn-primary">
                <PhoneIcon />
                Позвонить
              </a>
              <a
                href="#"
                className="btn-secondary"
                onClick={(e) => { e.preventDefault(); openModal(); }}
              >
                Онлайн-запись
              </a>
            </div>
            <p className="appointment-legal fade-in">
              Нажимая кнопку онлайн-записи, вы подтверждаете, что ознакомлены с{' '}
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
              <span className="social-label-mobile">ТГ</span>
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
            <p><a href="#about">О враче</a></p>
            <p><a href="#services">Услуги</a></p>
            <p><a href="#approach">Комплексный подход</a></p>
            <p><a href="#when-visit">Когда обратиться к врачу</a></p>
            <p><a href="#consultation">Как проходит консультация</a></p>
            <p><a href="#contacts">Запись на консультацию</a></p>
          </nav>

          <nav aria-label="Услуги врача">
            <h4>Услуги</h4>
            <p><a href="#services">Консультация гастроэнтеролога</a></p>
            <p><a href="#services">Гастроскопия</a></p>
            <p><a href="#services">Колоноскопия с NBI</a></p>
            <p><a href="#services">Удаление полипов и аденом</a></p>
            <p><a href="#services">Баллон в желудок</a></p>
            <p><a href="#services">Эндоскопическая гастропластика</a></p>
          </nav>

          <div>
            <h4>Контакты</h4>
            <p><a href="tel:+79185680599">+7 918 568-05-99</a></p>
            <p>Ростов-на-Дону</p>
            <p>ФГБУ «НМИЦ Онкологии»</p>
            <p><a href="https://mc-semya.ru/doktora/gastroenterologi/gondusov-denis-vadimovich/" target="_blank" rel="noopener noreferrer">МЦ «Семья»</a></p>
          </div>

          <nav aria-label="Профили врача и соцсети">
            <h4>Профили и соцсети</h4>
            <p><a href="https://t.me/Dr_161" target="_blank" rel="noopener noreferrer">Telegram</a></p>
            <p><a href="https://dzen.ru/drgondusov" target="_blank" rel="noopener noreferrer">Дзен</a></p>
            <p><a href="https://prodoctorov.ru/azov/vrach/1139434-gondusov/" target="_blank" rel="noopener noreferrer">ПроДокторов</a></p>
            <p><a href="https://rnd.docdoc.ru/doctor/Gondusov_Denis?pid=27997" target="_blank" rel="noopener noreferrer">СберЗдоровье</a></p>
            <p><a href="https://napopravku.ru/rostov-na-donu/doctor-profile/gondusov-denis-vadimovich/" target="_blank" rel="noopener noreferrer">НаПоправку</a></p>
            <p><a href="https://doctu.ru/rostov/doctor/gondusov-denis-vadimovich" target="_blank" rel="noopener noreferrer">Doctu</a></p>
            <p><a href="https://smart-azov.ru/company/staff/otdel-gastroenterologii/gondusov-denis-vadimovich/" target="_blank" rel="noopener noreferrer">Smart Азов</a></p>
            <p><a href="https://zoon.ru/rostov/p-doctor/denis_vadimovich_gondusov/" target="_blank" rel="noopener noreferrer">Zoon</a></p>
          </nav>
        </div>
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

      {/* Modal */}
      {isModalOpen && (
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
                <h3>Запись на онлайн-консультацию</h3>
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
            <img src="./chatlogo.png" alt="Гондусов Денис" className="chat-avatar" />
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
              <p>Здравствуйте! Я — врач Денис Вадимович Гондусов. Задайте свой вопрос — отвечу лично в Телеграм.</p>
            </div>
            <a
              href={TG_CONTACT_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="chat-cta"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Написать в Telegram
            </a>
          </div>
        </div>
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
