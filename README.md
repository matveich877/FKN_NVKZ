# Сайт Федерации каратэ г. Новокузнецк

Многостраничный статический сайт для GitHub Pages.

## Структура

- `index.html` — Главная (приветствие президента, превью новостей и календаря)
- `team.html` — Сборная
- `coaches.html` — Тренеры
- `calendar.html` — Календарь мероприятий
- `gallery.html` — Фотогалерея
- `news.html` — Новости
- `documents.html` — Документы

## Размещение на GitHub Pages

1. Создайте репозиторий на GitHub.
2. Загрузите **все** файлы и папки в корень репозитория.
3. Settings → Pages → Source: **main** branch, folder **/(root)** → Save.
4. Сайт будет доступен по адресу `https://ВАШ-НИК.github.io/НАЗВАНИЕ-РЕПО/`

## Важно: избежать ошибки 404

GitHub Pages чувствителен к регистру имён файлов. Убедитесь, что:
- Файлы `news.html` и `documents.html` загружены в корень репозитория
- В меню ссылки указаны точно: `href="news.html"` и `href="documents.html"`
- Нет пробелов в именах файлов

## Обновление данных

Все данные в папке `data/` в формате CSV (кодировка UTF-8, разделитель — запятая).

### data/team.csv
`name,age_category,weight_category,club,coach,results,photo_url`

### data/calendar.csv
`date,title,location,documents`
- date: ДД.ММ.ГГГГ или ГГГГ-ММ-ДД
- documents: JSON-массив `[{"name":"...","url":"..."}]`

### data/coaches.csv
`name,club,category,achievements,photo_url`

### data/gallery.csv
`date,title,photo_urls,yandex_disk_link`
- photo_urls: пути через точку с запятой

### data/news.csv
`date,title,content,image_url`

### data/documents.csv
`category,title,file_url,date`

## Добавление фото и документов

- Фото: `media/team/`, `media/coaches/`, `media/gallery/`, `media/news/`, `media/president/`
- Документы: `docs/`
- Укажите пути в соответствующих CSV-файлах

## Логотип и фото президента

- Логотип: замените `<div class="logo-placeholder">` в `index.html` на `<img src="./media/logo.png">`
- Президент: замените блок `president-photo` в `index.html` на `<img src="./media/president/foto.jpg">`
