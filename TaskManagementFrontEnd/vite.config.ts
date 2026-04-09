// https://vite.dev/config/
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,           // Allows using 'describe' and 'it' without importing them
        environment: 'jsdom',    // Simulates a browser environment
        setupFiles: './src/setupTests.ts',
    },
})
