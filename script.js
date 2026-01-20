// script.js
// Renderizado de tarjetas desde <template>.
// Vanilla JS, sin dependencias, orientado a navegación real por páginas.

const COURSES = [
  {
    id: 1,
    title: "Finanzas Cuantitativas",
    slug: "finanzas-cuantitativas",
    year: "2026",
    term: "No Aplica",
    lessons: 0,
    progress: 0
  }
];
  {
    id: 2,
    title: "Macroeconometría",
    slug: "macroeconometría",
    year: "2023",
    term: "Semestre I",
    lessons: 0,
    progress: 0
  }
];

// MODIFICA la función renderCards para ocultar progreso y lecciones:
function renderCards(containerId = 'courses-grid', items = COURSES) {
  const container = document.getElementById(containerId);
  const tpl = document.getElementById('course-card-template');
  if (!container || !tpl) return;

  const appendOne = (course) => {
    const clone = tpl.content.cloneNode(true);

    const card = clone.querySelector('.card');
    const titleEl = clone.querySelector('.card-title');
    const metaEl = clone.querySelector('.card-meta');
    const progressBar = clone.querySelector('.progress-bar');
    const cardProgress = clone.querySelector('.card-progress'); // NUEVA REFERENCIA

    // Contenido
    titleEl.textContent = course.title;
    
    // MODIFICA esta línea para mostrar solo año y semestre
    metaEl.textContent = `${course.year} · ${course.term}`;
    
    // REMUEVE la línea que muestra lecciones:
    // ANTES: metaEl.textContent = `${course.year} · ${course.term} · ${course.lessons} lecciones`;
    
    // OCULTA la barra de progreso si es 0
    if (course.progress === 0) {
      if (cardProgress) {
        cardProgress.style.display = 'none'; // OCULTAR progreso
      }
    } else {
      // Solo mostrar progreso si no es 0
      progressBar.style.setProperty('--pct', `${Math.round(course.progress * 100)}%`);
    }

    // Navegación real
    card.href = `cursos/${course.slug}/`;

    // Accesibilidad
    card.setAttribute(
      'aria-label',
      `${course.title}, ${course.year}, ${course.term}`
      // REMOVER: ${course.lessons} lecciones
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
