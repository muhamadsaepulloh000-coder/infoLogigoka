/* InfoLogika frontend: vanilla JavaScript client for the PHP session API. */
const API_BASE = "backend/api";
const translations = {
    en: {
        "brand.tagline": "News & Logic Journal", "nav.home": "Home", "nav.submit": "Submit a story", "nav.stories": "Folk stories", "nav.admin": "Admin",
        "theme.dark": "Dark mode", "theme.light": "Light mode", "home.eyebrow": "LOGIC & INFORMATICS", "home.titleFirst": "Read the news.", "home.titleSecond": "Understand the logic.",
        "home.intro": "A thoughtful space to explore news, everyday reasoning, and the logic behind the stories we read.", "home.explore": "Browse stories", "home.logicLabel": "A LOGIC EXAMPLE", "home.implication": "If P is true, then Q is true", "home.latest": "THE JOURNAL", "home.featured": "Recent stories", "home.addStory": "+ Share a story",
        "stories.eyebrow": "COMMUNITY", "stories.intro": "Traditional stories, revisited through the lens of propositional logic.", "submit.eyebrow": "CONTRIBUTE", "submit.title": "Share a story", "submit.intro": "Submit a story for thoughtful discussion. Every contribution is reviewed before publication.", "submit.step1": "Tell us who you are", "submit.step2": "Share a story and its propositions", "submit.step3": "A reviewer checks your submission", "submit.step4": "Explore the logic behind it",
        "form.contributorSection": "About you", "form.contributorName": "Your name", "form.contributorPlaceholder": "Your account name", "form.storySection": "Story details", "form.title": "Story title", "form.titlePlaceholder": "Give your story a clear title", "form.category": "Category", "form.source": "Source URL", "form.content": "Story text", "form.contentPlaceholder": "Write or paste the story here...", "form.image": "Cover image", "form.imageHint": "JPG, PNG, or WEBP. Maximum 5 MB.", "form.imageAlt": "Preview of the selected cover image", "form.logicSection": "Logic to explore", "form.logicHint": "Enter propositions P and Q. PHP generates the logical analysis after an administrator approves the story.", "form.premiseP": "Statement P", "form.premiseQ": "Statement Q", "form.premisePPlaceholder": "Enter proposition P", "form.premiseQPlaceholder": "Enter proposition Q", "form.submit": "Send for review", "form.reviewNote": "Your story appears after review.", "common.optional": "(optional)", "common.close": "Close dialog",
        "admin.eyebrow": "EDITORIAL DESK", "admin.title": "Submission review", "admin.intro": "Review incoming stories and decide what belongs in the journal.", "admin.refresh": "Refresh submissions", "admin.total": "All stories", "admin.pending": "Needs review", "admin.published": "Published", "admin.rejected": "Declined", "admin.submissions": "Inbox", "admin.filterAll": "All", "admin.story": "Story", "admin.contributor": "Contributor", "admin.status": "Status", "admin.date": "Date", "admin.actions": "Actions",
        "category.Technology": "Technology", "category.Education": "Education", "category.Social": "Society", "category.Environment": "Environment", "category.Economy": "Economy", "category.General": "General", "category.Folk Stories": "Folk stories", "logic.true": "True", "logic.false": "False",
        "empty.news": "No stories have been published yet.", "empty.folk": "No folk stories have been published yet.", "empty.admin": "There are no submissions in this view.", "article.by": "By", "article.read": "Read analysis", "article.source": "View source", "article.analysis": "Logic analysis", "article.premises": "Statements", "article.forms": "Logical forms", "article.implication": "Implication", "article.converse": "Converse", "article.inverse": "Inverse", "article.contrapositive": "Contrapositive", "article.inference": "Inference", "article.universalQuantifier": "Universal quantifier", "article.existentialQuantifier": "Existential quantifier", "article.truthTable": "Truth table",
        "status.pending": "Needs review", "status.approved": "Published", "status.rejected": "Declined", "action.approve": "Publish", "action.reject": "Decline", "action.view": "Open", "action.delete": "Delete",
        "auth.signIn": "Sign in", "auth.signOut": "Sign out", "auth.register": "Create account", "auth.email": "Email", "auth.password": "Password", "auth.name": "Name", "auth.passwordHint": "Use 10–72 bytes.",
        "toast.required": "Please complete all required fields.", "toast.loginRequired": "Sign in to submit a story.", "toast.accessDenied": "Administrator access is required.", "toast.upload": "The image could not be uploaded.", "toast.imageType": "Choose a JPG, PNG, or WEBP image.", "toast.imageTooLarge": "Images must be smaller than 5 MB.", "toast.credentials": "Email or password is incorrect.", "toast.emailExists": "An account with this email already exists.", "toast.invalidEmail": "Enter a valid email address.", "toast.passwordLimit": "Password must be between 10 and 72 bytes.", "toast.csrf": "Your session expired. Refresh the page and try again.", "toast.submitted": "Your story was submitted and is awaiting administrator review.", "toast.published": "Story published and analysis generated.", "toast.rejected": "Story declined.", "toast.deleted": "Story deleted.", "toast.confirmDelete": "Delete this story permanently?", "toast.network": "Could not connect to the server. Check that Apache and MySQL are running.", "toast.server": "The request could not be completed.", "toast.loggedOut": "You have been signed out.", "toast.registered": "Your account is ready.", "toast.loggedIn": "Welcome back.", "toast.noAnalysis": "Logic analysis is generated after approval."
    },
    id: {
        "brand.tagline": "Jurnal Berita & Logika", "nav.home": "Beranda", "nav.submit": "Kirim cerita", "nav.stories": "Cerita rakyat", "nav.admin": "Admin",
        "theme.dark": "Mode gelap", "theme.light": "Mode terang", "home.eyebrow": "LOGIKA & INFORMATIKA", "home.titleFirst": "Membaca berita.", "home.titleSecond": "Memahami logikanya.",
        "home.intro": "Ruang untuk mengulas berita, penalaran sehari-hari, dan logika di balik cerita yang kita baca.", "home.explore": "Jelajahi cerita", "home.logicLabel": "CONTOH LOGIKA", "home.implication": "Jika P benar, maka Q benar", "home.latest": "JURNAL", "home.featured": "Cerita terbaru", "home.addStory": "+ Kirim cerita",
        "stories.eyebrow": "KOMUNITAS", "stories.intro": "Cerita tradisional yang ditinjau kembali melalui logika proposisi.", "submit.eyebrow": "KONTRIBUSI", "submit.title": "Kirim cerita", "submit.intro": "Kirim cerita untuk dibahas bersama. Setiap kontribusi akan ditinjau sebelum diterbitkan.", "submit.step1": "Perkenalkan diri Anda", "submit.step2": "Bagikan cerita dan proposisinya", "submit.step3": "Kiriman ditinjau oleh editor", "submit.step4": "Pelajari logika di baliknya",
        "form.contributorSection": "Tentang Anda", "form.contributorName": "Nama Anda", "form.contributorPlaceholder": "Nama akun Anda", "form.storySection": "Detail cerita", "form.title": "Judul cerita", "form.titlePlaceholder": "Buat judul yang jelas", "form.category": "Kategori", "form.source": "URL sumber", "form.content": "Isi cerita", "form.contentPlaceholder": "Tulis atau tempel cerita di sini...", "form.image": "Gambar sampul", "form.imageHint": "Format JPG, PNG, atau WEBP. Maksimal 5 MB.", "form.imageAlt": "Pratinjau gambar sampul yang dipilih", "form.logicSection": "Logika untuk dibahas", "form.logicHint": "Masukkan proposisi P dan Q. PHP membuat analisis logika setelah cerita disetujui admin.", "form.premiseP": "Pernyataan P", "form.premiseQ": "Pernyataan Q", "form.premisePPlaceholder": "Masukkan proposisi P", "form.premiseQPlaceholder": "Masukkan proposisi Q", "form.submit": "Kirim untuk ditinjau", "form.reviewNote": "Cerita tampil setelah ditinjau.", "common.optional": "(opsional)", "common.close": "Tutup dialog",
        "admin.eyebrow": "MEJA REDAKSI", "admin.title": "Tinjau kiriman", "admin.intro": "Tinjau cerita yang masuk dan tentukan mana yang layak diterbitkan.", "admin.refresh": "Muat ulang kiriman", "admin.total": "Semua cerita", "admin.pending": "Perlu ditinjau", "admin.published": "Terbit", "admin.rejected": "Ditolak", "admin.submissions": "Kotak masuk", "admin.filterAll": "Semua", "admin.story": "Cerita", "admin.contributor": "Kontributor", "admin.status": "Status", "admin.date": "Tanggal", "admin.actions": "Tindakan",
        "category.Technology": "Teknologi", "category.Education": "Pendidikan", "category.Social": "Sosial", "category.Environment": "Lingkungan", "category.Economy": "Ekonomi", "category.General": "Umum", "category.Folk Stories": "Cerita rakyat", "logic.true": "Benar", "logic.false": "Salah",
        "empty.news": "Belum ada cerita yang diterbitkan.", "empty.folk": "Belum ada cerita rakyat yang diterbitkan.", "empty.admin": "Tidak ada kiriman pada tampilan ini.", "article.by": "Oleh", "article.read": "Baca analisis", "article.source": "Lihat sumber", "article.analysis": "Analisis logika", "article.premises": "Pernyataan", "article.forms": "Bentuk logika", "article.implication": "Implikasi", "article.converse": "Konvers", "article.inverse": "Invers", "article.contrapositive": "Kontraposisi", "article.inference": "Inferensi", "article.universalQuantifier": "Kuantor universal", "article.existentialQuantifier": "Kuantor eksistensial", "article.truthTable": "Tabel kebenaran",
        "status.pending": "Perlu ditinjau", "status.approved": "Terbit", "status.rejected": "Ditolak", "action.approve": "Terbitkan", "action.reject": "Tolak", "action.view": "Buka", "action.delete": "Hapus",
        "auth.signIn": "Masuk", "auth.signOut": "Keluar", "auth.register": "Buat akun", "auth.email": "Email", "auth.password": "Kata sandi", "auth.name": "Nama", "auth.passwordHint": "Gunakan 10–72 byte.",
        "toast.required": "Mohon lengkapi semua kolom wajib.", "toast.loginRequired": "Masuk untuk mengirim cerita.", "toast.accessDenied": "Akses administrator diperlukan.", "toast.upload": "Gambar gagal diunggah.", "toast.imageType": "Pilih gambar JPG, PNG, atau WEBP.", "toast.imageTooLarge": "Ukuran gambar maksimal 5 MB.", "toast.credentials": "Email atau kata sandi tidak benar.", "toast.emailExists": "Akun dengan email ini sudah terdaftar.", "toast.invalidEmail": "Masukkan alamat email yang valid.", "toast.passwordLimit": "Kata sandi harus berukuran 10–72 byte.", "toast.csrf": "Sesi berakhir. Muat ulang halaman dan coba kembali.", "toast.submitted": "Cerita berhasil dikirim dan menunggu tinjauan admin.", "toast.published": "Cerita diterbitkan dan analisis dibuat.", "toast.rejected": "Cerita ditolak.", "toast.deleted": "Cerita dihapus.", "toast.confirmDelete": "Hapus cerita ini secara permanen?", "toast.network": "Tidak dapat terhubung ke server. Periksa Apache dan MySQL.", "toast.server": "Permintaan tidak dapat diproses.", "toast.loggedOut": "Anda telah keluar.", "toast.registered": "Akun berhasil dibuat.", "toast.loggedIn": "Selamat datang kembali.", "toast.noAnalysis": "Analisis logika dibuat setelah persetujuan."
    }
};

let currentLanguage = 'en';
let currentTheme = 'light';
let currentUser = null;
let csrfToken = '';
let publishedNews = [];
let adminNews = [];
let adminStats = { total: 0, pending: 0, published: 0, rejected: 0 };
let currentAdminFilter = 'all';
let currentArticleId = null;
let toastTimer = null;

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

window.addEventListener('DOMContentLoaded', initialize);

async function initialize() {
    currentLanguage = localStorage.getItem('infologika_language') === 'id' ? 'id' : 'en';
    currentTheme = localStorage.getItem('infologika_theme') === 'dark' ? 'dark' : 'light';
    applyLanguage();
    applyTheme();
    setupAuthForms();
    setupSubmissionForm();
    setupUploadPreview();
    await restoreSession();
    await loadPublishedNews();
    if (currentUser?.role === 'admin') await loadAdminDashboard();
}

function t(key) {
    return translations[currentLanguage][key] || translations.en[key] || key;
}

function applyLanguage() {
    document.documentElement.lang = currentLanguage;
    document.title = currentLanguage === 'id'
        ? 'InfoLogika — Jurnal Berita & Logika'
        : 'InfoLogika — News & Logic Journal';
    $$('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
    $$('[data-i18n-placeholder]').forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
    $$('[data-i18n-alt]').forEach(node => { node.alt = t(node.dataset.i18nAlt); });
    $$('[data-i18n-aria-label]').forEach(node => node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel)));

    const languageLabel = $('#language-toggle-label');
    if (languageLabel) languageLabel.textContent = currentLanguage === 'en' ? 'Bahasa Indonesia' : 'English';
    $('#language-toggle')?.setAttribute('aria-label', currentLanguage === 'en' ? 'Switch to Indonesian' : 'Ganti ke English');

    const selectedCategory = $('#newsCategory')?.value;
    $$('#newsCategory option[data-i18n]').forEach(option => { option.textContent = t(option.dataset.i18n); });
    if (selectedCategory && $('#newsCategory')) $('#newsCategory').value = selectedCategory;

    const themeLabel = $('.theme-toggle-label');
    if (themeLabel) themeLabel.textContent = t(currentTheme === 'dark' ? 'theme.light' : 'theme.dark');
    $('#theme-toggle')?.setAttribute('aria-label', currentLanguage === 'id'
        ? (currentTheme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap')
        : (currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));
    updateAuthInterface();
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'en' ? 'id' : 'en';
    localStorage.setItem('infologika_language', currentLanguage);
    applyLanguage();
    renderNews();
    renderStories();
    renderAdminTable();
    if (currentArticleId !== null && $('#page-detail')?.classList.contains('active-page')) openArticle(currentArticleId);
}

function applyTheme() {
    document.body.dataset.theme = currentTheme;
    localStorage.setItem('infologika_theme', currentTheme);
    const button = $('#theme-toggle');
    const icon = button?.querySelector('[aria-hidden]');
    const label = button?.querySelector('.theme-toggle-label');
    if (icon) icon.textContent = currentTheme === 'dark' ? '☀' : '☾';
    if (label) label.textContent = t(currentTheme === 'dark' ? 'theme.light' : 'theme.dark');
    button?.setAttribute('aria-label', currentLanguage === 'id'
        ? (currentTheme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap')
        : (currentTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'));
}

function toggleTheme() {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme();
}

async function api(endpoint, { method = 'GET', body, formData = false } = {}) {
    const headers = { Accept: 'application/json' };
    if (body !== undefined && !formData) headers['Content-Type'] = 'application/json';
    if (method !== 'GET' && csrfToken) headers['X-CSRF-Token'] = csrfToken;

    let response;
    try {
        response = await fetch(`${API_BASE}/${endpoint}`, {
            method,
            credentials: 'same-origin',
            headers,
            body: formData ? body : (body === undefined ? undefined : JSON.stringify(body))
        });
    } catch (error) {
        throw new Error(t('toast.network'));
    }

    let result;
    try {
        result = await response.json();
    } catch (error) {
        throw new Error(t('toast.server'));
    }
    if (!response.ok || result.success !== true) {
        if (response.status === 401) updateAuthInterface();
        throw new Error(result.message || t('toast.server'));
    }
    return result;
}

async function restoreSession() {
    try {
        const result = await api('auth-status.php');
        csrfToken = result.data.csrf_token || '';
        currentUser = result.data.user || null;
    } catch (error) {
        currentUser = null;
        showToast(error.message);
    }
    updateAuthInterface();
}

function updateAuthInterface() {
    const name = $('#account-name');
    const signIn = $('#account-button');
    const signOut = $('#logout-button');
    const adminNav = $('.nav-link[onclick="showPage(\'admin\')"]');
    const senderName = $('#senderName');

    if (name) {
        name.textContent = currentUser?.name || '';
        name.hidden = !currentUser;
    }
    if (signIn) signIn.hidden = Boolean(currentUser);
    if (signOut) signOut.hidden = !currentUser;
    if (adminNav) adminNav.hidden = currentUser?.role !== 'admin';
    if (senderName) {
        senderName.value = currentUser?.name || '';
        senderName.placeholder = currentUser ? currentUser.name : t('form.contributorPlaceholder');
    }
}

function handleAccountButton() {
    if (currentUser) {
        showToast(`${currentUser.name} · ${currentUser.role}`);
        return;
    }
    showAuthForm('login');
    $('#auth-modal')?.classList.add('open');
    $('#auth-modal')?.setAttribute('aria-hidden', 'false');
}

function closeAuthModal() {
    $('#auth-modal')?.classList.remove('open');
    $('#auth-modal')?.setAttribute('aria-hidden', 'true');
}

function showAuthForm(formName) {
    const login = formName === 'login';
    $('#login-form').hidden = !login;
    $('#register-form').hidden = login;
    $('#login-tab').classList.toggle('active', login);
    $('#register-tab').classList.toggle('active', !login);
    $('#auth-title').textContent = t(login ? 'auth.signIn' : 'auth.register');
}

function setupAuthForms() {
    $('#login-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        try {
            const result = await api('login.php', {
                method: 'POST',
                body: {
                    email: $('#login-email').value.trim(),
                    password: $('#login-password').value
                }
            });
            acceptAuthentication(result);
            form.reset();
            closeAuthModal();
            showToast(t('toast.loggedIn'));
            await afterAuthentication();
        } catch (error) {
            showToast(error.message);
        }
    });

    $('#register-form')?.addEventListener('submit', async event => {
        event.preventDefault();
        const form = event.currentTarget;
        try {
            const result = await api('register.php', {
                method: 'POST',
                body: {
                    name: $('#register-name').value.trim(),
                    email: $('#register-email').value.trim(),
                    password: $('#register-password').value
                }
            });
            acceptAuthentication(result);
            form.reset();
            closeAuthModal();
            showToast(t('toast.registered'));
            await afterAuthentication();
        } catch (error) {
            showToast(error.message);
        }
    });
}

function acceptAuthentication(result) {
    csrfToken = result.data.csrf_token || csrfToken;
    currentUser = result.data.user || null;
    updateAuthInterface();
}

async function afterAuthentication() {
    await loadPublishedNews();
    if (currentUser?.role === 'admin') {
        await loadAdminDashboard();
        showPage('admin');
    } else if ($('#page-submit')?.classList.contains('active-page')) {
        updateAuthInterface();
    }
}

async function logoutUser() {
    try {
        await api('logout.php', { method: 'POST', body: {} });
        currentUser = null;
        csrfToken = '';
        publishedNews = [];
        adminNews = [];
        adminStats = { total: 0, pending: 0, published: 0, rejected: 0 };
        updateAuthInterface();
        renderAdminStats();
        renderAdminTable();
        await loadPublishedNews();
        showPage('home');
        showToast(t('toast.loggedOut'));
        await restoreSession();
    } catch (error) {
        showToast(error.message);
    }
}

function showPage(pageName) {
    if (pageName === 'submit' && !currentUser) {
        showToast(t('toast.loginRequired'));
        handleAccountButton();
        return;
    }
    if (pageName === 'admin' && currentUser?.role !== 'admin') {
        showToast(t('toast.accessDenied'));
        return;
    }

    $$('.page').forEach(page => page.classList.remove('active-page'));
    const target = document.getElementById(`page-${pageName}`);
    if (!target) return;
    target.classList.add('active-page');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    $$('.nav-link').forEach(link => link.classList.remove('active'));
    const active = $(`.nav-link[onclick="showPage('${pageName}')"]`);
    active?.classList.add('active');
    const menu = $('.nav-menu');
    if (menu) menu.style.display = '';
    if (pageName === 'stories') renderStories();
    if (pageName === 'admin') loadAdminDashboard();
}

function scrollToNews() {
    showPage('home');
    setTimeout(() => $('#news-section')?.scrollIntoView({ behavior: 'smooth' }), 80);
}

function toggleMobileMenu() {
    const menu = $('.nav-menu');
    if (menu) menu.style.display = menu.style.display === 'flex' ? '' : 'flex';
}

async function loadPublishedNews() {
    const grid = $('#news-grid');
    if (grid) grid.innerHTML = `<div class="empty-state">${escapeHTML(t('empty.news'))}</div>`;
    try {
        const result = await api(`get-news.php?lang=${currentLanguage}`);
        publishedNews = result.data.news || [];
        renderNews();
        renderStories();
    } catch (error) {
        if (grid) grid.innerHTML = `<div class="empty-state">${escapeHTML(error.message)}</div>`;
    }
}

function localizedCategory(value) {
    const legacy = { Teknologi: 'Technology', Pendidikan: 'Education', Sosial: 'Social', Lingkungan: 'Environment', Ekonomi: 'Economy', Umum: 'General', 'Cerita Rakyat': 'Folk Stories' };
    return t(`category.${legacy[value] || value}`);
}

function imageUrl(path) {
    if (typeof path !== 'string' || !/^backend\/uploads\/news\/[a-f0-9]{32}\.(?:jpg|jpeg|png|webp)$/i.test(path)) return '';
    return path;
}

function renderNews() {
    const grid = $('#news-grid');
    if (!grid) return;
    if (!publishedNews.length) {
        grid.innerHTML = `<div class="empty-state">${escapeHTML(t('empty.news'))}</div>`;
        return;
    }
    grid.innerHTML = publishedNews.map(createNewsCard).join('');
}

function renderStories() {
    const grid = $('#stories-grid');
    if (!grid) return;
    const stories = publishedNews.filter(item => ['Folk Stories', 'Cerita Rakyat'].includes(item.category));
    if (!stories.length) {
        grid.innerHTML = `<div class="empty-state">${escapeHTML(t('empty.folk'))}</div>`;
        return;
    }
    grid.innerHTML = stories.map(createNewsCard).join('');
}

function createNewsCard(article) {
    const cover = imageUrl(article.image);
    const excerpt = String(article.content || '').replace(/\s+/g, ' ').trim();
    return `<article class="news-card">
        <div class="news-cover">${cover ? `<img class="news-cover-image" src="${escapeAttribute(cover)}" alt="">` : ''}<div class="news-cover-title">${escapeHTML(article.title)}</div></div>
        <div class="news-body">
            <div class="news-meta"><span class="category">${escapeHTML(localizedCategory(article.category))}</span><span>${escapeHTML(formatDate(article.created_at))}</span></div>
            <h3>${escapeHTML(article.title)}</h3>
            <p class="news-excerpt">${escapeHTML(excerpt)}</p>
            <div class="news-footer"><span class="author">${escapeHTML(t('article.by'))} ${escapeHTML(article.sender || '')}</span><button class="read-btn" type="button" onclick="openArticle(${Number(article.id)})">${escapeHTML(t('article.read'))} →</button></div>
        </div>
    </article>`;
}

async function openArticle(id) {
    currentArticleId = Number(id);
    try {
        const result = await api(`get-news-detail.php?id=${encodeURIComponent(currentArticleId)}&lang=${currentLanguage}`);
        renderArticleDetail(result.data.news);
        showPage('detail');
    } catch (error) {
        showToast(error.message);
    }
}

function renderArticleDetail(article) {
    const container = $('#detail-container');
    if (!container || !article) return;
    const cover = imageUrl(article.image);
    const adminPending = currentUser?.role === 'admin' && article.status === 'pending';
    const truthTable = Array.isArray(article.truth_table) ? article.truth_table : [];

    container.innerHTML = `<article class="article-page">
        <div class="article-category">${escapeHTML(localizedCategory(article.category))}</div>
        <h1 class="article-title">${escapeHTML(article.title)}</h1>
        <div class="article-meta"><span>${escapeHTML(t('article.by'))} ${escapeHTML(article.sender || '')}</span><span>${escapeHTML(formatDate(article.created_at))}</span><a href="${escapeAttribute(article.source_url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(t('article.source'))} ↗</a>${currentUser?.role === 'admin' ? `<span>${escapeHTML(statusLabel(article.status))}</span>` : ''}</div>
        ${cover ? `<img class="article-image" src="${escapeAttribute(cover)}" alt="${escapeAttribute(article.title)}">` : ''}
        <div class="article-content">${formatParagraphs(article.content || '')}</div>
        <section class="logic-analysis"><h2>${escapeHTML(t('article.analysis'))}</h2>
            ${renderPropositions(article.premise_p, article.premise_q)}
            ${article.analysis ? renderStoredLogic(article.analysis) + renderTruthTable(truthTable) : `<div class="empty-state">${escapeHTML(t('toast.noAnalysis'))}</div>`}
        </section>
        ${adminPending ? `<div class="admin-detail-actions"><button class="btn btn-primary" type="button" onclick="approveArticle(${Number(article.id)})">${escapeHTML(t('action.approve'))}</button><button class="action-btn reject" type="button" onclick="rejectArticle(${Number(article.id)})">${escapeHTML(t('action.reject'))}</button><button class="action-btn" type="button" onclick="deleteArticle(${Number(article.id)})">${escapeHTML(t('action.delete'))}</button></div>` : ''}
        ${currentUser?.role === 'admin' ? `<button class="btn btn-secondary back-to-admin" type="button" onclick="showPage('admin')">${escapeHTML(t('admin.submissions'))}</button>` : ''}
    </article>`;
}

function renderPropositions(p, q) {
    return `<div class="analysis-box"><div class="analysis-title">${escapeHTML(t('article.premises'))}</div><div class="analysis-content"><div class="proposition"><div class="proposition-symbol">P</div><div class="proposition-text">${escapeHTML(p)}</div></div><div class="proposition"><div class="proposition-symbol">Q</div><div class="proposition-text">${escapeHTML(q)}</div></div></div></div>`;
}

function renderStoredLogic(analysis) {
    const quantifierLines = String(analysis.quantifier || '').split('\n').filter(Boolean);
    const quantifiers = quantifierLines.length >= 2 ? quantifierLines : [String(analysis.quantifier || '')];
    const cards = [
        ['P → Q', t('article.implication'), analysis.implication],
        ['Q → P', t('article.converse'), analysis.converse],
        ['¬P → ¬Q', t('article.inverse'), analysis.inverse],
        ['¬Q → ¬P', t('article.contrapositive'), analysis.contrapositive],
        ['Modus Ponens', t('article.inference'), analysis.inference],
        [analysis.universal_quantifier, t('article.universalQuantifier'), quantifiers[0]],
        [analysis.existential_quantifier, t('article.existentialQuantifier'), quantifiers[1] || '']
    ];
    return `<div class="analysis-box"><div class="analysis-title">${escapeHTML(t('article.forms'))}</div><div class="analysis-content"><div class="logic-parameter-grid">${cards.map(([symbol, label, copy]) => `<div class="logic-parameter"><div class="symbol">${escapeHTML(symbol)}</div><strong>${escapeHTML(label)}</strong><span>${escapeHTML(copy || '')}</span></div>`).join('')}</div></div></div>`;
}

function renderTruthTable(rows) {
    if (!rows.length) return '';
    const headers = ['P', 'Q', '¬P', '¬Q', 'P ∧ Q', 'P ∨ Q', 'P ⊕ Q', 'P → Q', 'P ↔ Q'];
    const keys = ['p', 'q', 'not_p', 'not_q', 'conjunction', 'disjunction', 'exclusive_disjunction', 'implication', 'biconditional'];
    const body = rows.map(row => `<tr>${keys.map(key => `<td>${truth(Boolean(row[key]))}</td>`).join('')}</tr>`).join('');
    return `<div class="analysis-box"><div class="analysis-title">${escapeHTML(t('article.truthTable'))}</div><div class="analysis-content"><div class="truth-table-wrapper"><table class="truth-table"><thead><tr>${headers.map(header => `<th>${header}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div></div></div>`;
}

function truth(value) {
    return value ? `<span class="truth-true">${escapeHTML(t('logic.true'))}</span>` : `<span class="truth-false">${escapeHTML(t('logic.false'))}</span>`;
}

function formatParagraphs(text) {
    return String(text).split(/\n+/).map(part => part.trim()).filter(Boolean).map(part => `<p>${escapeHTML(part)}</p>`).join('');
}

function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(currentLanguage === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function escapeHTML(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function escapeAttribute(value) {
    return escapeHTML(value).replace(/`/g, '&#096;');
}

function statusLabel(status) {
    return t(`status.${status}`);
}

function setupSubmissionForm() {
    $('#submit-form')?.addEventListener('submit', submitNews);
}

function setupUploadPreview() {
    const input = $('#newsImage');
    const preview = $('#imagePreview');
    if (!input || !preview) return;
    let previewUrl = '';

    input.addEventListener('change', () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = '';
        preview.hidden = true;
        preview.removeAttribute('src');

        const file = input.files?.[0];
        if (!file) return;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
            input.value = '';
            showToast(file.size > 5 * 1024 * 1024 ? t('toast.imageTooLarge') : t('toast.imageType'));
            return;
        }

        previewUrl = URL.createObjectURL(file);
        preview.src = previewUrl;
        preview.hidden = false;
    });

    $('#submit-form')?.addEventListener('reset', () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        previewUrl = '';
        preview.hidden = true;
        preview.removeAttribute('src');
    });
}

async function submitNews(event) {
    event.preventDefault();
    if (!currentUser) {
        showToast(t('toast.loginRequired'));
        handleAccountButton();
        return;
    }

    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const imageFile = $('#newsImage').files[0];
    let imagePath = null;

    try {
        if (imageFile) {
            if (imageFile.size > 5 * 1024 * 1024) throw new Error(t('form.imageHint'));
            const upload = new FormData();
            upload.append('image', imageFile);
            const uploaded = await api('upload-image.php', { method: 'POST', body: upload, formData: true });
            imagePath = uploaded.data.image;
        }

        const result = await api('submit-news.php', {
            method: 'POST',
            body: {
                title: $('#newsTitle').value.trim(),
                category: $('#newsCategory').value,
                source_url: $('#sourceUrl').value.trim(),
                content: $('#newsContent').value.trim(),
                premise_p: $('#premiseP').value.trim(),
                premise_q: $('#premiseQ').value.trim(),
                image: imagePath
            }
        });
        form.reset();
        $('#senderName').value = currentUser.name;
        showToast(t('toast.submitted'));
        await loadPublishedNews();
        if (currentUser.role === 'admin') await loadAdminDashboard();
    } catch (error) {
        showToast(error.message || t('toast.upload'));
    }
}

async function loadAdminDashboard() {
    if (currentUser?.role !== 'admin') return;
    try {
        const result = await api(`get-pending-news.php?status=${encodeURIComponent(currentAdminFilter)}`);
        adminStats = result.data.stats || adminStats;
        adminNews = result.data.news || [];
        renderAdminStats();
        renderAdminTable();
    } catch (error) {
        showToast(error.message);
    }
}

function renderAdminStats() {
    const mapping = { statTotal: 'total', statPending: 'pending', statPublished: 'published', statRejected: 'rejected' };
    Object.entries(mapping).forEach(([elementId, key]) => {
        const node = document.getElementById(elementId);
        if (node) node.textContent = String(adminStats[key] ?? 0);
    });
}

function filterAdmin(status, button) {
    if (!['all', 'pending', 'approved', 'rejected'].includes(status)) return;
    currentAdminFilter = status;
    $$('#page-admin .filter-btn').forEach(item => item.classList.remove('active'));
    button?.classList.add('active');
    loadAdminDashboard();
}

function renderAdminTable() {
    const tbody = $('#adminTableBody');
    if (!tbody) return;
    if (!adminNews.length) {
        tbody.innerHTML = `<tr><td colspan="6" class="admin-empty-cell">${escapeHTML(t('empty.admin'))}</td></tr>`;
        return;
    }

    tbody.innerHTML = adminNews.map(article => {
        const id = Number(article.id);
        const reviewActions = article.status === 'pending'
            ? `<button class="action-btn" type="button" onclick="openArticle(${id})">${escapeHTML(t('action.view'))}</button><button class="action-btn approve" type="button" onclick="approveArticle(${id})">${escapeHTML(t('action.approve'))}</button><button class="action-btn reject" type="button" onclick="rejectArticle(${id})">${escapeHTML(t('action.reject'))}</button>`
            : `<button class="action-btn" type="button" onclick="openArticle(${id})">${escapeHTML(t('action.view'))}</button>`;
        return `<tr><td>${escapeHTML(article.title)}</td><td>${escapeHTML(article.sender)}</td><td>${escapeHTML(localizedCategory(article.category))}</td><td><span class="status status-${escapeAttribute(article.status)}">${escapeHTML(statusLabel(article.status))}</span></td><td>${escapeHTML(formatDate(article.created_at))}</td><td><div class="action-group">${reviewActions}<button class="action-btn reject" type="button" onclick="deleteArticle(${id})">${escapeHTML(t('action.delete'))}</button></div></td></tr>`;
    }).join('');
}

async function adminAction(endpoint, id, messageKey) {
    try {
        const result = await api(endpoint, { method: 'POST', body: { id: Number(id) } });
        showToast(t(messageKey));
        await loadAdminDashboard();
        await loadPublishedNews();
    } catch (error) {
        showToast(error.message);
    }
}

function approveArticle(id) { return adminAction('approve-news.php', id, 'toast.published'); }
function rejectArticle(id) { return adminAction('reject-news.php', id, 'toast.rejected'); }

async function deleteArticle(id) {
    if (!window.confirm(t('toast.confirmDelete'))) return;
    await adminAction('delete-news.php', id, 'toast.deleted');
}

function showToast(message) {
    const toast = $('#toast');
    const text = $('#toastMessage');
    if (!toast || !text) return;
    const apiMessages = {
        'Akses ditolak.': 'toast.accessDenied',
        'Please log in to continue.': 'toast.loginRequired',
        'Email or password is incorrect.': 'toast.credentials',
        'An account with this email already exists.': 'toast.emailExists',
        'Enter a valid email address.': 'toast.invalidEmail',
        'Password must be between 10 and 72 bytes.': 'toast.passwordLimit',
        'Invalid or expired request token. Refresh the page and try again.': 'toast.csrf',
        'An unexpected server error occurred.': 'toast.server'
    };
    text.textContent = apiMessages[message] ? t(apiMessages[message]) : message;
    toast.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 3500);
}
