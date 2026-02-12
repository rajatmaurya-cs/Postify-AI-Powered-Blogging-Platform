import groq from "../Config/Gemini.js";



const MODERATION_PROMPT = `
You are an AI comment moderation system.

Your job is to classify blog comments into EXACTLY one category:

SAFE
REVIEW
HIGH_RISK

Rules:

SAFE:
- Normal discussion
- Polite disagreement
- Constructive feedback
- Questions

REVIEW:
- Mild insults
- Sarcasm targeting someone
- Suspicious or spam-like tone
- Slightly offensive language

HIGH_RISK:
- Hate speech
- Threats
- Bullying
- Sexual content
- Extreme profanity
- Harassment
- Promotion of violence

IMPORTANT RULES:

- Reply with ONLY ONE WORD:
SAFE, REVIEW, or HIGH_RISK
- Do NOT explain.
- Do NOT add punctuation.
- Do NOT write sentences.
- No extra text.

If unsure → choose REVIEW.
`;




export const aimoderation = async (text) => {

    try {

        const res = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0, 
            messages: [
                {
                    role: "system",
                    content: MODERATION_PROMPT
                },
                {
                    role: "user",
                    content: text
                }
            ],
        });

        const result = res.choices[0].message.content.trim().toUpperCase();

        return result;

    } catch (error) {

        console.log("AI moderation error:", error);

        
        return "REVIEW";
    }
};
