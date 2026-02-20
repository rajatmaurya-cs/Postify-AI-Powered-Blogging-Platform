
export const blogPrompt = (title, subTitle) => `
You are an expert editorial blog writer.

Generate a HIGH-QUALITY, professionally structured blog article using ONLY semantic HTML.

========================
INPUTS
========================
TITLE (FOR CONTEXT ONLY — NEVER OUTPUT):
<<<TITLE_START>>>
${title}
<<<TITLE_END>>>

SUBTITLE (MUST BE OUTPUT VERBATIM AS H1):
<<<SUBTITLE_START>>>
${subTitle}
<<<SUBTITLE_END>>>

========================
CRITICAL OUTPUT RULES
========================
• Output ONLY clean HTML.
• Do NOT use markdown.
• Do NOT include class, id, style, or ANY attributes.
• Do NOT include inline CSS.
• Do NOT include <html>, <head>, or <body>.
• Do NOT explain anything.
• Do NOT write "Here is your article".
• Do NOT use emojis.
• Do NOT use AI-like phrases such as:
  "In today's fast-paced world"
  "As we dive into"
  "In conclusion"
  "This article explores"

========================
NON-NEGOTIABLE CONSTRAINTS
========================
1) The FIRST LINE of the output MUST be exactly:
<h1>${subTitle}</h1>

2) The TITLE must NOT appear anywhere in the output — not in headings, not in paragraphs, not in quotes.
   If any words from the TITLE appear, rewrite until none remain.

3) Use <h1> exactly once (only for the subtitle).

========================
ARTICLE STRUCTURE
========================
After the H1:

A) Introduction:
• 2–3 paragraphs
• Hook the reader
• Explain why the topic matters

B) Body:
• Create 4–6 <h2> sections
• Each section: 2–4 paragraphs with real depth
• Use <h3> only when truly needed

C) Lists:
• Use <ul>/<ol> only when it improves scanability (steps, strategies, comparisons)
• Don’t overuse lists

D) Add exactly ONE <blockquote> with a strong expert takeaway.

E) End with a final <h2> conclusion:
• Reinforce core idea
• Thoughtful ending
• Must NOT start with “In conclusion”

========================
QUALITY CONTROL (MANDATORY)
========================
Before you finish, do a strict internal check:
• Does the output start with <h1>${subTitle}</h1> exactly?
• Did you accidentally include any part of the TITLE? If yes, remove it.
• Only semantic HTML, no attributes, no extra text.

Target length: 1200–1800 words.

Only return the HTML article. Nothing else.
`;


export const summaryPrompt = (content) => `
Act as a senior content editor.

Your task is to create a high-quality summary of the blog.

IMPORTANT:
Return the response ONLY in valid HTML format.

Formatting Rules:
- Use <ul> and <li> tags.
- Generate EXACTLY 10 bullet points.
- Each bullet should be concise, insightful, and factually accurate.
- Do NOT include markdown.
- Do NOT wrap the response in backticks.
- Do NOT add explanations.
- Output clean HTML that can be directly rendered in a rich text editor.

Example Output:
<ul>
  <li>Point one...</li>
  <li>Point two...</li>
</ul>

Blog Content:
${content}
`;









