<?php
declare(strict_types=1);
require_once __DIR__ . '/_common.php';
require_once __DIR__ . '/../logic/logic-engine.php';

try {
requireMethod('POST');
$admin = requireAdmin();
requireCsrfToken();
$id = postIntegerId(readJsonBody());
$pdo = getDatabaseConnection();

try {
    $pdo->beginTransaction();

    $find = $pdo->prepare("SELECT id, premise_p, premise_q FROM news WHERE id = :id AND status = 'pending' FOR UPDATE");
    $find->execute(['id' => $id]);
    $story = $find->fetch();
    if (!$story) {
        $pdo->rollBack();
        jsonResponse(404, false, 'Pending story not found.');
    }

    $analysis = generateLogicAnalysis($story['premise_p'], $story['premise_q']);
    $update = $pdo->prepare(
        "UPDATE news SET status = 'approved', reviewed_at = NOW(), reviewed_by = :reviewed_by WHERE id = :id"
    );
    $update->execute(['reviewed_by' => $admin['id'], 'id' => $id]);

    $deleteAnalysis = $pdo->prepare('DELETE FROM logic_analysis WHERE news_id = :id');
    $deleteAnalysis->execute(['id' => $id]);
    $saveAnalysis = $pdo->prepare(
        'INSERT INTO logic_analysis (news_id, implication, converse, inverse, contrapositive, inference, quantifier)
         VALUES (:news_id, :implication, :converse, :inverse, :contrapositive, :inference, :quantifier)'
    );
    $saveAnalysis->execute([
        'news_id' => $id,
        'implication' => $analysis['implication'],
        'converse' => $analysis['converse'],
        'inverse' => $analysis['inverse'],
        'contrapositive' => $analysis['contrapositive'],
        'inference' => $analysis['inference'],
        'quantifier' => $analysis['quantifier'],
    ]);

    $deleteTruth = $pdo->prepare('DELETE FROM truth_tables WHERE news_id = :id');
    $deleteTruth->execute(['id' => $id]);
    $saveTruth = $pdo->prepare(
        'INSERT INTO truth_tables
            (news_id, p, q, not_p, not_q, conjunction, disjunction, exclusive_disjunction, implication, biconditional)
         VALUES
            (:news_id, :p, :q, :not_p, :not_q, :conjunction, :disjunction, :exclusive_disjunction, :implication, :biconditional)'
    );
    foreach ($analysis['truth_table'] as $row) {
        $saveTruth->execute([
            'news_id' => $id,
            'p' => (int) $row['p'],
            'q' => (int) $row['q'],
            'not_p' => (int) $row['not_p'],
            'not_q' => (int) $row['not_q'],
            'conjunction' => (int) $row['conjunction'],
            'disjunction' => (int) $row['disjunction'],
            'exclusive_disjunction' => (int) $row['exclusive_disjunction'],
            'implication' => (int) $row['implication'],
            'biconditional' => (int) $row['biconditional'],
        ]);
    }

    $pdo->commit();
    jsonResponse(200, true, 'Story approved and logic analysis generated.', ['id' => $id, 'status' => 'approved']);
} catch (Throwable $error) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $error;
}
} catch (Throwable $error) {
    error_log('InfoLogika approve-news error: ' . $error->getMessage());
    jsonResponse(500, false, 'An unexpected server error occurred.');
}
