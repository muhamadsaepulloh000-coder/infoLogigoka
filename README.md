# InfoLogika

InfoLogika is a small editorial/news application built with HTML5, CSS3, vanilla JavaScript, PHP 8, PHP sessions, and MySQL. It does not use a frontend or PHP framework.

## Requirements

- XAMPP with Apache and MySQL/MariaDB
- PHP 8.x with PDO MySQL and Fileinfo enabled
- A modern browser

## Install with XAMPP

1. Copy the complete project folder to XAMPP's `htdocs` directory. It should be located at `C:\xampp\htdocs\InfoLogika`.
2. Start **Apache** and **MySQL** in the XAMPP Control Panel.
3. Open phpMyAdmin at `http://localhost/phpmyadmin`.
4. Select **Import**, choose `database/infologika.sql`, and run the import. The script creates the `infologika` database, its four tables, and a demo admin account.
5. Check `backend/config/database.php`. Its defaults match a standard XAMPP install: host `127.0.0.1`, port `3306`, database `infologika`, user `root`, and an empty password. If your MySQL root account has a password, configure the `INFOLOGIKA_DB_PASSWORD` environment variable for Apache/PHP, or change the local connection settings in that file. Do not commit production credentials.
6. Confirm PHP has `pdo_mysql` and `fileinfo` enabled in `C:\xampp\php\php.ini`. Restart Apache after changing the PHP configuration.
7. Open the website at `http://localhost/InfoLogika/`. Do not open `index.html` directly from the filesystem; session cookies and API requests require Apache.

The upload directory is `backend/uploads/news/`. Apache needs permission to write there. The included `.htaccess` prevents script execution in the uploads directory. Keep it in place when deploying.

## Demo administrator

- Email: `admin@infologika.local`
- Password: `Admin123!`

The SQL seed contains a bcrypt password hash created with PHP `password_hash()`. The plaintext demo password is documented here only; it is not hardcoded into PHP. Change/remove the demo account before deploying outside a local classroom environment.

## Test a user account

1. Open the site and choose **Sign in** → **Create account**.
2. Register with a name, a unique email, and a password between 10 and 72 bytes.
3. After registration the user is signed in. The contributor name on the story form is populated from the PHP session; the API ignores any client-supplied `user_id` or contributor name.

## Submit and review a story

1. While signed in as a regular user, open **Submit a story**.
2. Enter title, category, HTTP/HTTPS source URL, story content, and propositions P and Q. The PHP logic engine does not invent or rewrite P/Q.
3. Optionally select a JPG/JPEG, PNG, or WEBP image no larger than 5 MB.
4. Submit. The story is saved as `pending` and does not appear in the public journal.
5. Sign out, then sign in as the demo administrator.
6. Open **Admin**. Review a pending story, inspect the full submission and source, then publish or decline it. Publishing runs the PHP logic engine and stores the analysis plus four truth-table rows in one database transaction. Only approved stories appear in the public journal.
7. The administrator may delete stories. MySQL cascades their logic and truth-table records; the associated uploaded image is removed as well.

## API endpoints

All endpoints return JSON under `{ "success": boolean, "message": string, "data": object }` when successful. Failed responses contain `success` and a safe `message`. Mutating endpoints require the session's `X-CSRF-Token`, retrieved from `GET backend/api/auth-status.php`. The browser client sends same-origin session cookies automatically.

- `GET backend/api/auth-status.php`
- `POST backend/api/register.php`
- `POST backend/api/login.php`
- `POST backend/api/logout.php`
- `GET backend/api/get-news.php`
- `GET backend/api/get-news-detail.php?id=ID`
- `POST backend/api/submit-news.php`
- `POST backend/api/upload-image.php` (multipart field name: `image`)
- `GET backend/api/get-pending-news.php` (administrator only; optional `?status=all|pending|approved|rejected`)
- `POST backend/api/approve-news.php` (administrator only)
- `POST backend/api/reject-news.php` (administrator only)
- `POST backend/api/delete-news.php` (administrator only)

The frontend also loads published detail analysis from the database. Quantifier text and truth values are generated deterministically from P and Q in `backend/logic/logic-engine.php`; no AI service is used.

## Troubleshooting

- **Database connection error:** ensure MySQL is running, import the SQL file, and check host, port, database name, username, and password in `backend/config/database.php`.
- **404 for an API request:** the project folder must be named `InfoLogika` directly under `htdocs`; access it through `http://localhost/InfoLogika/`.
- **Session/login issues:** use the same `localhost` hostname for all requests, enable PHP sessions, and access the page through Apache rather than `file://`.
- **Uploads fail:** enable Fileinfo, confirm the image is under 5 MB, and allow Apache to write to `backend/uploads/news/`.
- **HTTP 500 from PHP:** inspect the Apache/PHP error log in `C:\xampp\apache\logs\error.log`; API responses intentionally do not expose database credentials, stack traces, or server paths.
- **Admin access denied:** the signed-in account must have `role = 'admin'` in the `users` table. Hiding the dashboard in the frontend is not authorization; every admin API checks the role in the PHP session.
