import { defineConfig } from 'vite'
import RubyPlugin from 'vite-plugin-ruby'
import tailwindcss from 'tailwindcss'
// import viteCompression from 'vite-plugin-compression';
import gzipPlugin from 'rollup-plugin-gzip'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    gzipPlugin()
  ],
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  }
})
