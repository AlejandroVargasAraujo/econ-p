// script.js
// Renderizado de tarjetas desde <template>.
// Vanilla JS, sin dependencias, orientado a navegación real por páginas.

const COURSES = [
  {
    id: 1,
    title: "Macroeconomía Avanzada",
    slug: "macroeconomia-avanzada",
    year: "2023",
    term: "Semestre II",
    lessons: 14,
    progress: 0.75
  },
  {
    id: 2,
    title: "Microeconomía Intermedia",
    slug: "microeconomia-intermedia",
    year: "2023",
    term: "Semestre I",
    lessons: 10,
    progress: 0.4
  }
];

// Renderiza tarjetas usando <template>
function renderCards(containerId = 'courses-grid', items = COURSES) {
  const container = document.getElementById(containerId);
  const tpl = document.getElementById('course-card-template');
  if (!container || !tpl) return;

  const initialCount = Math.min(3, items.length);
  let rendered = 0;

  const appendOne = (course) => {
    const clone = tpl.content.cloneNode(true);

    const card = clone.querySelector('.card');
    const titleEl = clone.querySelector('.card-title');
    const metaEl = clone.querySelector('.card-meta');
    const progressBar = clone.querySelector('.progress-bar');

    // Contenido
    titleEl.textContent = course.title;
    metaEl.textContent = `${course.year} · ${course.term} · ${course.lessons} lecciones`;
    progressBar.style.setProperty('--pct', `${Math.round(course.progress * 100)}%`);

    // Navegación real (página dedicada)
    card.href = `cursos/${course.slug}/`;

    // Accesibilidad: etiqueta descriptiva
    card.setAttribute(
      'aria-label',
      `${course.title}, ${course.year}, ${course.term}, ${course.lessons} lecciones`
    );

    container.appendChild(clone);
  };

  // Render inicial
  for (let i = 0; i < initialCount; i++) {
    appendOne(items[i]);
    rendered++;
  }

  // Lazy rendering con IntersectionObserver
  if (rendered < items.length && 'IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.className = 'sentinel';
    container.appendChild(sentinel);

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          for (let i = 0; i < 2 && rendered < items.length; i++) {
            appendOne(items[rendered]);
            rendered++;
          }
          if (rendered >= items.length) {
            observer.disconnect();
            sentinel.remove();
          }
        }
      });
    }, { rootMargin: '200px' });

    io.observe(sentinel);
  } else {
    for (let i = rendered; i < items.length; i++) {
      appendOne(items[i]);
    }
  }
}

// Focus outlines solo para usuarios de teclado
(function manageFocusOutline() {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();

// Init
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
});
