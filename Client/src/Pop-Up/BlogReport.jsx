import React, { useContext } from "react";
import { AuthContext } from "../Context/Authcontext";
import { assets } from "../assets/assets";

const BlogReport = ({ type, analysis, onClose }) => {
  const { user } = useContext(AuthContext);

  if (!analysis) return null;

  const verdictColor =
    analysis.verdict === "Good"
      ? "text-green-400 bg-green-900/40"
      : analysis.verdict === "Average"
      ? "text-yellow-400 bg-yellow-900/40"
      : "text-red-400 bg-red-900/40";

  const typeBadge =
    type === "ai"
      ? "bg-purple-900/40 text-purple-400 border-purple-700"
      : "bg-blue-900/40 text-blue-400 border-blue-700";

  const typeLabel =
    type === "ai" ? "🤖 AI Generated" : "👤 Human Written";

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="relative bg-black text-white w-[420px] rounded-2xl shadow-2xl p-6 border border-gray-800">

     
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700"
        >
          ✕
        </button>

        
        <div className="text-center">
          <h2 className="text-xl font-bold">Blog Quality Report</h2>
          <p className="text-sm text-gray-400 mt-1">
            AI-assisted content evaluation
          </p>

          <div className={`inline-block mt-3 px-4 py-1 text-xs font-semibold rounded-full border ${typeBadge}`}>
            {typeLabel}
          </div>
        </div>

       
        <div className="flex items-center gap-4 mt-6 p-4 bg-gray-900 rounded-xl">
          <img
            src={user?.avatar || assets.user_icon}
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border border-gray-700"
          />
          <div>
            <p className="text-xs text-gray-400">Created by</p>
            <p className="font-semibold">{user?.name || "Admin"}</p>
          </div>
        </div>

        
        <div className="mt-6 space-y-3 text-sm">

          <div className="flex justify-between">
            <span>Word Count</span>
            <span>{analysis.words ?? 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Sentences</span>
            <span>{analysis.sentences ?? 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Paragraphs</span>
            <span>{analysis.paragraphs ?? 0}</span>
          </div>

          <div className="flex justify-between">
            <span>Avg Sentence Length</span>
            <span>{analysis.avgSentenceLength ?? "0.0"}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Quality Score</span>
            <span>{analysis.totalScore ?? 0} / 100</span>
          </div>
        </div>

       
        {analysis.totalScore === 0 && (
          <p className="mt-4 text-center text-red-400 text-sm">
            Content is too short or empty to analyze.
          </p>
        )}

        
        <div className={`mt-6 text-center py-3 rounded-xl font-semibold ${verdictColor}`}>
          Verdict: {analysis.verdict}
        </div>

        <p className="mt-6 text-xs text-gray-500 text-center">
          This report is auto-generated and requires human review.
        </p>
      </div>
    </div>
  );
};

export default BlogReport;
