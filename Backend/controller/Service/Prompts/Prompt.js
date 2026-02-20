
export const blogPrompt = (title, subTitle) =>
   `
You are an expert editorial blog writer.

Your task is to generate a HIGH-QUALITY, professionally structured blog article using ONLY semantic HTML.



The article must feel like it was written by an experienced human author for a top-tier technology publication.

The Blog Title Is ${title}  and
The Blog SubTitle Is ${subTitle}

========================
CRITICAL OUTPUT RULES
=====================

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

Write naturally.

========================
WRITING STYLE (VERY IMPORTANT)
==============================

Write like a professional human blogger:

• Use clear, confident language.
• Avoid robotic transitions.
• Avoid repetition.
• Vary sentence length.
• Prefer short-to-medium paragraphs.
• Maintain a strong logical flow.
• Sound intelligent but not complicated.

The reader should forget this was written by AI.

========================
ARTICLE STRUCTURE
=================

1 .Place the SubTitle at the very top of the content.
   Use <h1> exactly once and only for the SubTitle.
   Do not include, mention, or write the Title anywhere in the content.
   Completely ignore the Title.

2. Immediately follow with an introduction:
   • 2–3 paragraphs
   • Hook the reader
   • Clearly explain why the topic matters.

3. Create 4–6 <h2> sections.

For EACH section:
• Include at least 2–4 paragraphs.
• Go deep — avoid surface-level writing.
• Provide insights, examples, or practical explanations.

4. Use <h3> ONLY when a subsection genuinely improves clarity.

5. Use lists ONLY when information is easier to scan than read.

   Example cases:
   • steps
   • strategies
   • benefits
   • comparisons

Never overuse lists.

6. Add ONE <blockquote> containing a powerful insight, expert-level statement, or memorable takeaway.

7. End with a strong <h2> conclusion that:
   • Reinforces the core idea
   • Feels thoughtful
   • Does NOT start with “In conclusion”

========================
QUALITY CONTROL (MANDATORY)
===========================

The article MUST:

• Feel like a premium blog.
• Be highly readable.
• Be logically structured.
• Avoid fluff.
• Avoid generic filler.
• Avoid keyword stuffing.
• Contain meaningful depth.

Write for an intelligent reader.

Target length: 1200–1800 words.

========================
REMEMBER
========

Only return the HTML article.
Nothing else.






`


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









