
import { useQuery } from "@tanstack/react-query";
import API from "../../Api/api";
import Moment from "moment";

const AI = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["ai-dashboard"],
    queryFn: async () => {
      const res = await API.get("/ai/ai-dashboard");
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to load AI dashboard");
      }
      return res.data.stats;
    },
    staleTime: 30_000,
  });

  const totalRequests = data?.totalRequests ?? (isLoading ? "..." : "-");
  const todayRequests = data?.todayRequests ?? (isLoading ? "..." : "-");
  const mostUsedAI = data?.mostUsedAI ?? (isLoading ? "..." : "-");
  const uniqueUsers = data?.uniqueUsers ?? (isLoading ? "..." : "-");
  const logs = data?.logs ?? [];

  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">AI Intelligence Engine</h1>
        <p className="text-gray-500 font-medium tracking-wide">Monitor real-time AI utilization and usage metrics.</p>
      </div>

      {/* Top cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Today's Load</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{todayRequests}</h2>
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">Reqs</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Cumulative Activity</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{totalRequests}</h2>
              <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Total</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Primary Model</p>
            <h2 className="text-xl font-bold text-gray-900 mt-2 truncate pr-4">{mostUsedAI}</h2>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-6 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="relative z-10 flex flex-col gap-2">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">Active Base</p>
            <div className="flex items-baseline gap-3">
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">{uniqueUsers}</h2>
              <span className="text-sm font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">Users</span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-4">
        {isError && (
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 text-red-600 font-medium rounded-xl text-sm">
            ⚠️ {error?.message}
          </div>
        )}
        {!isLoading && !isError && isFetching && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-xl">
            <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
            Refreshing metrics...
          </div>
        )}
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100/60 overflow-hidden relative flex-1 flex flex-col">
        <div className="px-8 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
           <h3 className="text-lg font-bold text-gray-900 tracking-tight">Recent Operations Log</h3>
        </div>

        <div className="overflow-x-auto flex-1 relative">
          {isLoading && (
            <div className="absolute inset-x-0 top-0 bottom-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-gray-500 tracking-wide animate-pulse">Scanning logs...</p>
              </div>
            </div>
          )}

          <table className="w-full text-left border-collapse min-w-[700px] table-auto">
            <thead className="bg-white border-b border-gray-100/80 sticky top-0 z-10">
              <tr className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                <th className="px-8 py-5 w-20">Seq</th>
                <th className="px-8 py-5">Initiator</th>
                <th className="px-8 py-5 w-32">Permission</th>
                <th className="px-8 py-5 w-48">Operation</th>
                <th className="px-8 py-5 w-44">Timestamp</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {!isLoading && logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">No Trace Records</h3>
                    <p className="text-gray-500 font-medium">The system hasn't recorded any AI activities yet.</p>
                  </td>
                </tr>
              ) : (
                logs.map((log, index) => (
                  <tr key={log._id} className="group hover:bg-gray-50/40 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-indigo-400/80">
                      #{String(index + 1).padStart(3, '0')}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex flex-shrink-0 items-center justify-center text-indigo-700 font-bold text-xs shadow-inner">
                          {log.userId?.fullName ? log.userId.fullName.charAt(0).toUpperCase() : "?"}
                        </div>
                        <p className="text-sm font-bold text-gray-900 truncate">
                          {log.userId?.fullName || "System Generated"}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${log.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                        {log.role}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-xs font-bold tracking-wide shadow-sm shadow-indigo-100/20">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium whitespace-nowrap">
                      {log.createdAt
              ? new Date(log.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default AI;
