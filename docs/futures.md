# Future Roadmap: Sentiment Feedback Loop & Continuous Improvement

This document outlines the architecture and implementation plan for a feedback system that allows the "Good News" application to learn from its mistakes and improve its sentiment analysis accuracy over time.

## 1. Background & Motivation
While the current `distilbert-base-multilingual-cased-sentiments-student` model is a significant improvement, no general-purpose ML model is perfect for every niche (e.g., German regional news nuances). A feedback loop allows users to correct "bad" predictions, creating a high-quality, domain-specific dataset that can be used for immediate overrides and future model fine-tuning.

## 2. Proposed Solution: The "Hybrid Inference" Architecture

### Phase 1: Feedback Collection (UI & API)
- **UI Enhancement**: Add "Correct Sentiment" buttons (🤩, 🙂, 😐, 😟, 😡) to the `ArticleItem` component, visible on hover or in a small menu.
- **Feedback API**: Create a Next.js API route (`/api/sentiment/feedback`) to receive corrections.
- **Data Schema**:
  ```typescript
  {
    headline: string;       // The unique text being rated
    original_score: number; // The -1.0 to 1.0 score from the model
    user_score: number;     // The -1.0 to 1.0 score provided by the user
    timestamp: Date;
  }
  ```

### Phase 2: The Correction "Memory" (Database)
To store these corrections, we need a persistent database.
- **Recommendation**: **Supabase (PostgreSQL)** for its ease of use and built-in vector support.
- **Schema**: A `sentiment_corrections` table with a unique constraint on the `headline` (or a hash of it) to aggregate multiple user votes.

### Phase 3: Hybrid Inference Logic
Modify `server/rateHeadlines.ts` to implement a "Lookup-then-Predict" pattern:
1. **Database Lookup**: Query the database for the current headline.
2. **Override**: If a correction exists with high confidence (e.g., multiple users agreed), return the `user_score` immediately.
3. **Model Prediction**: If no correction exists, fall back to the Transformers.js model.
4. **Fuzzy Matching (Optional)**: Use **Vector Search** (pgvector) to find similar headlines that have already been corrected, catching paraphrased news.

### Phase 4: Offline Fine-tuning (The "Brain" Update)
Once ~1,000–5,000 corrections are collected:
1. **Export Data**: Pull all `(headline, user_score)` pairs from the database.
2. **Fine-tune**: Use a Python script (with `HuggingFace Transformers` and `PyTorch/TensorFlow`) to fine-tune the base `distilbert` model on this specific dataset.
3. **Deploy**: Export the new model to ONNX format and replace the one in `server/rateHeadlines.ts`.

## 3. Alternatives Considered

| Approach | Pros | Cons |
| :--- | :--- | :--- |
| **Pure Override** | Instant fix for specific headlines. | Doesn't generalize to new, similar headlines. |
| **Vector Search Override** | Catches similar news (e.g., same story from different publishers). | Requires a vector database (like Supabase pgvector). |
| **Online Learning** | Model learns in real-time. | Technically complex with Transformers.js; prone to "poisoning" by bad data. |

## 4. Implementation Roadmap

### 🏁 Phase 1 (Immediate)
- [ ] Create `api/sentiment/feedback/route.ts`.
- [ ] Implement feedback buttons in `ArticleItem.tsx`.
- [ ] Use a local `JSON` file or `localStorage` as a temporary mock "database".

### 🚀 Phase 2 (Production)
- [ ] Connect to Supabase/PostgreSQL.
- [ ] Update `rateHeadlines.ts` to perform database lookups.
- [ ] Implement a "Correction Dashboard" to review and approve user feedback.

### 🧠 Phase 3 (Advanced)
- [ ] Integrate `pgvector` for fuzzy headline matching.
- [ ] Set up a monthly GitHub Action to run the fine-tuning script and commit the updated ONNX model back to the repo.

## 5. Security & Validation
- **Rate Limiting**: Prevent automated "sentiment poisoning" by limiting feedback per IP.
- **Approval Queue**: Require an admin (you) to approve corrections before they become global overrides.
- **Weighting**: Give more weight to corrections from trusted users (if auth is added).

---
*Last Updated: 2026-03-31*
