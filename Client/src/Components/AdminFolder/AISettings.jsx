import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import API from "../../Api/api";
import toast from "react-hot-toast";
import InlineLoader from "../../Effects/InlineLoader";

const AIConfigDashboard = () => {
  const queryClient = useQueryClient();


  const [editedConfig, setEditedConfig] = useState(null);
  const [showHistory, setShowHistory] = useState(false);


  
  const fetchAIConfig = async () => {
    const { data } = await API.get("/ai/config/config-dashboard");

    if (!data?.config) {
      throw new Error(data?.message || "Failed to load AI config");
    }

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




  const fetchAIConfigHistory = async () => {
    const { data } = await API.get("/ai/config/getConfigHistory");

    if (!data?.success) {
      throw new Error(data?.message || "Failed to load config history");
    }

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




  useEffect(() => {
    if (currentConfig) setEditedConfig({ ...currentConfig }); // To get the same Obj structure of currentConfig
  }, [currentConfig]);


  const updateMutation = useMutation({
    mutationFn: async (payload) => {
      const res = await API.put("/ai/config/updateConfig", payload);
      if (!res.data?.success) {
        throw new Error(res.data?.message || "Update failed");
      }
      return res.data;
    },
    onMutate: () => toast.loading("Saving config...", { id: "save-config" }),
    onSuccess: () => {
      toast.success("Configuration updated", { id: "save-config" });
      queryClient.invalidateQueries({ queryKey: ["ai-config"] });
      queryClient.invalidateQueries({ queryKey: ["ai-config-history"] });
    },
    onError: (err) => {
      toast.error(err?.message || "Update failed", { id: "save-config" });
    },
  });

  const saving = updateMutation.isPending;


if (configLoading || !currentConfig || !editedConfig) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <InlineLoader />
    </div>
  );
}


  if (configError) {
    return (
      <div className="h-screen flex justify-center items-center text-red-600 font-semibold">
        {configErrObj?.message || "Failed to load config"}
      </div>
    );
  }


  const isUnchanged =
    JSON.stringify(editedConfig) === JSON.stringify(currentConfig);

  const disableAll = saving || configFetching || historyFetching;

  const handleSave = () => {
    if (!editedConfig) return;

    const payload = {
      aiEnabled: editedConfig.aiEnabled,
      aiModel: editedConfig.aiModel,
      dailyAiLimit: editedConfig.dailyAiLimit,
      dailyappLimit: editedConfig.dailyappLimit,
    };

    updateMutation.mutate(payload);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-bold mb-10">⚙️ AI Config Dashboard</h1>

      {(configFetching || historyFetching) && (
        <p className="mb-4 text-gray-500">Refreshing...</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">AI Feature Toggle</h2>

          <p className="text-sm text-gray-500 mb-2">
            Current:
            <span className="font-bold ml-2">
              {currentConfig.aiEnabled ? "Enabled" : "Disabled"}
            </span>
          </p>

          <button
            disabled={disableAll}
            onClick={() =>
              setEditedConfig((prev) => ({
                ...prev,
                aiEnabled: !prev.aiEnabled,
              }))
            }
            className={`w-16 h-8 flex items-center rounded-full p-1 transition ${editedConfig.aiEnabled ? "bg-green-500" : "bg-gray-400"
              } ${disableAll ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${editedConfig.aiEnabled ? "translate-x-8" : ""
                }`}
            />
          </button>
        </div>


        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">App Daily Limit</h2>

          <p className="text-sm text-gray-500">
            Current:
            <span className="font-bold ml-2">{currentConfig.dailyappLimit}</span>
          </p>

          <p className="text-3xl font-bold text-blue-600 mt-2">
            New: {editedConfig.dailyappLimit}
          </p>

          <input
            disabled={disableAll}
            type="range"
            min="10"
            max="100"
            value={editedConfig.dailyappLimit ?? 10}
            onChange={(e) =>
              setEditedConfig((prev) => ({
                ...prev,
                dailyappLimit: Number(e.target.value),
              }))
            }
            className="w-full mt-4"
          />
        </div>


        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">User Daily AI Limit</h2>

          <p className="text-sm text-gray-500">
            Current:
            <span className="font-bold ml-2">{currentConfig.dailyAiLimit}</span>
          </p>

          <p className="text-3xl font-bold text-purple-600 mt-2">
            New: {editedConfig.dailyAiLimit}
          </p>

          <input
            disabled={disableAll}
            type="range"
            min="1"
            max="50"
            value={editedConfig.dailyAiLimit ?? 1}
            onChange={(e) =>
              setEditedConfig((prev) => ({
                ...prev,
                dailyAiLimit: Number(e.target.value),
              }))
            }
            className="w-full mt-4"
          />
        </div>


        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">AI Model</h2>

          <p className="text-sm text-gray-500 mb-2">
            Current:
            <span className="font-bold ml-2">{currentConfig.aiModel}</span>
          </p>

          <select
            disabled={disableAll}
            value={editedConfig.aiModel ?? ""}
            onChange={(e) =>
              setEditedConfig((prev) => ({
                ...prev,
                aiModel: e.target.value,
              }))
            }
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
          >
            <option value="openai/gpt-oss-120b">
              GPT-OSS 120B (Highest Intelligence)
            </option>
            <option value="llama-3.3-70b-versatile">
              LLaMA 3.3 70B Versatile (Recommended)
            </option>
            <option value="groq/compound">Groq Compound (Balanced)</option>
            <option value="groq/compound-mini">
              Groq Compound Mini (Fast & Cheap)
            </option>
            <option value="llama-3.1-8b-instant">
              LLaMA 3.1 8B Instant (Ultra Fast)
            </option>
          </select>
        </div>
      </div>


      <div className="max-w-5xl mt-10">
        <button
          onClick={handleSave}
          disabled={isUnchanged || disableAll}
          className={`w-full py-3 rounded-2xl text-lg font-semibold transition ${isUnchanged || disableAll
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {saving ? "Saving..." : "Save All Changes"}
        </button>
      </div>


      <div className="max-w-7xl mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🕑 AI Config History</h2>

          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>
        </div>

        {showHistory && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border">
            {historyLoading && (
              <div className="p-6 text-center text-gray-500">
                Loading history...
              </div>
            )}

            {historyError && (
              <div className="p-6 text-center text-red-500">
                {historyErrObj?.message || "Failed to load history"}
              </div>
            )}

            {!historyLoading && !historyError && configHistory.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No config history found.
              </div>
            ) : (
              !historyLoading &&
              !historyError && (
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-gray-700 text-sm">
                    <tr>
                      <th></th>
                      <th colSpan="4" className="py-4 text-center">
                        <div className="flex flex-col items-center">
                          <span className="font-bold uppercase tracking-wide">
                            Previous Configuration
                          </span>
                          <span className="text-xs text-gray-500 normal-case">
                            Values before the latest update
                          </span>
                        </div>
                      </th>
                      <th></th>
                      <th></th>
                    </tr>

                    <tr className="uppercase text-gray-600">
                      <th className="px-6 py-4">Updated By</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">AI Model</th>
                      <th className="px-6 py-4">User Limit</th>
                      <th className="px-6 py-4">App Limit</th>
                      <th className="px-6 py-4">Reason</th>
                      <th className="px-6 py-4">Updated At</th>
                    </tr>
                  </thead>

                  <tbody>
                    {configHistory.map((item) => (
                      <tr
                        key={item._id}
                        className="border-t hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 font-medium">
                          {item.changedBy?.fullName || "Unknown"}
                          <p className="text-sm text-gray-500">
                            {item.changedBy?.email}
                          </p>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${item.configSnapshot?.aiEnabled
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                              }`}
                          >
                            {item.configSnapshot?.aiEnabled
                              ? "Enabled"
                              : "Disabled"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          {item.configSnapshot?.aiModel}
                        </td>
                        <td className="px-6 py-4">
                          {item.configSnapshot?.dailyAiLimit}
                        </td>
                        <td className="px-6 py-4">
                          {item.configSnapshot?.dailyappLimit}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {item.changeReason || "—"}
                        </td>

                        <td className="px-6 py-4 text-gray-500">
                          {new Date(item.createdAt).toLocaleString("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )
            )}
          </div>
        )}
      </div>

    </div>
  );
};

export default AIConfigDashboard;
