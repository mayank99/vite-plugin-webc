import { defineConfig } from 'vite';
import VitePluginWebc from 'vite-plugin-webc';
import postcssPresetEnv from 'postcss-preset-env';

export default defineConfig({
	plugins: [VitePluginWebc()],
	css: {
		postcss: {
			plugins: [postcssPresetEnv({ features: { 'nesting-rules': true } })],
		},
	},
});
