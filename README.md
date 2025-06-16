# gravelselector

Herramienta web para calcular la velocidad y desarrollo de una bicicleta de gravel.

## Uso

Abra `index.html` en un navegador moderno. Seleccione uno o varios platos, el ancho de neumático y la cadencia mínima y máxima. La tabla resultante mostrará los metros avanzados por pedalada y el rango de velocidades posible.

Los controles de cadencia están sincronizados: si una barra sobrepasa a la otra, la segunda se ajusta de forma automática para mantener el orden.

Las preferencias seleccionadas se guardan localmente para que se restauren en la siguiente visita.

## Estructura

- `index.html` – página principal
- `style.css` – estilos
- `script.js` – lógica de la aplicación

El archivo `gravel_plato_selector.html` contiene la versión original sin separar en módulos.
