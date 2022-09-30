# vite-plugin-webc

A vite plugin for [WebC](https://github.com/11ty/webc).

1. Install the package:

```shell
npm i -D vite-plugin-webc
```

2. Add the plugin to the vite config:

```js
import { defineConfig } from 'vite';
import VitePluginWebc from 'vite-plugin-webc';

export default defineConfig({
	plugins: [VitePluginWebc()],
});
```

3. Define your .webc files anywhere in the `src/` directory and start using them in your html!
