import { defineConfig } from 'tsup';
import packageJson from './package.json';
const name = packageJson.name;
export default defineConfig((options: any) => ({
  entry: [
    'src/index.ts'
  ],
  // 格式化
  format: ['cjs', 'esm'],
  // typescript 注释
  dts: true,
  // 拆分
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  noExternal:['flex-tools','idb-keyval','unstorage','unstorage/drivers/indexedb'],
  // 压缩代码
  minify: !options.watch,
  banner: {
    js: `/**
  ${name}
*/`,
  },
}));
