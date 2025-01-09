import vue from '@vitejs/plugin-vue'

export default {
  plugins: [vue()],
  build: {
    target: 'esnext',  // Usa ESNext per supportare i moduli moderni
    sourcemap: true,   // Abilita la generazione di sourcemap per il debugging
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue'],
    alias: {
      '@': '/src',
    }
  },
}
