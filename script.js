// script.js
// Interactividad ligera: renderizado de tarjetas desde plantilla (lazy-ish),
// keyboard handling y demo de progreso. Código vanilla, sin dependencias.

/* Datos de ejemplo / placeholders de cursos
   En producción puede venir de un JSON, API o MD files.
*/
const COURSES = [
  { id: 1, title: "Macroeconomía Avanzada", year: "2023", term: "Semestre II", lessons: 14, progress: 0.75 },
  { id: 2, title: "Microeconomía Intermedia", year: "2023", term: "Semestre I", lessons: 10, progress: 0.4 },
  { id: 3, title: "Econometría I", year: "2024", term: "Semestre I", lessons: 12, progress: 0.2 },
  { id: 4, title: "Métodos Cuantitativos", year: "2022", term: "Semestre II", lessons: 8, progress: 1.0 },
  { id: 5, title: "Teoría de Juegos", year: "2024", term: "Semestre II", lessons: 9, progress: 0.0 },
  { id: 6, title: "Política Económica", year: "2021", term: "Semestre I", lessons: 11, progress: 0.6 }
];

// Renderiza tarjetas usando <template>
function renderCards(containerId = 'courses-grid', items = COURSES) {
  const container = document.getElementById(containerId);
  const tpl = document.getElementById('course-card-template');
  if (!container || !tpl) return;

  // Render incremental (simple lazy rendering): primero 3, luego el resto al hacer scroll
  const initialCount = Math.min(3, items.length);
  let rendered = 0;

  const appendOne = (course) => {
    const clone = tpl.content.cloneNode(true);
    // populate clone
    const article = clone.querySelector('.card');
    const titleEl = clone.querySelector('.card-title');
    const metaEl = clone.querySelector('.card-meta');
    const progressBar = clone.querySelector('.progress-bar');

    titleEl.textContent = course.title;
    metaEl.textContent = `${course.year} · ${course.term} · ${course.lessons} lecciones`;
    progressBar.style.setProperty('--pct', `${Math.round(course.progress * 100)}%`);

    // Accessibility: set aria-label and unique id for course title for screen readers
    titleEl.id = `course-title-${course.id}`;
    article.setAttribute('aria-labelledby', titleEl.id);

    // Click / keyboard handler
    article.addEventListener('click', () => openCourse(course));
    article.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        openCourse(course);
      }
    });

    container.appendChild(clone);
  };

  // Append initial
  for (let i = 0; i < initialCount; i++) {
    appendOne(items[i]);
    rendered++;
  }

  // If more items exist, use IntersectionObserver to append when near bottom
  if (rendered < items.length && 'IntersectionObserver' in window) {
    const sentinel = document.createElement('div');
    sentinel.className = 'sentinel';
    container.appendChild(sentinel);

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // append next one or few
          for (let i = 0; i < 2 && rendered < items.length; i++) {
            appendOne(items[rendered]);
            rendered++;
          }
          if (rendered >= items.length) {
            observer.disconnect();
            if (sentinel.parentNode) sentinel.parentNode.removeChild(sentinel);
          }
        }
      });
    }, { rootMargin: '200px' });

    io.observe(sentinel);
  } else {
    // fallback: append all
    for (let i = rendered; i < items.length; i++) appendOne(items[i]);
  }
}

// Placeholder action when se abre un curso (puede integrarse con modal o nueva página)
function openCourse(course) {
  // Simple progressive UX: muestra un alert accesible (en producción, abrir página dedicada)
  const pct = Math.round(course.progress * 100);
  alert(`${course.title}\n${course.year} · ${course.term}\nLecciones: ${course.lessons}\nProgreso: ${pct}%`);
}

// Accessibility: enable focus outlines for keyboard users only
(function manageFocusOutline() {
  function handleFirstTab(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('user-is-tabbing');
      window.removeEventListener('keydown', handleFirstTab);
    }
  }
  window.addEventListener('keydown', handleFirstTab);
})();

// Initialize render
document.addEventListener('DOMContentLoaded', () => {
  renderCards();
});
