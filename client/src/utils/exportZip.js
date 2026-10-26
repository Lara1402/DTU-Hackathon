/**
 * Export Zip Utility for MoodUI Studio
 * Generates an end-to-end, runnable Vite + React project zip bundle.
 */

import JSZip from 'jszip';
import { generateReactCode, generateStandaloneHtml } from './codeGenerators.js';

export async function exportReactProjectZip(components, palette, projectName = 'moodui-project') {
  const zip = new JSZip();

  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'moodui-app';

  // 1. package.json
  const packageJson = {
    name: slug,
    private: true,
    version: '1.0.0',
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview'
    },
    dependencies: {
      react: '^18.3.1',
      'react-dom': '^18.3.1',
      'lucide-react': '^0.475.0'
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.3.4',
      vite: '^5.4.11'
    }
  };
  zip.file('package.json', JSON.stringify(packageJson, null, 2));

  // 2. vite.config.js
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;
  zip.file('vite.config.js', viteConfig);

  // 3. index.html
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
  zip.file('index.html', indexHtml);

  // 4. src/main.jsx
  const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  zip.file('src/main.jsx', mainJsx);

  // 5. src/App.jsx
  const appJsx = generateReactCode(components, palette, projectName);
  zip.file('src/App.jsx', appJsx);

  // 6. src/index.css
  const indexCss = `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  line-height: 1.5;
}
`;
  zip.file('src/index.css', indexCss);

  // 7. README.md
  const readme = `# ${projectName}

Generated with **MoodUI Studio** (Imagine. Build. Refine. Debug.)

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build production bundle:
\`\`\`bash
npm run build
\`\`\`
`;
  zip.file('README.md', readme);

  // Generate blob & download
  const blob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(blob, `${slug}.zip`);
}

export function downloadStandaloneHtmlFile(components, palette, projectName = 'moodui-project') {
  const html = generateStandaloneHtml(components, palette, projectName);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'index';
  downloadBlob(blob, `${slug}.html`);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
