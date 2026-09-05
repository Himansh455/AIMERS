# MedLens — AI-Powered Clinical Information Intelligence

> **Hackathon Submission** — AI-powered clinical information review workspace engineered for Code Quality, Security, Efficiency, Testing, Accessibility, and Problem Statement Alignment.

---

## Overview

MedLens transforms fragmented medical information (patient intake forms, lab reports, prescription histories) into a **structured, traceable, and reviewable** patient record.

Key differentiators:
- **Strict Reference-Range Logic** — Classifications are based *only* on source-document reference ranges. If a range is absent, the value is preserved as `UNDETERMINED` — never invented or substituted.
- **Provenance Tracking** — Every data point tracks its origin (`PATIENT_PROVIDED`, `AI_EXTRACTED`, `HUMAN_VERIFIED`, `CONFLICTING`, `MISSING`).
- **Conflict Detection** — Automatically surfaces discrepancies between patient-provided history and extracted report data for clinician resolution.
- **Responsible AI Safety Layer** — Intercepts and sanitizes any diagnostic, treatment, or dosage language before it is displayed.
- **Human Verification Workflow** — Clinicians can verify AI-extracted lab results; verified records update status and timestamp immutably.

---

## Architecture

```
src/
├── types/clinical.ts          # Domain model: LabResult, PatientProfile, ConflictItem, AISummary, etc.
├── utils/
│   ├── referenceRange.ts      # Strict source-only reference range classifier
│   ├── provenance.ts          # Provenance type metadata helpers
│   ├── conflictDetector.ts    # Conflict detection engine
│   ├── safetyGuard.ts         # Responsible AI safety guardrails
│   ├── pdfParser.ts           # File validation and report text extraction
│   └── exportReport.ts        # Printable structured clinical record export
├── hooks/useClinicalStore.ts  # Centralized React state management hook
├── data/syntheticPatient.ts   # Rich realistic demo patient (Eleanor Vance)
├── components/
│   ├── layout/                # Header, Sidebar (with ARIA nav landmarks)
│   ├── common/                # ProvenanceBadge, StatusBadge, SourceInspectorDrawer
│   └── views/                 # OverviewView, PatientInfoView, ReportsView, LabResultsView,
│                              #   ConflictsView, TimelineView, AISummaryView
└── tests/                     # 42 unit + integration tests
    ├── referenceRange.test.ts
    ├── safetyGuard.test.ts
    ├── conflictDetector.test.ts
    ├── pdfParser.test.ts
    ├── provenance.test.ts
    └── clinicalIntegration.test.ts
```

---

## Evaluator Criteria Coverage

| Criterion | Implementation |
|-----------|---------------|
| **Code Quality** | TypeScript strict types, JSDoc module docs, ESLint/Oxlint, clean component decomposition |
| **Security** | CSP meta headers, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, file upload MIME+size validation, no `eval()`, no `innerHTML` |
| **Efficiency** | `useCallback` memoization, `useMemo`-like derived state, lazy filter computation, minimal re-renders |
| **Testing** | 42 tests across 6 test files (Vitest) covering all utility engines, edge cases, and integration pipeline |
| **Accessibility** | WCAG 2.1 AA: skip-nav link, ARIA landmarks (`nav`, `main`, `role="status"`), `aria-live` page announcer, `aria-current="page"`, `aria-label` on all interactive elements, `aria-hidden` on decorative icons, high-contrast focus ring |
| **Problem Alignment** | Patient intake, report upload, AI extraction, human verification, provenance badges, conflict detection, safety-guarded AI summary, audit timeline, printable export |

---

## Quick Start

```bash
npm install
npm run dev       # http://localhost:5173
npm test          # Run all 42 tests
npm run build     # Production build
npm run lint      # Oxlint code analysis
```

---

## Critical Reference-Range Rule

> **MedLens never invents medical reference ranges.**

The `classifyLabResult()` function in `src/utils/referenceRange.ts` enforces:
1. If `referenceRange` is absent, empty, or `"Not provided in report"` → status is `UNDETERMINED`, explanation is `"Cannot determine from source"`.
2. Classification only proceeds from *explicit* source-document ranges (interval, upper-limit `< N`, or lower-limit `> N` formats).
3. Complex or unparseable text ranges are preserved as written and marked `UNDETERMINED`.

---

## Responsible AI Safeguards

The `evaluateMedicalSafety()` function in `src/utils/safetyGuard.ts` automatically:
- Blocks definitive diagnosis language (`"you have"`, `"diagnosed with"`)
- Blocks treatment/dosage recommendations (`"prescribe"`, `"stop taking"`, `"increase your dose"`)
- Blocks false certainty claims (`"100% medically accurate"`, `"guaranteed cure"`)
- Attaches the standard safety disclaimer to every AI-generated output

---

## Accessibility

- **Skip navigation** (`<a href="#main-content">Skip to main content</a>`) for keyboard users
- **ARIA live region** (`role="status" aria-live="polite"`) announces page navigation to screen readers
- **`aria-current="page"`** on active sidebar navigation item
- **`aria-label`** with descriptive badge counts on all navigation buttons
- **`role="list"` and `role="listitem"`** for navigation list structure
- **`aria-hidden="true"`** on all decorative icon SVGs
- **WCAG 2.1 AA** focus outlines (2px solid `#C08A3E`, 3px offset)
- **Semantic HTML**: `<header>`, `<nav>`, `<main>`, `<button>`, `<table>`, `<form>`

---

## License

MIT — Submitted for AI Hackathon evaluation.
