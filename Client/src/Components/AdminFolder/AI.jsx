import React, { useEffect, useState } from 'react'
import API from '../../Api/api'
import Moment from 'moment'

const AI = () => {
  const [totalrequest, settotalrequest] = useState(null)
  const [todayrequest, settodayrequest] = useState(null)
  const [mostusedai, setmostusedai] = useState(null)
  const [uniqueusers, setuniqueusers] = useState(null)
  const [logs, setlogs] = useState([]);

  const AIData = async () => {
    try {


      const res = await API.get('/ai/ai-dashboard')

      if (res.data.success) {
        console.log(res.data.stats)
        settotalrequest(res.data.stats.totalRequests)
        settodayrequest(res.data.stats.todayRequests)
        setmostusedai(res.data.stats.mostUsedAI)
        setuniqueusers(res.data.stats.uniqueUsers)
        setlogs(res.data.stats.logs)

      }

    }

    catch (error) {
      console.log(error.message)
    }

  }






  useEffect(() => {
    AIData()
  }, [])

  return (
    <div className="p-6">

     
      <div className="grid grid-cols-4 gap-6">

        {/* CARD 1 */}
          <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Today's Requests</p>
          <h1 className="text-2xl font-bold">
            {todayrequest}
          </h1>
        </div>
        
        <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Total AI Requests</p>
          <h1 className="text-2xl font-bold">
            {totalrequest}
          </h1>
        </div>

       
      

       
        <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Most Used AI</p>
          <h1 className="text-2xl font-bold">
            {mostusedai}
          </h1>
        </div>

      
        <div className="bg-white shadow-md rounded-xl p-5">
          <p className="text-gray-500">Unique Users</p>
          <h1 className="text-2xl font-bold">
            {uniqueusers}
          </h1>
        </div>

      </div>


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

          
          {logs.length === 0 ? "No Logs Found" : ( <tbody>
            {logs.map((log, index) => (
              
              <tr
                key={log._id}
                className="border-b hover:bg-gray-50 transition">
              
                <td className="p-4 text-gray-600">{index + 1}</td>

                <td className="p-4 font-medium text-gray-700">
                  {log.userId?.fullName}
                </td>

                <td className="p-4 text-gray-600">
                  {log.role}
                </td>

                <td className="p-4 text-gray-600">
                  {log.action}
                </td>

                <td>
                  {Moment(log.createdAt).fromNow()}
                </td>

               

              </tr>



            ))}
          </tbody>)}
         

        </table>
      </div>






    </div>
  )
}

export default AI
