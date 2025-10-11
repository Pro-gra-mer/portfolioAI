# Portfolio AI – Rebeca

Portfolio profesional desarrollado con Next.js (App Router) y Tailwind CSS. Incluye panel de administración, integración con MySQL/Prisma, autenticación con NextAuth (credentials), subida de media con Cloudinary y APIs públicas/privadas para gestionar contenido.

## 🚀 Características

- **Next.js 15 + App Router** con arquitectura modular y SSR/ISR donde aplica.
- **Tailwind CSS** con diseño limpio, elegante, responsivo y modo oscuro/claro.
- **Panel de administración** para gestionar Hero (video/texto), Servicios, Proyectos y Experiencia.
- **Base de datos MySQL** mediante **Prisma ORM** (`schema.prisma`).
- **Autenticación** con **NextAuth Credentials** (email/contraseña).
- **Contact form** con envío por **SMTP (Nodemailer)**.
- **Assets en Cloudinary** y fallback local para algunos tipos.
- **Contenido en Markdown** cuando aplica para fácil integración.

## 📁 Estructura del Proyecto (App Router)

```
portfolio/
├── prisma/
│   └── schema.prisma           # Modelos Prisma (User, Project, Experience, Config, ServiceCard...)
├── lib/
│   └── prisma.ts               # Cliente Prisma singleton
├── public/
│   ├── uploads/                # Subidas locales autenticadas
│   └── images/books/           # Portadas estáticas usadas en BooksSection
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx            # Home (Hero, Servicios, Proyecto destacado, Libros, CTA)
    │   ├── about/
    │   │   └── page.tsx
    │   ├── contact/
    │   │   └── page.tsx
    │   ├── projects/
    │   │   ├── page.tsx        # Listado
    │   │   └── [id]/page.tsx   # Detalle
    │   ├── dashboard/          # Panel admin (Home tabs: Hero video/texto, Servicios, etc.)
    │   └── api/                # Rutas API (Next.js Route Handlers)
    │       ├── auth/[...nextauth]/route.js
    │       ├── contact/route.ts
    │       ├── upload/route.ts
    │       ├── about/route.ts
    │       ├── projects/...
    │       ├── services/route.ts
    │       ├── experience/...
    │       ├── config/(hero-text|hero-video|location)
    │       └── public/...      # Endpoints públicos de solo lectura
    └── components/
        ├── Header.js, Footer.js
        ├── sections/           # Hero, Services, FeaturedProject, Books, CTA...
        └── dashboard/home/     # HomeHeroVideoTab, HomeHeroTextTab, HomeServicesTab
```

## 🛠️ Tecnologías

- Frontend: **Next.js 15**, **React 19**, **Tailwind CSS 3**, **TypeScript**.
- Backend/Infra: **Prisma**, **MySQL**, **NextAuth**, **Nodemailer**, **Cloudinary**.
- Calidad: **ESLint**, **PostCSS/Autoprefixer**.

## ✅ Requisitos

- Node.js 18+ (recomendado 18 LTS o 20 LTS).
- MySQL (local o gestionado: PlanetScale, Railway, etc.).
- Cuenta de Cloudinary (opcional pero recomendado para imágenes/video).
- Cuenta Gmail (SMTP) o proveedor SMTP equivalente para el formulario de contacto.

## ⚙️ Variables de Entorno (.env.local)

Crea un fichero `.env.local` en la raíz con las siguientes variables. Explicación incluida:

```env
# Base de datos (MySQL)
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DB_NAME?connection_limit=5&socket_timeout=300"

# NextAuth (credentials)
NEXTAUTH_URL="http://localhost:3000"            # En prod: https://tu-dominio.com
NEXTAUTH_SECRET="<cadena-aleatoria-segura>"      # Genera con: openssl rand -base64 32

# SMTP (Nodemailer) para /api/contact
MAIL_USERNAME="tu-email@gmail.com"               # Recomendado: App Password si usas Gmail + 2FA
MAIL_PASSWORD="tu-app-password-o-credencial"
# Opcional: si quieres que reply-to sea el email del usuario
CONTACT_REPLY_TO=true

# Cloudinary (CLOUDINARY_URL recomendado)
# Formato: cloudinary://<api_key>:<api_secret>@<cloud_name>
CLOUDINARY_URL="cloudinary://API_KEY:API_SECRET@CLOUD_NAME"

# Público opcional
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Notas:
- Para Gmail se recomienda activar 2FA y usar un **App Password**.
- Prisma lee `DATABASE_URL`. Cloudinary puede leer `CLOUDINARY_URL` directamente.

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter
- `npm run seed:services` - Seed de tarjetas de servicios (si procede)

## 🗄️ Base de Datos (Prisma)

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npx prisma studio   # opcional
```

Modelos relevantes: ver `prisma/schema.prisma` (`User`, `Project`, `Experience`, `Config`, `ServiceCard`, etc.).

### Crear usuario administrador (NextAuth Credentials)

El login usa email/contraseña con hash bcrypt. Crea un usuario en la tabla `User` con la contraseña hasheada:

```bash
node -e "console.log(require('bcryptjs').hashSync('TU_CONTRASEÑA', 10))"
```

Inserta el hash en `user.password` con Prisma Studio o un cliente SQL. Luego podrás iniciar sesión en el panel.

## 🔐 Autenticación

- Proveedor: **Credentials** (email/contraseña) en `src/app/api/auth/[...nextauth]/route.js`.
- Sesiones JWT con `NEXTAUTH_SECRET`.
- Rutas admin (dashboard y APIs privadas) requieren sesión.

## 📦 Endpoints API (resumen)

- **Contacto**
  - `POST /api/contact` → Envía email vía SMTP. Campos: `name, email, company?, project, message, privacy`.

- **Upload (autenticado)**
  - `POST /api/upload` → `formData` con `file` y `type` en {`profileImage`, `heroImage`, `projectImage`, `heroVideo`}.
    - `projectImage` y `heroVideo` se suben a Cloudinary (valida formatos y tamaño: imagen ≤5MB, vídeo ≤100MB).

- **About**
  - `GET /api/about` → Obtiene contenido (o por defecto) desde `Config`.
  - `PUT /api/about` (auth) → Actualiza contenido validando estructura.

- **Configuración pública del Hero**
  - `GET /api/public/config/hero-text` → Devuelve `h1`, `subtitle`, `description`, CTAs y gradientes.
  - Existen endpoints similares para `hero-video` y `location` (públicos y privados en `/api/config/*`).

- **Proyectos**
  - Público: `GET /api/public/projects`, `GET /api/public/projects/[id]`.
  - Privado (CRUD): `/api/projects` y `/api/projects/[id]` (auth).

- **Servicios**
  - Público: `GET /api/public/services`.
  - Privado (gestión): `GET/POST/PUT/DELETE /api/services` (según implementación).

- **Experiencia**
  - Público: `GET /api/public/experience`.
  - Privado (gestión): `/api/experience` y `/api/experience/[id]` (auth).

> Revisa `src/app/api/*` para ver detalles de validación, payloads y respuestas.

## 🧭 Panel de Administración (Dashboard)

- `src/app/dashboard/home/page.tsx`: pestañas para gestionar **Video del Hero**, **Texto del Hero** y **Servicios**.
- Proyectos y experiencia cuentan con APIs y páginas dedicadas (según estructura del repo) para crear/editar contenido.

## 🖼️ Media y Assets

- Imágenes/vídeos se manejan con Cloudinary (`CLOUDINARY_URL`).
- Algunas subidas autenticadas se guardan también en `/public/uploads/<userId>/...`.
- Portadas de libros del banner: `public/images/books/*.jpg` usadas por `BooksSection`.

## 🧪 Desarrollo local

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
# Abre http://localhost:3000
```

## ☁️ Despliegue

Recomendado **Vercel**:

1. Configura variables de entorno en el proyecto de Vercel (`DATABASE_URL`, `NEXTAUTH_*`, `MAIL_*`, `CLOUDINARY_URL`).
2. Asegura que tu MySQL es accesible desde producción (usa proveedor gestionado).
3. Ejecuta migraciones en producción (Vercel: Job/CLI o en tu proveedor gestionado).

Alternativas: Netlify/Render/Railway (ajustando adaptadores y build).

## 🧰 Troubleshooting

- Error Prisma/DB: revisa `DATABASE_URL` y ejecuta `npx prisma migrate deploy` en prod.
- Emails no llegan: usa App Password (Gmail) y comprueba `MAIL_USERNAME/MAIL_PASSWORD`.
- Cloudinary: verifica `CLOUDINARY_URL` y límites de tamaño/formatos.
- Autenticación: crea un usuario con contraseña hasheada (ver sección correspondiente).

## 🤝 Contribución

1. Fork del proyecto
2. Rama feature (`git checkout -b feature/mi-feature`)
3. Commit (`git commit -m "feat: mi-feature"`)
4. Push (`git push origin feature/mi-feature`)
5. Pull Request

## 📄 Licencia

MIT. Ver archivo LICENSE si aplica.

## Contacto

**Rebeca** - Desarrolladora Web Fullstack

- GitHub: https://github.com/Pro-gra-mer
- LinkedIn: https://www.linkedin.com/in/rebeca-p%C3%A9rez-2a26772b7/
- Twitter/X: https://x.com/RebecaP50440899

---

Si este proyecto te resulta útil, ¡una estrella es muy bienvenida!
