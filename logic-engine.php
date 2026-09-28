<?php
declare(strict_types=1);

/** Deterministic propositional-logic helpers. No generative or AI services. */
function generateLogicAnalysis(string $premiseP, string $premiseQ, string $language = 'en'): array
{
    $p = trim($premiseP);
    $q = trim($premiseQ);

    if ($p === '' || $q === '') {
        throw new InvalidArgumentException('Both propositions are required.');
    }

    $isIndonesian = $language === 'id';
    $ifThen = $isIndonesian
        ? 'Jika pernyataan “%s” berlaku, maka “%s” mengikuti.'
        : 'If the statement “%s” holds, then “%s” follows.';
    $ifNotThenNot = $isIndonesian
        ? 'Jika pernyataan “%s” tidak berlaku, maka “%s” juga tidak berlaku.'
        : 'If the statement “%s” does not hold, then “%s” does not hold.';

    $analysis = [
        'implication' => sprintf($ifThen, $p, $q),
        'converse' => sprintf($ifThen, $q, $p),
        'inverse' => sprintf($ifNotThenNot, $p, $q),
        'contrapositive' => sprintf($ifNotThenNot, $q, $p),
        'inference' => sprintf(
            $isIndonesian
                ? 'Dengan aturan P → Q dan premis P (“%s”), Q (“%s”) mengikuti berdasarkan modus ponens. Ini adalah bentuk logika, bukan verifikasi fakta.'
                : 'Given the rule P → Q and premise P ("%s"), Q ("%s") follows by modus ponens. This is a logical form, not verification of factual claims.',
            $p,
            $q
        ),
        'quantifier' => $isIndonesian
            ? "Universal: ∀x (P(x) → Q(x)) — untuk setiap x dalam domain, jika P(x) maka Q(x).\nEksistensial: ∃x (P(x) ∧ Q(x)) — setidaknya satu x dalam domain memenuhi P(x) dan Q(x). Keduanya adalah pembacaan formal, bukan klaim fakta dari berita."
            : "Universal: ∀x (P(x) → Q(x)) — for every x in the domain, if P(x), then Q(x).\nExistential: ∃x (P(x) ∧ Q(x)) — at least one x in the domain satisfies both P(x) and Q(x). These are formal readings, not factual claims from the story.",
    ];

    return [
        'implication' => $analysis['implication'],
        'converse' => $analysis['converse'],
        'inverse' => $analysis['inverse'],
        'contrapositive' => $analysis['contrapositive'],
        'inference' => $analysis['inference'],
        'quantifier' => $analysis['quantifier'],
        'universal_quantifier' => '∀x (P(x) → Q(x))',
        'existential_quantifier' => '∃x (P(x) ∧ Q(x))',
        'truth_table' => generateTruthTable(),
    ];
}

/** Return all four rows in the conventional order TT, TF, FT, FF. */
function generateTruthTable(): array
{
    $rows = [];

    foreach ([[true, true], [true, false], [false, true], [false, false]] as [$p, $q]) {
        $rows[] = [
            'p' => $p,
            'q' => $q,
            'not_p' => !$p,
            'not_q' => !$q,
            'conjunction' => $p && $q,
            'disjunction' => $p || $q,
            'exclusive_disjunction' => $p !== $q,
            'implication' => !$p || $q,
            'biconditional' => $p === $q,
        ];
    }

    return $rows;
}
