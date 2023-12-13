import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { Http } from '@mui/icons-material';

/* eslint-disable no-template-curly-in-string */
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		server: {
			port: 3001,
			proxy: {
				'/api/socket': 'ws://localhost:8082',
				'/api': 'http://localhost:8082'
			},
		},
		build: {
			outDir: 'build',
		},
		define: {
			'process.env': JSON.stringify(env)
		},
		plugins: [
			svgr(),
			react(),
			VitePWA({
				registerType: 'autoUpdate',
				workbox: {
					navigateFallbackDenylist: [/^\/api/],
				},
				manifest: {
					short_name: '${title}',
					name: '${description}',
					theme_color: '${colorPrimary}',
					icons: [
						{
							src: 'pwa-64x64.png',
							sizes: '64x64',
							type: 'image/png',
						},
						{
							src: 'pwa-192x192.png',
							sizes: '192x192',
							type: 'image/png',
						},
						{
							src: 'pwa-512x512.png',
							sizes: '512x512',
							type: 'image/png',
							purpose: 'any maskable',
						},
					],
				},
			}),
		],
	}
});
