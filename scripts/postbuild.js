import fs from 'fs';
import path from 'path';

const clientDir = path.resolve('dist/client');
if (!fs.existsSync(clientDir)) {
  fs.mkdirSync(clientDir, { recursive: true });
}

const assetsDir = path.join(clientDir, 'assets');
const assets = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
const mainJs = assets.find(f => f.startsWith('index-') && f.endsWith('.js')) || '';
const mainCss = assets.find(f => f.endsWith('.css')) || '';

const htmlContent = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>CH TRADERS — Electronics & Crockery Store | Gujrat</title>
    <meta name="description" content="Shop premium electronics and crockery at CH TRADERS, Railway Road Gujrat. Juicers, blenders, kettles, microwaves, cookware sets and more — fast delivery across Pakistan." />
    <meta name="author" content="Aqib Ahmed" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@600;700;800&display=swap" />
    ${mainCss ? `<link rel="stylesheet" href="/assets/${mainCss}" />` : ''}
  </head>
  <body>
    <div id="root"></div>
    ${mainJs ? `<script type="module" src="/assets/${mainJs}"></script>` : ''}
  </body>
</html>`;

fs.writeFileSync(path.join(clientDir, 'index.html'), htmlContent);
fs.writeFileSync(path.join(clientDir, '_redirects'), '/*    /index.html   200\n');
console.log('Postbuild: Successfully generated dist/client/index.html and dist/client/_redirects with main entry:', mainJs);
