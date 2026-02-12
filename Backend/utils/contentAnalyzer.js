
export function analyzeContent(content = "") {
  const cleanText = content.trim();


  const words = cleanText ? cleanText.split(/\s+/).filter(Boolean).length : 0;

  const sentences = cleanText
    ? cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    : 0;

  const paragraphs = cleanText
    ? cleanText.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
    : 0;

  
  if (words < 5) {
    return {
      words,
      sentences,
      paragraphs,
      avgSentenceLength: "0.0",
      totalScore: 0,
      verdict: "Poor",
    };
  }

  const avgSentenceLength = words / Math.max(sentences, 1);

  
  const lengthScore =
    words >= 600 ? 25 :
    words >= 300 ? 18 :
    words >= 150 ? 12 : 6;

  const readabilityScore =
    avgSentenceLength <= 20 ? 25 :
    avgSentenceLength <= 30 ? 18 : 8;

  const structureScore =
    paragraphs >= 6 ? 25 :
    paragraphs >= 3 ? 18 : 8;

   

  const totalScore = lengthScore + readabilityScore + structureScore 

  return {
    words,
    sentences,
    paragraphs,
    avgSentenceLength: avgSentenceLength.toFixed(1),
    totalScore,
    verdict:
      totalScore >= 75 ? "Good" :
      totalScore >= 50 ? "Average" : "Poor",
  };
}
