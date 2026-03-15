
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../../Api/api";
import toast from "react-hot-toast";
import { Loading } from "notiflix/build/notiflix-loading-aio";

const AIConfigDashboard = () => {
  const queryClient = useQueryClient();

  const [editedConfig, setEditedConfig] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  // -------- Fetch current config --------
  const fetchAIConfig = async () => {
    const { data } = await API.get("/ai/config/config-dashboard");
    if (!data?.config) throw new Error(data?.message || "Failed to load AI config");
    return data.config;
  };

  const {
    data: currentConfig,
    isLoading: configLoading,
    isError: configError,
    error: configErrObj,
    isFetching: configFetching,
  } = useQuery({
    queryKey: ["ai-config"],
    queryFn: fetchAIConfig,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // -------- Fetch history --------
  const fetchAIConfigHistory = async () => {
    const { data } = await API.get("/ai/config/getConfigHistory");
    if (!data?.success) throw new Error(data?.message || "Failed to load config history");
    return data.history || [];
  };

  const {
    data: configHistory = [],
    isLoading: historyLoading,
    isError: historyError,
    error: historyErrObj,
    isFetching: historyFetching,
  } = useQuery({
    queryKey: ["ai-config-history"],
    queryFn: fetchAIConfigHistory,
    enabled: !!currentConfig,
    staleTime: 30_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // -------- Notiflix loader --------
  useEffect(() => {
    const shouldShow = configLoading || !currentConfig || !editedConfig;
    if (shouldShow) Loading.dots("Loading AI config...");
    else Loading.remove();
    return () => Loading.remove();
  }, [configLoading, currentConfig, editedConfig]);

  // Keep same object structure as currentConfig
  useEffect(() => {
    if (currentConfig) setEditedConfig({ ...currentConfig });
  }, [currentConfig]);



  // -------- UpDate mutation --------
  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await API.put("/ai/config/updateConfig", payload);
      if (!res.data?.success) throw new Error(res.data?.message || "Update failed");
      return res.data;
    },
    onMutate: () => toast.loading("Saving config...", { id: "save-config" }),
    onSuccess: () => {
      toast.success("Configuration updated", { id: "save-config" });
      queryClient.invalidateQueries({ queryKey: ["ai-config"] });
      queryClient.invalidateQueries({ queryKey: ["ai-config-history"] });
    },
    onError: (err) => {
      const message =
        err?.response?.data?.message || err?.message || "Failed to update.";

      toast.error(message, { id: "save-config" });
    }
  });

  const saving = updateMutation.isPending;

  if (configLoading || !currentConfig || !editedConfig) return null;

  if (configError) {
  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-500 h-full overflow-y-auto">
      <div className="mb-10 max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900 mb-2">Systems Config</h1>
          <p className="text-gray-500 font-medium tracking-wide">Dial in the operational parameters of your AI infrastructure.</p>
        </div>
        
        {(configFetching || historyFetching) && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm border border-gray-200 text-indigo-600 text-sm font-bold tracking-wide rounded-2xl">
            <div className="w-4 h-4 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
            Syncing State...
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mb-12">

        {/* Global AI Toggle */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8">
            <button
              disabled={disableAll}
              onClick={() =>
                setEditedConfig((prev) => ({
                  ...prev,
                  aiEnabled: !prev.aiEnabled,
                }))
              }
              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                editedConfig.aiEnabled ? 'bg-emerald-500' : 'bg-gray-300'
              } ${disableAll ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition duration-300 ease-in-out ${
                  editedConfig.aiEnabled ? 'translate-x-9' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          <div className="pr-20">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Master AI Toggle</h2>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Enable or disable the entire AI infrastructure across the application instantly.
            </p>
            <div className="mt-6 inline-flex px-3 py-1 rounded-md text-xs font-bold tracking-widest uppercase bg-gray-50 text-gray-400">
               State: <span className={`ml-2 ${editedConfig.aiEnabled ? 'text-emerald-500' : 'text-gray-500'}`}>{editedConfig.aiEnabled ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>

        {/* Global Rate Limit */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-8">
           <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div className="text-right">
               <p className="text-4xl font-black tracking-tight text-blue-600">{editedConfig.dailyappLimit}</p>
               <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mt-1">CAP/DAY</p>
            </div>
           </div>
           
           <h2 className="text-xl font-bold text-gray-900 mb-2">Global Quota</h2>
           <p className="text-gray-500 font-medium text-sm mb-6">Maximum total AI completions allowed for the entire application per day.</p>
           
           <input
            disabled={disableAll}
            type="range"
            min="10"
            max="200"
            step="10"
            value={editedConfig.dailyappLimit ?? 10}
            onChange={(e) => setEditedConfig((prev) => ({ ...prev, dailyappLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
        </div>

        {/* Individual Daily Limit */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-8">
           <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-right">
               <p className="text-4xl font-black tracking-tight text-purple-600">{editedConfig.dailyAiLimit}</p>
               <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mt-1">CAP/USER/DAY</p>
            </div>
           </div>
           
           <h2 className="text-xl font-bold text-gray-900 mb-2">User Daily Quota</h2>
           <p className="text-gray-500 font-medium text-sm mb-6">Individual consumption constraints over a 24-hour rolling period.</p>
           
           <input
            disabled={disableAll}
            type="range"
            min="1"
            max="10"
            step="1"
            value={editedConfig.dailyAiLimit ?? 1}
            onChange={(e) => setEditedConfig((prev) => ({ ...prev, dailyAiLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
          />
        </div>

        {/* Per-Minute Limit */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-8">
           <div className="flex justify-between items-start mb-6">
             <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-right">
               <p className="text-4xl font-black tracking-tight text-emerald-600">{editedConfig.aiPerMinuteLimit ?? 1}</p>
               <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mt-1">REQS/MIN</p>
            </div>
           </div>
           
           <h2 className="text-xl font-bold text-gray-900 mb-2">Burst Resistance</h2>
           <p className="text-gray-500 font-medium text-sm mb-6">Throttle rapid concurrent invocations to stabilize compute resources.</p>
           
           <input
            disabled={disableAll}
            type="range"
            min="1"
            max="20"
            step="1"
            value={editedConfig.aiPerMinuteLimit ?? 1}
            onChange={(e) => setEditedConfig((prev) => ({ ...prev, aiPerMinuteLimit: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
        </div>

        {/* AI Model Architecture - Full Width */}
        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] p-8 lg:col-span-2">
           <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Compute Architecture</h2>
              <p className="text-gray-500 font-medium text-sm">Select the underlying foundational model for cognitive tasks.</p>
            </div>
           </div>
           
           <div className="relative mt-2">
            <select
              disabled={disableAll}
              value={editedConfig.aiModel ?? ""}
              onChange={(e) => setEditedConfig((prev) => ({ ...prev, aiModel: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 focus:bg-white transition-all appearance-none cursor-pointer hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
            >
              <option value="openai/gpt-oss-120b">GPT (Highest Intelligence)</option>
              <option value="llama-3.3-70b-versatile">LLaMA Versatile (Recommended)</option>
              <option value="groq/compound">Groq Compound (Balanced)</option>
              <option value="groq/compound-mini">Groq Compound Mini (Fast & Cheap)</option>
              <option value="llama-3.1-8b-instant">LLaMA Instant (Ultra Fast)</option>
            </select>
           </div>
        </div>

      </div>

      <div className="max-w-5xl mb-16">
        <button
          onClick={handleSave}
          disabled={isUnchanged || disableAll}
          className={`w-full py-5 rounded-[2rem] text-lg font-bold tracking-wide transition-all uppercase ${
            isUnchanged || disableAll
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-gray-900 to-black text-white hover:shadow-[0_8px_30px_rgba(0,0,0,0.15)] hover:-translate-y-1'
          }`}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-400 border-t-white rounded-full animate-spin"></div>
              Deploying Config...
            </span>
          ) : (
            'Deploy Changes to Production'
          )}
        </button>
      </div>

      <div className="max-w-5xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-2xl font-black tracking-tight text-gray-900">Config Mutability Log</h2>

          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-700 font-bold tracking-wide hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
             <svg className={`w-4 h-4 text-gray-400 group-hover:text-gray-900 transition-transform ${showHistory ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
            {showHistory ? "Collapse Logs" : "Expand Logs"}
          </button>
        </div>

        {showHistory && (
          <div className="bg-white rounded-[2rem] shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-gray-100/60 overflow-hidden relative animate-in slide-in-from-top-4 duration-300">
            {historyLoading && (
              <div className="p-16 text-center">
                 <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                 <p className="text-gray-500 font-bold tracking-wide">Retrieving audits...</p>
              </div>
            )}

            {historyError && (
              <div className="p-10 text-center bg-red-50 text-red-600 font-semibold">
                {historyErrObj?.message || "Failed to reconstruct history."}
              </div>
            )}

            {!historyLoading && !historyError && configHistory.length === 0 ? (
              <div className="p-16 text-center text-gray-400 font-bold tracking-wide">
                Config state is pristine. No commits recorded.
              </div>
            ) : (
               !historyLoading && !historyError && (
                <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[900px] table-auto">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                       <th className="px-6 py-5">Author</th>
                       <th className="px-6 py-5">Node Status</th>
                       <th className="px-6 py-5 w-[200px]">Engine</th>
                       <th className="px-6 py-5 text-center">Caps (U/A/M)</th>
                       <th className="px-6 py-5 text-right w-48">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {configHistory.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-5">
                          <p className="font-bold text-gray-900">{item.changedBy?.fullName || "—"}</p>
                          <p className="text-xs font-semibold text-gray-500 mt-0.5">{item.changedBy?.email || "—"}</p>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${item.configSnapshot?.aiEnabled ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}>
                            {item.configSnapshot?.aiEnabled ? "ONLINE" : "HALTED"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded inline-block truncate max-w-full">
                            {item.configSnapshot?.aiModel || "—"}
                          </p>
                        </td>
                        <td className="px-6 py-5 text-center">
                           <div className="flex gap-1 justify-center">
                             <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2 py-1 rounded" title="User Limit">{item.configSnapshot?.dailyAiLimit}</span>
                             <span className="text-gray-300">/</span>
                             <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded" title="App Limit">{item.configSnapshot?.dailyappLimit}</span>
                             <span className="text-gray-300">/</span>
                             <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded" title="Per-Minute Limit">{item.configSnapshot?.aiPerMinuteLimit ?? '—'}</span>
                           </div>
                        </td>
                        <td className="px-6 py-5 text-right text-xs font-bold text-gray-500 tracking-wide pt-6">
                           {new Date(item.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                 </table>
                </div>
               )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default AIConfigDashboard;
