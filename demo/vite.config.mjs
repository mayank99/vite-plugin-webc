import { defineConfig } from 'vite';
import VitePluginWebc from '../plugin/index.mjs';

export default defineConfig({
	plugins: [VitePluginWebc()],
});
