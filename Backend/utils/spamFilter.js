export const spamFilter = (text) => {

   const linkRegex = /(https?:\/\/[^\s]+)/g;
   const repeatedChars = /(.)\1{6,}/;
   const vowels = text.match(/[aeiou]/gi)?.length || 0;

   if((text.match(linkRegex) || []).length > 2)
      return "HIGH_RISK";

   if(repeatedChars.test(text))
      return "REVIEW";

   if(text.length > 400)
      return "REVIEW";

   if(vowels / text.length < 0.2)
      return "REVIEW";

   return "SAFE";
};
