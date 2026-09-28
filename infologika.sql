CREATE DATABASE IF NOT EXISTS infologika
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE infologika;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(190) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS news (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    user_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(220) NOT NULL,
    category VARCHAR(80) NOT NULL,
    source_url VARCHAR(2048) NOT NULL,
    image VARCHAR(255) NULL,
    content MEDIUMTEXT NOT NULL,
    premise_p VARCHAR(500) NOT NULL,
    premise_q VARCHAR(500) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME NULL,
    reviewed_by BIGINT UNSIGNED NULL,
    PRIMARY KEY (id),
    KEY idx_news_status_created (status, created_at),
    KEY idx_news_user (user_id),
    CONSTRAINT fk_news_user FOREIGN KEY (user_id) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_news_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id)
        ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS logic_analysis (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    news_id BIGINT UNSIGNED NOT NULL,
    implication TEXT NOT NULL,
    converse TEXT NOT NULL,
    inverse TEXT NOT NULL,
    contrapositive TEXT NOT NULL,
    inference TEXT NOT NULL,
    quantifier TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_logic_analysis_news (news_id),
    CONSTRAINT fk_logic_analysis_news FOREIGN KEY (news_id) REFERENCES news(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS truth_tables (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    news_id BIGINT UNSIGNED NOT NULL,
    p BOOLEAN NOT NULL,
    q BOOLEAN NOT NULL,
    not_p BOOLEAN NOT NULL,
    not_q BOOLEAN NOT NULL,
    conjunction BOOLEAN NOT NULL,
    disjunction BOOLEAN NOT NULL,
    exclusive_disjunction BOOLEAN NOT NULL,
    implication BOOLEAN NOT NULL,
    biconditional BOOLEAN NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_truth_table_row (news_id, p, q),
    CONSTRAINT fk_truth_tables_news FOREIGN KEY (news_id) REFERENCES news(id)
        ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Demo admin: password is stored as a PHP password_hash() bcrypt hash.
-- Login: admin@infologika.local / Admin123!
INSERT IGNORE INTO users (name, email, password, role)
VALUES (
    'Administrator',
    'admin@infologika.local',
    '$2y$10$0IZrH/mujK9ZhxcS3JIeXebBWiBHsQAtt8j.6KVl8GvE74I0w8lnq',
    'admin'
);
