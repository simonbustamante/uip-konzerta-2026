console.log("%cHecho por Simón Ali Bustamante Blanco · UIP 2026", "color: #eda100; font-weight: bold");
const quieto = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Pestañas: Historia y Análisis exploratorio
const pestanas = [...document.querySelectorAll(".pestanas button")];
function abrirPestana(vista) {
  pestanas.forEach(b => b.setAttribute("aria-pressed", b.dataset.abre === vista));
  document.querySelectorAll("[data-vista]").forEach(v => { v.hidden = v.dataset.vista !== vista; });
  // Un gráfico oculto no tiene ancho: se vuelve a medir al mostrarlo
  document.querySelectorAll(`main[data-vista="${vista}"] .js-plotly-plot`).forEach(g => Plotly.Plots.resize(g));
}
pestanas.forEach(b => b.addEventListener("click", () => {
  abrirPestana(b.dataset.abre);
  scrollTo({top: document.querySelector(".hero").offsetHeight, behavior: "instant"});
}));

// Portada: «Panamá en 100 avisos»
const cuadros = [...document.querySelectorAll("#reticula i")];
const botones = [...document.querySelectorAll("#hechos button")];
let turno = 0;
function mostrarHecho(i) {
  const hecho = DATOS.hechos[i];
  document.getElementById("cifra").textContent = hecho.cifra;
  document.getElementById("frase").textContent = hecho.frase;
  document.getElementById("reticula").setAttribute("aria-label", hecho.cifra + " de cada 100 avisos: " + hecho.frase);
  cuadros.forEach((c, n) => c.classList.toggle("lleno", n < hecho.cifra));
  botones.forEach((b, n) => b.setAttribute("aria-pressed", n === i));
}
const rotacion = quieto ? null : setInterval(() => { turno = (turno + 1) % botones.length; mostrarHecho(turno); }, 4500);
botones.forEach((b, i) => b.addEventListener("click", () => { clearInterval(rotacion); mostrarHecho(i); }));

// Cifras que suben al aparecer
function contar(el) {
  const fin = Number(el.dataset.valor), dec = Number(el.dataset.decimales), inicio = performance.now();
  const formato = v => (el.dataset.prefijo || "") + v.toLocaleString("en-US", {minimumFractionDigits: dec, maximumFractionDigits: dec}) + (el.dataset.sufijo || "");
  function paso(t) {
    const avance = Math.min((t - inicio) / 900, 1);
    el.textContent = formato(fin * (1 - Math.pow(1 - avance, 3)));
    if (avance < 1) requestAnimationFrame(paso);
  }
  requestAnimationFrame(paso);
  setTimeout(() => { el.textContent = formato(fin); }, 1000);   // garantiza el valor final
}

// Aparición al desplazarse e índice activo
const observador = new IntersectionObserver(entradas => entradas.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("visible");
  e.target.querySelectorAll("[data-valor]").forEach(contar);
  observador.unobserve(e.target);
}), {threshold: 0.05});
document.querySelectorAll(".aparece").forEach(el => quieto ? el.classList.add("visible") : observador.observe(el));

const enlaces = [...document.querySelectorAll(".indice a")];
const capitulos = new IntersectionObserver(entradas => entradas.forEach(e => {
  if (e.isIntersecting) enlaces.forEach(a => a.classList.toggle("activo", a.hash === "#" + e.target.id));
}), {rootMargin: "-30% 0px -60% 0px"});
document.querySelectorAll(".capitulo").forEach(c => capitulos.observe(c));

addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - innerHeight;
  document.getElementById("progreso").style.width = (scrollY / total * 100) + "%";
}, {passive: true});

// Explorador por área
const selector = document.getElementById("selector-area");
const FILAS = [["Publica salario", "pct_publica_salario"], ["Pide experiencia", "pct_pide_experiencia"],
               ["Universitario o más", "pct_universitario_o_mas"], ["Pide inglés", "pct_pide_ingles"],
               ["Híbrido o remoto", "pct_hibrido_o_remoto"]];
const filasHtml = document.getElementById("filas-area");
FILAS.forEach(([nombre, clave]) => {
  filasHtml.insertAdjacentHTML("beforeend", `<div class="fila" data-clave="${clave}"><div class="fila-texto"><span>${nombre}</span><span class="valor"></span></div><div class="pista"><i></i><u></u></div></div>`);
});
DATOS.areas.forEach((a, i) => selector.add(new Option(a.area, i)));
function mostrarArea() {
  const a = DATOS.areas[selector.value];
  document.getElementById("area-avisos").textContent = a.avisos.toLocaleString("en-US");
  document.getElementById("area-vacantes").textContent = a.vacantes.toLocaleString("en-US");
  document.getElementById("area-puesto").textContent = "#" + (Number(selector.value) + 1) + " de " + DATOS.areas.length;
  document.getElementById("area-salario").textContent = a.salario_mediana === null ? "Sin datos suficientes" : "B/. " + a.salario_mediana.toLocaleString("en-US", {maximumFractionDigits: 0});
  document.querySelectorAll("#filas-area .fila").forEach(f => {
    const clave = f.dataset.clave, general = DATOS.general[clave];
    f.querySelector(".valor").textContent = a[clave].toFixed(1) + "% · mercado " + general.toFixed(1) + "%";
    f.querySelector("i").style.width = a[clave] + "%";
    f.querySelector("u").style.left = general + "%";
  });
}
selector.addEventListener("change", mostrarArea);
mostrarArea();

// Textos y rejillas de los gráficos según el tema del navegador
function aplicarTema() {
  const oscuro = matchMedia("(prefers-color-scheme: dark)").matches;
  const texto = oscuro ? "#c3c2b7" : "#52514e";
  const rejilla = oscuro ? "#33332f" : "#e6e5e0";
  document.querySelectorAll(".js-plotly-plot").forEach(g => Plotly.relayout(g, {
    "font.color": texto, "xaxis.gridcolor": rejilla, "yaxis.gridcolor": rejilla,
  }));
}
// En pantallas angostas, el gráfico de requisitos usa solo la leyenda y gana ancho
function ajustarAncho() {
  const g = document.getElementById("grafico-requisitos");
  g.anotaciones = g.anotaciones || g.layout.annotations;
  const angosto = innerWidth < 640;
  Plotly.relayout(g, {"margin.r": angosto ? 20 : 170, "margin.t": angosto ? 80 : 30,
                      annotations: angosto ? [] : g.anotaciones});
}
addEventListener("load", aplicarTema);
addEventListener("load", () => { if (location.hash === "#analisis") abrirPestana("analisis"); });
addEventListener("load", ajustarAncho);
addEventListener("resize", ajustarAncho);
matchMedia("(prefers-color-scheme: dark)").addEventListener("change", aplicarTema);
