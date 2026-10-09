import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'node:fs'

// ---------------------------------------------------------------------------
// Per-mode manifest.json builder
// ---------------------------------------------------------------------------
function buildManifest(env: Record<string, string>) {
  const isStaff = env.VITE_Is_Staff === 'staff'

  const base = {
    name:         env.VITE_APP_TITLE       ?? 'Ivy League Associates',
    short_name:   env.VITE_APP_SHORT_TITLE ?? 'Ivy League',
    description:  env.VITE_APP_DESCRIPTION ?? 'Student Portal for Ivy League Associates.',
    version: '2.0.0',
    manifest_version: 2,
    start_url: '/',
    display: 'standalone',
    icons: [
      { src: env.VITE_APP_ICON_192 ?? 'ivy_192x192.png', sizes: '192x192', type: 'image/png' },
      { src: env.VITE_APP_ICON_512 ?? 'ivy_512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }

  if (isStaff) {
    return {
      ...base,
      shortcuts: [
        {
          name: 'Open Admin Dashboard',
          short_name: 'Dashboard',
          description: 'View the admin dashboard',
          url: '/dashboard?utm_source=homescreen',
          icons: [{ src: '/dashboard.png', sizes: '192x192' }],
        },
        {
          name: 'Open Admin Tools',
          short_name: 'Tools',
          description: 'Access admin tools',
          url: '/admin/?utm_source=homescreen',
          icons: [{ src: '', sizes: '192x192' }],
        }
      ],
      screenshots: [
        {
          src: '/largeScreenShot.png',
          sizes: '1280x720',
          type: 'image/png',
          form_factor: 'wide',
          label: 'Admin dashboard showing key metrics and management tools',
        },
      ],
    }
  }

  return {
    ...base,
    shortcuts: [
      {
        name: 'Open Dashboard',
        short_name: 'Dashboard',
        description: 'View your dashboard',
        url: '/home?utm_source=homescreen',
        icons: [{ src: '/dashboard.png', sizes: '192x192' }],
      },
      {
        name: 'View Profile',
        short_name: 'Profile',
        description: 'View your profile',
        url: '/profile?utm_source=homescreen',
        icons: [{ src: '/profile.webp', sizes: '192x192' }],
      },
    ],
    screenshots: [
      {
        src: '/largeScreenShot.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Home screen showing main navigation and featured content',
      },
      {
        src: '/largeScreenShot2.png',
        sizes: '1280x720',
        type: 'image/png',
        label: 'Dashboard view displaying key metrics',
      },
    ],
  }
}

// Intercepts /manifest.json in dev; overwrites the copied public file in build.
function dynamicManifestPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'dynamic-manifest',

    // Dev: serve before Vite's static-file middleware so public/manifest.json
    // is shadowed by the generated one.
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/manifest.json' || req.url?.startsWith('/manifest.json?')) {
          res.setHeader('Content-Type', 'application/manifest+json')
          res.end(JSON.stringify(buildManifest(env), null, 2))
          return
        }
        next()
      })
    },

    // Build: overwrite whatever Vite copied from public/ with the correct manifest.
    writeBundle(options) {
      const outDir = options.dir ?? 'dist'
      fs.writeFileSync(
        path.resolve(outDir, 'manifest.json'),
        JSON.stringify(buildManifest(env), null, 2),
      )
    },
  }
}

// ---------------------------------------------------------------------------
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      dynamicManifestPlugin(env),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      allowedHosts: ['bear-deciding-wren.ngrok-free.app', 'api.ivyleaguenigeria.com'],
    },
  }
})
