# Portfolio - Rebeca

Portfolio personal desarrollado con Next.js y Tailwind CSS para mostrar proyectos y experiencia como desarrolladora web fullstack.

## 🚀 Características

- **Framework moderno**: Next.js 15 con App Router
- **Estilización responsiva**: Tailwind CSS para un diseño limpio y profesional
- **Modo oscuro/claro**: Soporte automático para tema oscuro y claro
- **Componentes reutilizables**: Arquitectura modular con componentes compartidos
- **Optimización SEO**: Configuración optimizada para motores de búsqueda

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Configuración principal de Next.js App Router
│   ├── globals.css        # Estilos globales y configuración de Tailwind
│   ├── layout.tsx         # Layout principal de la aplicación
│   └── page.tsx           # Página de inicio
├── components/            # Componentes reutilizables
│   ├── Header.js         # Navegación principal
│   ├── Footer.js         # Pie de página con información de contacto
│   └── ProjectCard.js    # Tarjeta para mostrar proyectos
└── pages/                # Páginas adicionales
    ├── index.js          # Página de inicio alternativa
    ├── about.js          # Página "Sobre Mí"
    ├── projects.js       # Página de proyectos
    └── contact.js        # Página de contacto
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework React para aplicaciones web
- **React 19** - Biblioteca para construir interfaces de usuario
- **Tailwind CSS 3** - Framework CSS utilitario
- **TypeScript** - Tipado estático para JavaScript

### Herramientas de Desarrollo
- **PostCSS** - Procesador CSS
- **Autoprefixer** - Prefijos automáticos para CSS
- **ESLint** - Linting de código

## ⚡ Instalación y Configuración

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <url-del-repositorio>
cd portfolio
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 🎨 Personalización

### Colores y Tema
Los colores del tema se definen en `src/app/globals.css`:
- Variables CSS personalizadas para colores de fondo y texto
- Soporte automático para modo oscuro mediante `prefers-color-scheme`

### Tailwind CSS
La configuración de Tailwind se encuentra en `tailwind.config.js`:
- Contenido escaneado para clases CSS
- Configuración de tema extendida
- Plugins adicionales pueden agregarse aquí

### Componentes
Los componentes están ubicados en `src/components/`:
- **Header**: Navegación principal con enlaces a todas las páginas
- **Footer**: Información de contacto y enlaces sociales
- **ProjectCard**: Tarjeta reutilizable para mostrar proyectos

## 📱 Páginas

### Página de Inicio (`/`)
- Introducción personal
- Breve descripción de servicios

### Sobre Mí (`/about`)
- Información personal y profesional
- Habilidades técnicas organizadas por categorías
- Experiencia y formación

### Proyectos (`/projects`)
- Galería de proyectos destacados
- Cada proyecto incluye descripción, tecnologías y enlaces
- Diseño responsivo en grid

### Contacto (`/contact`)
- Formulario de contacto funcional
- Información de contacto alternativa
- Enlaces a redes sociales

## 🔧 Configuración de Producción

### Variables de Entorno
Crear archivo `.env.local` para configuración específica:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Despliegue
El proyecto está configurado para desplegarse en plataformas como:
- Vercel (recomendado para Next.js)
- Netlify
- GitHub Pages

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.

## 📞 Contacto

**Rebeca** - Desarrolladora Web Fullstack
- Email: rebeca@example.com
- LinkedIn: [linkedin.com/in/rebeca](https://linkedin.com/in/rebeca)
- Portfolio: [yourdomain.com](https://yourdomain.com)

---

⭐ Si te gusta este proyecto, ¡dale una estrella!
