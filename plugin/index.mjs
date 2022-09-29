import { WebC } from '@11ty/webc';

/** @returns {import('vite').Plugin} */
export default function VitePluginWebc() {
	return {
		name: 'vite-plugin-webc',
		enforce: 'pre',
		async transform(code, id) {
			if (!id.includes('.html')) return;

			const webc = new WebC();
			webc.setContent(code);
			webc.defineComponents('src/**/*.webc');

			const { html, css, js } = await webc.compile();

			return {
				code: html,
				map: null,
			};
		},
	};
}
