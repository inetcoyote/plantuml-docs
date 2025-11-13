const fs = require('fs');
const path = require('path');
const plantuml = require('plantuml');
const markdown = require('markdown-cli');

// Путь к исходникам и выводу
const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'docs');

// Создаём папку docs
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

// Читаем все .md файлы
fs.readdirSync(srcDir).filter(f => f.endsWith('.md')).forEach(file => {
  const inputPath = path.join(srcDir, file);
  const outputPath = path.join(outDir, file.replace('.md', '.html'));

  let content = fs.readFileSync(inputPath, 'utf8');

  // Заменяем ```plantuml ... ``` на <img src="data:...">
  content = content.replace(/```plantuml\n([\s\S]*?)\n```/g, (match, p1) => {
    const encoded = plantuml.encode(p1);
    return `<p><img src="https://www.plantuml.com/plantuml/svg/${encoded}" alt="PlantUML diagram" style="max-width: 100%;" /></p>`;
  });

  // Конвертируем Markdown в HTML
  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <title>Документация</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    code { background: #f4f4f4; padding: 2px 5px; }
  </style>
</head>
<body>
  <header><h1>📄 Документация</h1></header>
  <main>${markdown.parse(content)}</main>
  <footer><hr><small>Сгенерировано с помощью PlantUML + GitHub Actions</small></footer>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log(`✅ ${outputPath} создан`);
});