const tema = document.querySelector("#tema");
const menu = document.querySelector("#menu");
const navegacion = document.querySelector("#navegacion");
const pantallaReducida = window.matchMedia("(max-width: 970px)");
const clave = "fernando-cruz-theme";

function obtenerTema() {
  try {
    return localStorage.getItem(clave) === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function mostrarTema(valor) {
  document.documentElement.dataset.theme = valor;
  tema.textContent = valor === "dark" ? "Modo claro" : "Modo oscuro";
}

function mostrarMenu(abierto) {
  menu.setAttribute("aria-expanded", String(abierto));
  navegacion.toggleAttribute("data-cerrado", !abierto && pantallaReducida.matches);
}

tema.addEventListener("click", () => {
  const valor = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  mostrarTema(valor);
  try {
    localStorage.setItem(clave, valor);
  } catch {
    /* <-------- El tema sigue activo durante la visita. -------------> */
  }
});

menu.addEventListener("click", () => mostrarMenu(menu.getAttribute("aria-expanded") !== "true"));
navegacion.addEventListener("click", (evento) => {
  if (pantallaReducida.matches && evento.target.closest("a")) {
    const destino = document.querySelector(evento.target.closest("a").hash);
    destino.setAttribute("tabindex", "-1");
    destino.focus({ preventScroll: true });
    mostrarMenu(false);
  }
});
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape" && menu.getAttribute("aria-expanded") === "true") {
    mostrarMenu(false);
    menu.focus();
  }
});
pantallaReducida.addEventListener("change", () => mostrarMenu(false));

mostrarTema(obtenerTema());
mostrarMenu(false);
tema.hidden = false;
menu.hidden = false;

if ("IntersectionObserver" in window) {
  const entradas = new IntersectionObserver((elementos, observador) => {
    for (const elemento of elementos) {
      if (elemento.isIntersecting) {
        elemento.target.classList.add("entrada");
        observador.unobserve(elemento.target);
      }
    }
  });

  document.querySelectorAll(".portada > div, .seccion > h2, #aprendizaje article, .perfil > div, .proyecto, .preguntas details, .contacto__panel, .pie").forEach((elemento) => {
    entradas.observe(elemento);
  });
}

/* <-------- Mostrar la barra al volver hacia arriba -------------> */
const cabecera = document.querySelector(".cabecera");

if (cabecera) {
  let referencia = Math.max(0, window.scrollY);
  let actualizacionPendiente = false;

  window.addEventListener("scroll", () => {
    if (actualizacionPendiente) return;
    actualizacionPendiente = true;

    window.requestAnimationFrame(() => {
      actualizacionPendiente = false;
      const posicion = Math.max(0, window.scrollY);
      const distancia = posicion - referencia;
      if (posicion < 40) {
        cabecera.removeAttribute("data-oculta");
      } else if (Math.abs(distancia) < 10) {
        return;
      } else {
        const menuAbierto = menu.getAttribute("aria-expanded") === "true";
        cabecera.toggleAttribute("data-oculta", distancia > 0 && posicion > 110 && !menuAbierto);
      }
      referencia = posicion;
    });
  }, { passive: true });
}
