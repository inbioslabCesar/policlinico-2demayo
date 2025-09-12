# Instalación y configuración de Tailwind CSS en este proyecto

Esta guía documenta los pasos y problemas resueltos para instalar Tailwind CSS correctamente en un proyecto Vite + React con "type": "module" en package.json.

## 1. Instalar dependencias necesarias

```bash
npm install -D tailwindcss postcss autoprefixer @tailwindcss/postcss
```

## 2. Inicializar archivos de configuración

```bash
npx tailwindcss init -p
```

Esto crea `tailwind.config.js` y `postcss.config.js` (que luego cambiaremos a `.cjs`).

## 3. Cambiar postcss.config.js a CommonJS

Si tu `package.json` tiene "type": "module", renombra `postcss.config.js` a `postcss.config.cjs`.

El contenido debe ser:

```js
module.exports = {
	plugins: {
		'@tailwindcss/postcss': {},
		autoprefixer: {},
	},
};
```

## 4. Configurar Tailwind en tu CSS principal

En `src/index.css`:

```css
@import "tailwindcss/preflight";
@import "tailwindcss/utilities";
```

## 5. Configuración de Vite

En `vite.config.js` solo necesitas:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
});
```

No uses el plugin `@tailwindcss/vite`.

## 6. Reiniciar el servidor

```bash
npm run dev
```

## 7. Problemas comunes y soluciones

- Si ves errores de "module is not defined in ES module scope", asegúrate de usar `postcss.config.cjs`.
- Si Tailwind no aplica estilos, revisa que no haya un archivo `postcss.config.js` residual.
- Si ves el error sobre el plugin de Tailwind y PostCSS, instala `@tailwindcss/postcss` y usa la configuración mostrada arriba.


---

# Módulo Recepción: Búsqueda, Registro y Atención de Pacientes

Este módulo permite la gestión de pacientes en la recepción del policlínico, incluyendo:

- Búsqueda de pacientes por DNI, nombre/apellido o historia clínica.
- Registro de nuevos pacientes si no existen en la base de datos.
- Selección de servicios para atención (consulta, laboratorio, farmacia, etc.).

## Flujo principal

1. **Búsqueda de paciente:**
	- El usuario ingresa un DNI, nombre/apellido o historia clínica.
	- El sistema busca en la base de datos y muestra los datos si el paciente existe.
	- Si no existe, ofrece registrar un nuevo paciente.

2. **Registro de paciente:**
	- Se muestra un formulario para ingresar los datos del paciente.
	- Solo los campos DNI, nombre, apellido e historia clínica son obligatorios.
	- El campo fecha de nacimiento es opcional y acepta valores nulos.
	- Al registrar, el paciente se guarda en la base de datos y se muestra en pantalla.

3. **Selección de servicio:**
	- Una vez seleccionado el paciente, se puede elegir el servicio para la atención.
	- El sistema registra la atención y puede redirigir al módulo correspondiente.

## Endpoints PHP

- `api_pacientes_buscar.php`: Busca pacientes por DNI, nombre/apellido o historia clínica (POST, JSON).
- `api_pacientes.php`: Registra un nuevo paciente (POST, JSON). Valida campos obligatorios y permite nulos en los opcionales.
- `api_atenciones.php`: Registra la atención del paciente para un servicio seleccionado.

## Componentes principales (React)

- `RecepcionModulo.jsx`: Orquesta el flujo de búsqueda, registro y atención.
- `PacienteSearch.jsx`: Formulario de búsqueda de pacientes.
- `PacienteResumen.jsx`: Muestra los datos del paciente encontrado.
- `PacienteForm.jsx`: Formulario para registrar un nuevo paciente.
- `ServiciosSelector.jsx`: Permite seleccionar el servicio para la atención.

## Consideraciones técnicas

- El frontend usa rutas absolutas para los endpoints en desarrollo (`http://localhost/policlinico-2demayo/...`).
- El backend valida y devuelve mensajes claros si falta algún campo obligatorio.
- El campo `fecha_nacimiento` acepta valores nulos.
- El sistema maneja correctamente CORS y persistencia de sesión de usuario.

---
