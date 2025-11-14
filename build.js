const fs = require('fs');
const path = require('path');
const { encode } = require('plantuml-encoder');

// Пути
const srcDir = path.join(__dirname, 'src');
const outDir = path.join(__dirname, 'docs');

// Создаём папку docs, если её нет
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
  console.log('📁 Создана папка: docs');
}

// Проверяем, есть ли исходные .md файлы
if (!fs.existsSync(srcDir)) {
  console.error('❌ Папка src/ не найдена. Создай её и добавь .md файлы.');
  process.exit(1);
}

const mdFiles = fs.readdirSync(srcDir).filter(file => file.endsWith('.md'));

if (mdFiles.length === 0) {
  console.log('⚠️  В папке src/ нет .md файлов.');
  process.exit(0);
}

console.log(`📄 Найдено Markdown-файлов: ${mdFiles.length}`);

// Основной цикл: обработка каждого .md файла
mdFiles.forEach(file => {
  const inputPath = path.join(srcDir, file);
  const outputFileName = file.replace('.md', '.html');
  const outputPath = path.join(outDir, outputFileName);

  try {
    let content = fs.readFileSync(inputPath, 'utf8');
    console.log(`🔄 Обрабатывается: ${file}`);

    // Заменяем блоки ```plantuml ... ``` на <img>
    content = content.replace(/```plantuml\n([\s\S]*?)\n```/gs, (match, p1) => {
      try {
        const encoded = encode(p1.trim());
        const imgUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;
        return `<p><img src="${imgUrl}" alt="PlantUML диаграмма" style="max-width: 100%; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" /></p>`;
      } catch (err) {
        console.error(`❌ Ошибка кодирования диаграммы в файле ${file}:`, err.message);
        return `<p><em>❌ Ошибка генерации диаграммы</em></p>`;
      }
    });

    // Простая конвертация Markdown в HTML (без внешних библиотек)
    let html = content
      .replace(/\n# (.*?)\n/g, '\n<h1>$1</h1>\n')
      .replace(/\n## (.*?)\n/g, '\n<h2>$1</h2>\n')
      .replace(/\n### (.*?)\n/g, '\n<h3>$1</h3>\n')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\n- (.*?)(?=\n- |\n$)/g, '<li>$1</li>')
      .replace(/<li>.*?<\/li>/gs, '<ul>$&</ul>')
      .replace(/\n\d+\. (.*?)(?=\n\d+\. |\n$)/g, '<li>$1</li>')
      .replace(/(<li>.*?<\/li>)+/gs, '<ol>$&</ol>')
      .replace(/\n([^<].*?)(?=\n## |\n# |\n$)/gs, '<p>$1</p>')
      .replace(/\n{2,}/g, '\n');

    // Финальный HTML
    const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Документация</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      line-height: 1.7;
      color: #333;
      max-width: 900px;
      margin: 40px auto;
      padding: 20px;
    }
    code {
      background: #f2f2f2;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    pre code {
      display: block;
      background: #f4f4f4;
      padding: 12px;
      border-radius: 6px;
      overflow: auto;
    }
    img {
      display: block;
      margin: 20px 0;
      border-radius: 8px;
    }
    h1, h2, h3 {
      color: #2c3e50;
    }
    footer {
      margin-top: 50px;
      color: #777;
      font-size: 0.9em;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <h1>📄 Документация</h1>
  </header>
  <main>
    ${html}
  </main>
  <footer>
    <hr>
    <small>Сгенерировано с помощью PlantUML + GitHub Actions</small>
  </footer>
</body>
</html>`;

    fs.writeFileSync(outputPath, fullHtml, 'utf8');
    console.log(`✅ Успешно сохранён: ${outputFileName}`);
  } catch (err) {
    console.error(`❌ Ошибка при обработке ${file}:`, err.message);
  }
});

console.log('🎉 Сборка завершена!');