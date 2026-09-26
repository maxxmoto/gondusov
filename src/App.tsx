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
} from './components/Icons';
import { LogoIcon } from './components/Logo';
import { Picture } from './components/Picture';

const DOCTOR_PHOTO = './8082192B-0B52-4BC5-B8B9-646CFA7B3B06.webp';
const RGMU_PHOTO = './rostgmu.webp';
const ONCO_PHOTO = './нииц.webp';
const RESIDENCY_PHOTO = './ординатура.webp';
const ENDOSCOPY_PHOTO = 'https://image.qwenlm.ai/generated-images/4c6da141-6463-4864-bf1b-5553edc45664/_result.png';

const SERVICE_IMAGES = {
  consultation: 'https://image.qwenlm.ai/generated-images/e57a1a55-4674-4fc5-8dd4-618bb60ed9ca/_result.png',
  gastroscopy: 'https://image.qwenlm.ai/generated-images/728c13df-525e-4e90-a50a-76e994b30242/_result.png',
  colonoscopy: 'https://image.qwenlm.ai/generated-images/6325614a-c091-4a8d-b88f-db521d12ed80/_result.png',
  polyps: 'https://image.qwenlm.ai/generated-images/6be551f2-1f0b-4cd7-8c98-63ed623b5c8a/_result.png',
  balloon: 'https://image.qwenlm.ai/generated-images/cfd12812-b6c7-48a8-9c01-d94bbe82a52f/_result.png',
  gastroplasty: 'https://image.qwenlm.ai/generated-images/b90d40f9-0342-4776-80f8-febf1d6fc010/_result.png',
};

const PHONE_DISPLAY = '+7 989 628 7794';
const PHONE_TEL = '+79896287794';

const WORKPLACES: { label: string; href?: string }[] = [
  { label: 'СберЗдоровье', href: 'https://rnd.docdoc.ru/doctor/Gondusov_Denis?pid=27997' },
  { label: 'ПроДокторов', href: 'https://prodoctorov.ru/azov/vrach/1139434-gondusov/?utm_referrer=https%3a%2f%2fyandex.ru%2f' },
  { label: 'НМИЦ Онкологии' },
  { label: 'МЦ «Семья»' },
  { label: 'РостГМУ' },
  { label: 'НаПоправку', href: 'https://napopravku.ru/rostov-na-donu/doctor-profile/gondusov-denis-vadimovich/?utm_source=yandex_feeds&utm_medium=organic&utm_campaign=feeds_p&price_type=basic' },
  { label: 'Doctu', href: 'https://doctu.ru/azov/doctor/gondusov-denis-vadimovich' },
];

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState('');
  const totalSlides = 4;

  const symptoms = [
    'Боль и тяжесть в животе',
    'Частая изжога',
    'Вздутие живота',
    'Нарушения стула',
    'Тошнота',
    'Проблемы с пищеварением',
    'Необъяснимое снижение или набор веса',
    'Заболевания ЖКТ у близких родственников',
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsHeaderScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.fade-in');
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
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
    const message = (document.getElementById('modalMessage') as HTMLTextAreaElement)?.value?.trim() || '';

    if (!name || !phone) {
      alert('Пожалуйста, заполните имя и телефон.');
      return;
    }

    // ─────────────────────────────────────────────────────────────
    // ОТПРАВКА В TELEGRAM-БОТ ВРЕМЕННО ОТКЛЮЧЕНА.
    // Пока в Amvera не заданы TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID,
    // заявка не отправляется — вместо этого показываем телефон для звонка.
    // Чтобы включить бота: раскомментируйте блок ниже и удалите строки
    // с setSubmittedName(name) / setIsSubmitted(true) в конце функции.
    //
    // setIsSubmitting(true);
    // try {
    //   const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT || '/api/contact';
    //   const res = await fetch(endpoint, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, phone, message }),
    //   });
    //   const data = await res.json().catch(() => ({}));
    //
    //   if (res.ok) {
    //     setSubmittedName(name);
    //     setIsSubmitted(true);
    //   } else {
    //     alert(data.error || 'Не удалось отправить заявку. Пожалуйста, попробуйте ещё раз.');
    //   }
    // } catch {
    //   alert('Ошибка сети. Пожалуйста, попробуйте ещё раз.');
    // } finally {
    //   setIsSubmitting(false);
    // }
    // ─────────────────────────────────────────────────────────────

    setSubmittedName(name);
    setIsSubmitted(true);
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
                  <img src={ENDOSCOPY_PHOTO} alt="Профессиональная переподготовка по эндоскопии" loading="lazy" decoding="async" />
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
              <p>Работал на кафедре гастроэнтерологии и эндоскопии РостГМУ. Также веду приём пациентов в медицинском центре «Семья» в Ростове-на-Дону.</p>
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
          <div className="service-card fade-in" style={{ backgroundImage: `url(${SERVICE_IMAGES.consultation})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <div className="service-icon"><StethoscopeIcon /></div>
              <h3>Консультация гастроэнтеролога</h3>
              <p>Диагностика и лечение заболеваний ЖКТ, рекомендации по питанию и образу жизни.</p>
            </div>
          </div>
          <div className="service-card fade-in" style={{ backgroundImage: `url(${SERVICE_IMAGES.gastroscopy})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <div className="service-icon"><EndoscopeIcon /></div>
              <h3>Гастроскопия</h3>
              <p>Исследование пищевода, желудка и двенадцатиперстной кишки с биопсией.</p>
            </div>
          </div>
          <div className="service-card fade-in" style={{ backgroundImage: `url(${SERVICE_IMAGES.colonoscopy})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <div className="service-icon"><MicroscopeIcon /></div>
              <h3>Колоноскопия с NBI</h3>
              <p>Осмотр толстого кишечника с технологией NBI для раннего обнаружения патологий.</p>
            </div>
          </div>
          <div className="service-card fade-in" style={{ backgroundImage: `url(${SERVICE_IMAGES.polyps})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <div className="service-icon"><ScissorsIcon /></div>
              <h3>Удаление полипов и аденом</h3>
              <p>Эндоскопическое удаление образований без полостной операции.</p>
            </div>
          </div>
          <div className="service-card fade-in" style={{ backgroundImage: `url(${SERVICE_IMAGES.balloon})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <div className="service-icon"><BalloonIcon /></div>
              <h3>Баллон в желудок</h3>
              <p>Внутрижелудочный баллон для снижения веса и контроля аппетита.</p>
            </div>
          </div>
          <div className="service-card fade-in" style={{ backgroundImage: `url(${SERVICE_IMAGES.gastroplasty})` }}>
            <div className="service-card-overlay"></div>
            <div className="service-card-content">
              <div className="service-icon"><SurgeryIcon /></div>
              <h3>Эндоскопическая гастропластика</h3>
              <p>Малоинвазивное уменьшение объёма желудка без хирургии.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workplaces Marquee */}
      <div className="workplaces-marquee-section">
        <div className="workplaces-marquee">
          <div className="workplaces-marquee-track">
            {[...WORKPLACES, ...WORKPLACES].map((item, index) => (
              item.href ? (
                <a
                  key={index}
                  className="workplace-item workplace-link"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              ) : (
                <div key={index} className="workplace-item">{item.label}</div>
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

      {/* Useful Content + Appointment */}
      <section className="content-appointment-section">
        <div className="content-appointment-inner">
          <div className="useful-content-block">
            <h2 className="section-title fade-in">Полезный контент</h2>
            <p className="section-subtitle fade-in">Подписывайтесь на мои социальные сети, где я делюсь полезной информацией о здоровье ЖКТ, питании и профилактике заболеваний.</p>
          </div>

          <div className="appointment-block" id="contacts">
            <h2 className="section-title fade-in">Запись на приём</h2>
            <p className="fade-in">Записаться на консультацию гастроэнтеролога, гастроскопию, колоноскопию с NBI, удаление полипов, программу снижения веса, установку баллона в желудок или консультацию по эндоскопической гастропластике можно по телефону или через онлайн-запись в клинике.</p>
            <div className="appointment-buttons fade-in">
              <a href="tel:+79896287794" className="btn-primary">
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
          </div>

          <div className="social-buttons fade-in">
            <a href="https://t.me/DrGondusov" target="_blank" rel="noopener noreferrer" className="social-button social-button-telegram">
              <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>ТГ</span>
            </a>
            <a href="https://www.instagram.com/denis_gondusov?stkn=NDM1d2duMWUyM3Vp&utm_source=qr" target="_blank" rel="noopener noreferrer" className="social-button social-button-instagram">
              <img src="./instagram-1-svgrepo-com.svg" className="social-icon" alt="Instagram" />
              <span>Instagram</span>
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
          <div>
            <h4>Гондусов Денис</h4>
            <p>Врач-гастроэнтеролог и эндоскопист, диетолог, нутрициолог. Стаж работы — 8 лет. Врач высшей категории.</p>
          </div>
          <div>
            <h4>Навигация</h4>
            <p><a href="#about">Обо мне</a></p>
            <p><a href="#services">Услуги</a></p>
            <p><a href="#approach">Подход</a></p>
            <p><a href="#when-visit">Когда обратиться</a></p>
          </div>
          <div>
            <h4>Услуги</h4>
            <p><a href="#services">Консультация</a></p>
            <p><a href="#services">Гастроскопия</a></p>
            <p><a href="#services">Колоноскопия</a></p>
            <p><a href="#services">Удаление полипов</a></p>
          </div>
          <div>
            <h4>Контакты</h4>
            <p>Ростов-на-Дону</p>
            <p>ФГБУ «НМИЦ Онкологии»</p>
            <p>МЦ «Семья»</p>
            <p><a href="tel:+79896287794">+7 989 628 7794</a></p>
          </div>
        </div>
        <div className="footer-disclaimer">
          <p>Информация на сайте носит справочно-информационный характер и не является публичной офертой, медицинской консультацией, диагностикой или рекомендацией по лечению.</p>
          <p>Постановка диагноза и назначение лечения возможны только по итогам очной консультации с врачом. Указанные цены и услуги не являются офертой и могут изменяться.</p>
          <p>Имеются противопоказания. Необходима консультация специалиста.</p>
        </div>
        <div className="footer-bottom">
          © 2026 Гондусов Денис. Все права защищены.
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
                <p>Спасибо{submittedName ? `, ${submittedName}` : ''}! Чтобы подтвердить запись, позвоните по номеру:</p>
                <a href={`tel:${PHONE_TEL}`} className="modal-phone">{PHONE_DISPLAY}</a>
                <button className="modal-submit" onClick={closeModal}>Закрыть</button>
              </div>
            ) : (
              <>
                <h3>Запись на приём</h3>
                <input type="text" placeholder="Ваше имя" id="modalName" />
                <input type="tel" placeholder="Телефон" id="modalPhone" />
                <textarea placeholder="Опишите вашу проблему или выберите услугу" id="modalMessage"></textarea>
                <button className="modal-submit" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Отправка…' : 'Отправить заявку'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
