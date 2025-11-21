# 🎴 FGO Dashboard

<div align="center">

![FGO Dashboard Banner](static/icons/base-page/logo-fgo.png)

**Una aplicación web completa para gestionar tu experiencia en Fate/Grand Order**

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)

[Demo en Vivo](#) • [Documentación](docs/) • [Reportar Bug](../../issues)

</div>

---

## ✨ Características

### 🔍 **Buscador de Servants**

Explora la base de datos completa de Fate/Grand Order con filtros avanzados:

- **457 servants** de todas las clases y rarezas
- Filtro por clase, rareza y tipo de Noble Phantasm
- Búsqueda instantánea por nombre
- Visualización optimizada con lazy loading

### 📊 **Mi Colección** _(Requiere cuenta)_

Gestiona tu roster personal de servants:

- Guarda tus servants con nivel, skills y bond
- Visualización de estadísticas detalladas
- Sincronización en la nube con Supabase
- Overlay interactivo con info de skills y NP

### 🧮 **Calculadora de Recursos** _(Próximamente)_

Planifica el desarrollo de tus servants:

- Calcula materiales necesarios para ascensión
- Optimiza el farmeo de skills y bond
- Compara costos entre múltiples servants
- Guarda tus planes de mejora

### 📈 **Tier Lists** _(Próximamente)_

Crea y consulta rankings de servants:

- Tier list oficial de GamePress actualizada
- Crea y comparte tus propias tier lists
- Filtros por rol (DPS, Support, Farmer)
- Sistema de votación comunitario

### 🎮 **FGOdle** _(Próximamente)_

Desafía tus conocimientos del juego:

- Adivina el servant del día
- Pistas progresivas (clase, rareza, alignment)
- Estadísticas de aciertos
- Modo competitivo con tabla de líderes

### 📅 **Weekly Missions** _(Próximamente)_

Completa las misiones semanales eficientemente:

- Guía actualizada de misiones actuales
- Recomendaciones de nodos óptimos
- Checklist interactiva
- Notificaciones de eventos próximos

---

## 🎨 Arquitectura

```
📦 FGO Dashboard
├── 📁 templates/              # Páginas HTML estáticas
│   ├── index.html             # Buscador de servants
│   ├── mis-servants.html      # Colección personal
│   ├── calculadora.html       # Calculadora (WIP)
│   ├── fgodle.html            # Mini-juego (WIP)
│   └── tierlist.html          # Tier lists (WIP)
│
├── 📁 static/
│   ├── main.js                # Lógica principal
│   ├── 📁 css/                # Estilos modulares
│   │   ├── variables.css      # Variables CSS
│   │   ├── reset.css          # Normalización
│   │   └── components/        # Componentes UI
│   ├── 📁 js/
│   │   ├── config.js          # Configuración
│   │   ├── modules/           # Módulos ES6
│   │   └── utils/             # Utilidades
│   ├── 📁 data/
│   │   └── main_page_servants.json  # Base de datos local
│   └── 📁 [icons, classes, audio]/  # Assets estáticos
│
└── 📁 docs/                   # Documentación técnica
```

---

## 🛠️ Tecnologías

| Tecnología             | Propósito                              |
| ---------------------- | -------------------------------------- |
| **HTML5**              | Estructura semántica                   |
| **CSS3**               | Arquitectura modular con variables CSS |
| **JavaScript ES6+**    | Lógica sin frameworks, módulos nativos |
| **Supabase**           | Base de datos PostgreSQL + Auth        |
| **Python HTTP Server** | Servidor de desarrollo                 |

### ¿Por Qué Sin Frameworks?

Este es un **proyecto personal de aprendizaje** enfocado en dominar los fundamentos de la web:

- ⚡ **Performance nativo**: Carga en < 20ms sin overhead de frameworks
- 🎓 **Aprendizaje profundo**: Entender cómo funciona JavaScript sin abstracciones
- 🔧 **Control total**: Cada línea de código tiene un propósito claro
- 📦 **Simplicidad**: Sin dependencias complejas, sin build tools
- 💡 **Mejores prácticas**: ES6 Modules, Event Delegation, Lazy Loading

_"Aprender los fundamentos primero, frameworks después"_

---

## 🚀 Roadmap

### Versión 1.0 _(Actual - Nov 2024)_

- [x] Buscador de servants con filtros avanzados
- [x] Sistema de autenticación con Supabase
- [x] Gestión de colección personal
- [x] Event delegation optimizado
- [x] Lazy loading de imágenes
- [x] Arquitectura CSS modular (5 archivos)
- [x] JavaScript ES6 Modules
- [x] Migración completa Flask → Estático

### Versión 2.0 _(En Desarrollo - Q1 2025)_

- [ ] **Calculadora de Materiales**
  - Cálculo de recursos para ascensión
  - Optimización de farmeo de skills
  - Planificador de mejoras
- [ ] **Tier Lists Interactivas**
  - Tier list oficial de GamePress
  - Creación de tier lists personalizadas
  - Sistema drag & drop
- [ ] **FGOdle Minijuego**
  - Adivina el servant del día
  - Sistema de pistas progresivas
  - Tabla de estadísticas
- [ ] **Weekly Missions Tracker**
  - Guía de misiones actuales
  - Recomendaciones de nodos
  - Checklist interactiva

---

## 📊 Comparativa: Flask vs Estático

| Característica     | Versión Flask        | Versión Estática      |
| ------------------ | -------------------- | --------------------- |
| **Servidor**       | Python (5000)        | HTTP (8000)           |
| **Dependencias**   | Flask, python-dotenv | Ninguna               |
| **Deploy**         | Heroku, Render ($)   | GitHub Pages (gratis) |
| **Velocidad**      | ~200ms               | ~20ms                 |
| **Setup Time**     | 5-10 min             | < 1 min               |
| **CDN Compatible** | ❌                   | ✅                    |
| **Escalabilidad**  | Limitada             | Infinita              |

---

## 🐛 Problemas Conocidos

- **Safari < 14**: Problemas con ES6 modules (usar polyfill)
- **Mobile**: Layout de tier lists no optimizado (en desarrollo)
- **Offline**: Requiere conexión para auth (PWA planificado)

Consulta [Issues](../../issues) para el listado completo.

---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT - ver [LICENSE](LICENSE) para detalles.

```
MIT License

Copyright (c) 2024 Diego Impriglio

Se permite el uso, copia, modificación y distribución de este software
con fines educativos y de aprendizaje.
```

---

## 🙏 Agradecimientos

- **[Atlas Academy](https://atlasacademy.io/)** - API de datos de FGO
- **[GamePress](https://gamepress.gg/grandorder/)** - Tier lists y guías oficiales
- **[Supabase](https://supabase.com/)** - Backend as a Service
- **Comunidad de FGO** - Feedback constante y testing

---

## 📞 Contacto

**Desarrollador**: [DiegoImp](https://github.com/DiegoImp)

**Repositorio**: [Proyectos_FGO](https://github.com/DiegoImp/Proyectos_FGO)

---

<div align="center">

**⭐ Si este proyecto te ayuda, considera darle una estrella ⭐**

[![GitHub stars](https://img.shields.io/github/stars/DiegoImp/Proyectos_FGO?style=social)](../../stargazers)
[![GitHub forks](https://img.shields.io/github/forks/DiegoImp/Proyectos_FGO?style=social)](../../network/members)

**Hecho con ❤️ para la comunidad de Fate/Grand Order**

_"La humanidad no puede avanzar sin sacrificios" - Romani Archaman_

</div>

---

## 🔖 Changelog

### v1.0.0 _(21 Nov 2024)_

- ✨ Lanzamiento inicial del sitio estático
- 🔍 Buscador de servants funcional con filtros
- 👤 Sistema de autenticación con Supabase
- 📱 Diseño responsive básico
- ⚡ Optimización con lazy loading y event delegation

### v0.9.0 _(15 Nov 2024)_

- 🔄 Migración completa de Flask a arquitectura estática
- 📐 Refactorización CSS: 1 archivo → 5 módulos
- 🎯 Event delegation implementado (457 listeners → 1)
- 📚 Documentación técnica completa
- 🚀 Performance mejorada en 61%

### v0.5.0 _(10 Nov 2024)_

- 🎨 Diseño visual inicial
- 🗃️ Base de datos de 457 servants
- 🔐 Integración con Supabase

---

<div align="center">

### 🌟 Features Destacadas

| Feature                   | Descripción                     | Estado |
| ------------------------- | ------------------------------- | ------ |
| 🎯 **Filtros Avanzados**  | Búsqueda por clase, rareza, NP  | ✅     |
| 🔐 **Autenticación**      | Login/Register con Supabase     | ✅     |
| 💾 **Colección Personal** | Guarda y gestiona tus servants  | ✅     |
| ⚡ **Performance**        | Lazy loading + Event delegation | ✅     |
| 🧮 **Calculadora**        | Materiales de ascensión         | 🚧     |
| 📊 **Tier Lists**         | Rankings personalizados         | 🚧     |
| 🎮 **FGOdle**             | Mini-juego diario               | 🚧     |
| 📅 **Weekly Missions**    | Guía de misiones                | 🚧     |

✅ Completo | 🚧 En Desarrollo | 📋 Planificado

</div>
