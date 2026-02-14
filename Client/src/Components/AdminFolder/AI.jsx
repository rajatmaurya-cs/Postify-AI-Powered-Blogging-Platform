import React from "react";
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
    staleTime: 30_000, // optional cache
  });

  const totalRequests = data?.totalRequests ?? (isLoading ? "..." : "-");
  const todayRequests = data?.todayRequests ?? (isLoading ? "..." : "-");
  const mostUsedAI = data?.mostUsedAI ?? (isLoading ? "..." : "-");
  const uniqueUsers = data?.uniqueUsers ?? (isLoading ? "..." : "-");
  const logs = data?.logs ?? [];

  return (
    <div className="p-6">
      {/* Top cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Today's Requests</p>
          <h1 className="text-2xl font-bold">{todayRequests}</h1>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Total AI Requests</p>
          <h1 className="text-2xl font-bold">{totalRequests}</h1>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Most Used AI</p>
          <h1 className="text-2xl font-bold">{mostUsedAI}</h1>
        </div>

        <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Unique Users</p>
          <h1 className="text-2xl font-bold">{uniqueUsers}</h1>
        </div>
      </div>

      {/* Loading / Error states */}
      {isLoading && <p className="mt-4 text-gray-500">Loading AI stats...</p>}
      {isError && <p className="mt-4 text-red-500">{error?.message}</p>}
      {!isLoading && !isError && isFetching && (
        <p className="mt-2 text-gray-500">Refreshing...</p>
      )}

      {/* Logs table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl ml-10 mt-5">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-sm">
              <th className="p-4">#</th>
              <th className="p-4">User</th>
              <th className="p-4">Role</th>
              <th className="p-4">Used AI</th>
              <th className="p-4">Time</th>
            </tr>
          </thead>

          <tbody>
            {!isLoading && logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-400">
                  No Logs Found
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={log._id} className="border-b hover:bg-gray-50 transition">
                  <td className="p-4 text-gray-600">{index + 1}</td>
                  <td className="p-4 font-medium text-gray-700">
                    {log.userId?.fullName || "—"}
                  </td>
                  <td className="p-4 text-gray-600">{log.role}</td>
                  <td className="p-4 text-gray-600">{log.action}</td>
                  <td className="p-4 text-gray-600">
                    {log.createdAt ? Moment(log.createdAt).fromNow() : "—"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AI;
