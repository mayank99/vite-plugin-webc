import { WebC } from '@11ty/webc';

/** @returns {import('vite').Plugin} */
export default function VitePluginWebc() {
	const virtualCssId = 'virtual:webc-generated.css';
	const virtualJsId = 'virtual:webc-generated.js';

	let externalCss = '';
	let externalJs = '';

	return {
		name: 'vite-plugin-webc',
		enforce: 'pre',
		transformIndexHtml: {
			enforce: 'pre',
			transform: async (code, { server }) => {
				// HACK: exit early in prod build, but need a more reliable way
				if (!server) return code;

				const webc = new WebC();
				webc.setContent(code);
				webc.defineComponents('src/**/*.webc');
				const { html, components } = await webc.compile();

				return {
					html,
					// HACK: importing all components so that vite knows to reload the page when they change
					tags: [
						{
							tag: 'script',
							attrs: { type: 'module' },
							children: components.map((c) => `import '${c}?url';`).join('\n'),
							injectTo: 'body',
						},
					],
				};
			},
		},
		async transform(code, id, options) {
			// HACK: exit early in dev server, but need a more reliable way
			const isDev = options?.hasOwnProperty('ssr');
			if (isDev) return;

			if (!id.endsWith('.html')) return;

			const webc = new WebC();
			webc.setBundlerMode(true);

			// HACK: prevent webc from processing unrelated styles and scripts
			const _code = code
				.replaceAll('<style', '<style webc:raw')
				.replaceAll('<script', '<script webc:raw');

			webc.setContent(_code);
			webc.defineComponents('src/**/*.webc');

			let { html, css, js } = await webc.compile();

			if (css.length) externalCss += css.join('\n');

			// HACK: webc adds \n to this string so I'm using decodeURI to remove it
			// there is 100% a better way to do this but yolo
			if (js.length) externalJs += js.map((_js) => decodeURI(_js)).join('\n');

			html = html.replace(
				'</body>',
				// Vite will automatically externalize these virtual imports into real files
				`<script type="module">
				  import '${virtualCssId}';
				  import '${virtualJsId}';
				</script>
				</body>`
			);

			return {
				code: html,
				map: null,
			};
		},
		resolveId(id) {
			if (id === virtualCssId) return `\0${id}`;
			if (id === virtualJsId) return `\0${id}`;
		},
		load(id) {
			if (id === `\0${virtualCssId}`) return externalCss;
			if (id === `\0${virtualJsId}`) return externalJs;
		},
	};
}
