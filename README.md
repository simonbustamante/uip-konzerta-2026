# Demanda laboral en Panamá: qué piden y qué ofrecen las empresas en Konzerta

Proyecto final · Introducción a la Programación para Ciencia de Datos · Maestría en Ciencias de los Datos · UIP
**Autor:** Simón Ali Bustamante Blanco (individual)

[![Portada de la presentación](reporte/presentacion_portada.png)](Presentaci%C3%B3n.pdf)

## Fuente

- Ofertas de empleo publicadas en konzerta.com (Panamá); dataset proporcionado por el profesor.
- Fecha de extracción: 08/10/2026. Periodo: 11/07/2026 – 08/10/2026.
- Archivo: `datos/originales/Konzerta 08-oct-2026.xlsx` (3,011 filas × 31 columnas). No se modifica.

## Estructura

```
├── Presentación.pdf  exposición y anexo (fuente, diccionario de datos y cómo ejecutar)
├── README.md
├── .gitignore
├── datos/
│   ├── originales/   datos crudos, sin modificar
│   └── limpios/      datos normalizados y limpios + tablas de análisis
├── notebooks/        proyecto_konzerta.ipynb (limpieza, EDA y dashboard)
├── reporte/
│   ├── presentacion_portada.png  imagen de este README
│   └── dashboard/    index.html y copias index_AAAAMMDD_HHMMSS.html (generados)
│       └── plantillas/  estilos.css y pagina.js (diseño de la página)
└── requirements.txt
```

## Dashboard

`reporte/dashboard/index.html` es un solo archivo que se abre en cualquier navegador, sin internet ni servidor. Tiene dos pestañas:

- **Historia:** la portada, 5 capítulos y 6 gráficos que cuentan los hallazgos principales.
- **Análisis exploratorio:** el EDA de la sección 7 del notebook (7.1 a 7.9), con 12 gráficos más, tablas, hallazgos y contraste con la propuesta.

Cada ejecución reemplaza `index.html` y guarda una copia con la fecha y la hora en el nombre, para conservar cada versión.

El diseño está en `plantillas/estilos.css` (colores, tipografía, distribución) y `plantillas/pagina.js` (pestañas, portada animada, explorador por área). El notebook los incrusta en `index.html` al generarlo: para cambiar el diseño se editan esos archivos y se vuelve a ejecutar. No se borran, porque sin ellos el notebook no puede armar la página.

## Cómo ejecutar

Requiere Python 3.12. Desde la carpeta del proyecto:

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
jupyter notebook notebooks/proyecto_konzerta.ipynb
```

1. En el cuaderno, ejecutar **Restart & Run All** (limpieza → EDA → dashboard). En VS Code, elegir antes el kernel del `.venv` **de esta carpeta**. Si tienes otro `.venv` en una carpeta superior, se verá con el mismo nombre: revisa la ruta.
2. Abrir `reporte/dashboard/index.html` en el navegador.

Para actualizar el dashboard con una nueva extracción, coloca el nuevo Excel en `datos/originales/` y vuelve a ejecutar el notebook. Su nombre debe empezar con `Konzerta` y terminar en `.xlsx`. Se usa el archivo con la fecha de modificación más reciente, no el de nombre más nuevo.

Los archivos de `datos/limpios/` son un resultado: si se editan a mano, el cambio se pierde en la siguiente ejecución. Los datos se cambian en `datos/originales/`.

## Prueba de reproducibilidad

Comprueba que el proyecto funciona desde cero, a partir del .zip. Cambia la fecha y hora a mano en cada prueba.

```bash
unzip Simon_Bustamante_Proyecto_IPCD.zip -d ~/Proyectos/Simon_Bustamante_Proyecto_IPCD_20261031_1430
cd ~/Proyectos/Simon_Bustamante_Proyecto_IPCD_20261031_1430/Simon_Bustamante_Proyecto_IPCD
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
code .
```

En VS Code, abre `notebooks/proyecto_konzerta.ipynb`, elige el kernel `.venv` de esta carpeta y usa **Restart** y **Run All**. Tarda unos 10 segundos. VS Code necesita las extensiones Python y Jupyter.

**Resultado esperado**

| Dónde | Qué debes ver |
|---|---|
| Última celda del notebook | `Guardado: reporte/dashboard/index.html`, la copia con fecha y hora, `Gráficos Plotly: 18` y `Enlaces a avisos en la página: 0` |
| `datos/limpios/` | 11 archivos CSV |
| `reporte/dashboard/` | `index.html` y una copia nueva `index_AAAAMMDD_HHMMSS.html` |
| Inicio del dashboard | Pestañas Historia y Análisis exploratorio; 2,960 avisos, 7,477 vacantes y salario mediano de B/. 875 |
| Pie del dashboard | Fecha de generación y `Konzerta 08-oct-2026.xlsx` |

Estas cifras corresponden al Excel original.

**Prueba de automatización:** copia a `datos/originales/` un Excel con las mismas columnas y un nombre que empiece con `Konzerta`, ejecuta **Restart** y **Run All**, y recarga `index.html` con **Ctrl+F5**. Comprueba que ese Excel tenga la fecha de modificación más reciente, porque algunos exploradores conservan la fecha original al copiar. El pie del dashboard muestra el nombre del archivo usado. Las cifras, los títulos calculados y la pestaña Análisis exploratorio cambian solos; la redacción fija no, así que con datos muy distintos alguna frase puede dejar de encajar.

Al terminar, quita ese archivo y ejecuta otra vez para volver a los datos originales. Esa ejecución sobrescribe `datos/limpios/`, `index.html` y las salidas del notebook.

**Si algo falla**

| Problema | Solución |
|---|---|
| `.venv` no aparece como kernel | Revisa que VS Code tenga abierta la carpeta del proyecto y las extensiones instaladas. |
| `ModuleNotFoundError` o `Mime type rendering requires nbformat` en el notebook | El kernel no es el del proyecto. Elige el `.venv` de esta carpeta y ejecuta de nuevo. No instales paquetes en otro entorno. Para comprobarlo, ejecuta `import sys; print(sys.executable)`: la ruta debe estar dentro de esta carpeta. |
| El notebook no encuentra el Excel | Revisa que exista un archivo `Konzerta*.xlsx` en `datos/originales/`. |
| El dashboard no cambia | Confirma que el notebook terminó sin errores, recarga con **Ctrl+F5** y revisa la fecha de generación en el pie. |
| El pie muestra otro Excel | El notebook usó el de fecha de modificación más reciente. Guarda de nuevo el que quieres usar o quita los demás. |
| Aparece `Aviso: valores nuevos en ...` | No es un error. El Excel trae una categoría nueva y se incluye al final de la escala. |
