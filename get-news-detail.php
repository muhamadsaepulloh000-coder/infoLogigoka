<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_once __DIR__ . '/../logic/logic-engine.php';

try {
requireMethod('GET');
$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false) {
    jsonResponse(400, false, 'A valid story ID is required.');
}

$pdo = getDatabaseConnection();
$stmt = $pdo->prepare(
    'SELECT n.id, n.title, n.category, n.source_url, n.image, n.content,
            n.premise_p, n.premise_q, n.status, n.created_at, n.reviewed_at,
            u.name AS sender,
            a.implication, a.converse, a.inverse, a.contrapositive, a.inference, a.quantifier
     FROM news n
     INNER JOIN users u ON u.id = n.user_id
     LEFT JOIN logic_analysis a ON a.news_id = n.id
     WHERE n.id = :id
     LIMIT 1'
);
$stmt->execute(['id' => $id]);
$story = $stmt->fetch();

if (!$story) {
    jsonResponse(404, false, 'Story not found.');
}

if ($story['status'] !== 'approved') {
    requireAdmin();
}

$truthStmt = $pdo->prepare(
    'SELECT p, q, not_p, not_q, conjunction, disjunction,
            exclusive_disjunction, implication, biconditional
     FROM truth_tables WHERE news_id = :id ORDER BY id ASC'
);
$truthStmt->execute(['id' => $id]);
$truthTable = $truthStmt->fetchAll();
foreach ($truthTable as &$row) {
    foreach ($row as $key => $value) {
        if ($key !== 'id') {
            $row[$key] = (bool) $value;
        }
    }
}
unset($row);

$story['id'] = (int) $story['id'];
$language = ($_GET['lang'] ?? 'en') === 'id' ? 'id' : 'en';
$engineView = generateLogicAnalysis($story['premise_p'], $story['premise_q'], $language);
$story['analysis'] = $story['implication'] === null ? null : [
    'implication' => $story['implication'],
    'converse' => $story['converse'],
    'inverse' => $story['inverse'],
    'contrapositive' => $story['contrapositive'],
    'inference' => $story['inference'],
    'quantifier' => $story['quantifier'],
    'universal_quantifier' => $engineView['universal_quantifier'],
    'existential_quantifier' => $engineView['existential_quantifier'],
];
unset(
    $story['implication'],
    $story['converse'],
    $story['inverse'],
    $story['contrapositive'],
    $story['inference'],
    $story['quantifier']
);
if ($story['analysis'] !== null && $language === 'id') {
    $localized = $engineView;
    $story['analysis'] = [
        'implication' => $localized['implication'],
        'converse' => $localized['converse'],
        'inverse' => $localized['inverse'],
        'contrapositive' => $localized['contrapositive'],
        'inference' => $localized['inference'],
        'quantifier' => $localized['quantifier'],
        'universal_quantifier' => $localized['universal_quantifier'],
        'existential_quantifier' => $localized['existential_quantifier'],
    ];
}
$story['truth_table'] = $truthTable;

jsonResponse(200, true, 'Story details loaded.', ['news' => $story]);
} catch (Throwable $error) {
    error_log('InfoLogika get-news-detail error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
