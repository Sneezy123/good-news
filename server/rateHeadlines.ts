import { pipeline, env } from "@xenova/transformers";

// Disable local model check
env.allowLocalModels = false;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let classifier: any = null;

/**
 * Classifies the sentiment and returns a nuanced score between -1 and 1.
 * -1.0 = Highly Negative
 *  0.0 = Neutral
 *  1.0 = Highly Positive
 */
export default async function rateHeadlines(headlines: string | string[]) {
  if (!classifier) {
    classifier = await pipeline('text-classification', 'Xenova/distilbert-base-multilingual-cased-sentiments-student');
  }

  // We request all labels to calculate a proper weighted balance
  const results = await classifier(headlines, { top_k: 3 });
  
  const calculateNuancedScore = (output: any) => {
    // Transformers.js returns different structures for single vs batch
    const items = Array.isArray(output) ? output : [output];
    
    const scores: Record<string, number> = {};
    items.forEach(item => {
        scores[item.label] = item.score;
    });

    // Weighted Score = Probability of Positive - Probability of Negative
    const pos = scores['positive'] || 0;
    const neg = scores['negative'] || 0;
    const weightedScore = pos - neg;
    
    // Determine the label based on the most dominant class
    let finalLabel = 'neutral';
    if (weightedScore > 0.4) finalLabel = 'positive';
    else if (weightedScore < -0.4) finalLabel = 'negative';

    return {
        label: finalLabel,
        score: weightedScore
    };
  };

  if (Array.isArray(headlines)) {
    return results.map(calculateNuancedScore);
  } else {
    return calculateNuancedScore(results);
  }
}
