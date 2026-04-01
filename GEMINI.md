# GEMINI.md - Project Context & Mandates

## Core Project Mandate
**You MUST update this file whenever the project structure, dependencies, or key architectural patterns change.** This file serves as your source of truth for the workspace and ensures continuity across sessions.

---

## Project: Good News (German Sentiment Analysis)
A Next.js application that fetches Google News RSS feeds and uses local ML models to classify headlines for positivity.

### 📁 Project Structure
```text
/home/nils/lang/tsx/good-news/
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package-lock.json
├── package.json
├── postcss.config.mjs
├── README.md
├── tsconfig.json
├── app/
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx (ArticleType & NewsData types)
│   ├── [articleId]/ (Dynamic article pages)
│   ├── api/news/ (RSS API endpoints)
│   └── components/
│       ├── ArticleItem.tsx (Sentiment emoji display)
│       └── SearchBar.tsx
├── docs/
│   ├── TODOS.md
│   └── futures.md (Roadmap for Sentiment Feedback Loop)
├── providers/
│   └── ReactQueryProvider.tsx
├── public/
└── server/
    ├── decodeGoogleNewsURL.ts
    ├── fetchNews.ts (Batch sentiment rating + unstable_cache)
    └── rateHeadlines.ts (ML-based sentiment analysis via Transformers.js)
```

### 🧠 Sentiment Analysis Implementation
- **Library**: `@xenova/transformers` (local execution).
- **Model**: `Xenova/distilbert-base-multilingual-cased-sentiments-student` (Handles general news sentiment much better than review models).
- **Nuanced Scoring**: 
  - Instead of discrete labels, it calculates a **weighted score** from `-1.0` (Highly Negative) to `1.0` (Highly Positive).
  - **Logic**: Positive label uses the confidence score, Negative label uses negative confidence score, and Neutral results in 0.
- **Architecture**: 
  - Server-side batch processing in `fetchNews.ts`.
  - Simple mapping calculation in `rateHeadlines.ts` (robust to batch formatting).
  - Granular mapping (🤩, 🙂, 😐, 😟, 😡) in `ArticleItem.tsx`.
  - Sentiment results are cached using Next.js `unstable_cache`.

### 🛠️ Key Commands
- `npm run dev` - Start development server.
- `npm run lint` - Check code quality and TypeScript types.
- `npm run build` - Build for production.

---

## 🔮 Future Directions
Keep these future plans in mind when making decisions about the project. Do NOT implement them.
The project includes a detailed roadmap for a **Sentiment Feedback Loop** in `docs/futures.md`. This plan outlines how to:
1. Capture user corrections in the UI.
2. Store corrections in a database (Supabase/PostgreSQL).
3. Use a "Hybrid Inference" engine to override model predictions with user data.
4. Periodically fine-tune the local ML model on collected feedback.

---
*Last Updated: 2026-03-31*
