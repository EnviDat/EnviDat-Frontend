import { configDefaults, ConfigEnv, defineConfig, mergeConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import viteConfig from './vite.config.ts';

export default defineConfig((configEnv: ConfigEnv) =>
  mergeConfig(
    viteConfig({ mode: 'test', config: configEnv }),
    defineConfig({
      test: {
        exclude: [
          ...configDefaults.exclude,
          './tests/unit/ckanRegression.spec.js',
          './tests/unit/viewModelsFactory.spec.js',
          './stories/**',
        ],
      },
      plugins: [tsconfigPaths()],
    }),
  ),
);
