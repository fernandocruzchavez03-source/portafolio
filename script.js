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
    // El tema sigue activo durante la visita.
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
