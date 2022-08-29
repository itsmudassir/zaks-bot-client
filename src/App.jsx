import { useEffect, useState } from "react";
import ToggleButton from "./components/ToggleSwitch";
import axios from "axios";
import { apiUrl } from "./globals/globalVariables";
import URLcomponent from "./components/URLcomponent";
import { randomTimeSeries } from "./globals/globalFunctions";
import ReactLoading from "react-loading";
import cogoToast from "cogo-toast";
import {Helmet} from "react-helmet";

function App() {
  const [fromTime, setFromTime] = useState();
  const [toTime, setToTime] = useState();
  const [numberOfRuns, setNumberOfRuns] = useState();
  const [tableData, setTableData] = useState([]);
  const [botRunIntervals, setBotRunIntervals] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBotRunIntervals();
  }, []);
  useEffect(() => {
    fetchTableData();
  }, []);

  // console.log(tableData);
  // console.log(botRunIntervals);

  const submitForm = async (e) => {
    try {
      e.preventDefault();
      if (!toTime || !fromTime || !numberOfRuns) {
        alert("required all fields");
        return;
      }
      if (toTime <= fromTime) {
        alert("From time must be smaller than To time");
        return;
      }
      setIsLoading(true);

      await axios.patch(`${apiUrl}/botRunIntervals-update`, {
        fromTime,
        toTime,
        numberOfRuns,
      });

      const randomTimeArray = await randomTimeSeries(
        fromTime,
        toTime,
        numberOfRuns
      );

      await axios.delete(`${apiUrl}/appointmentsSchedule-delete`);

      await axios.post(`${apiUrl}/appointmentsSchedule-create`, {
        randomTimeArray,
      });

      await fetchBotRunIntervals();
      await fetchTableData();
      await fetchTableData();
      await fetchTableData();
      cogoToast.success("Please refresh results after 30 seconds to get updated data", {hideAfter:5})
      // window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/appointmentsSchedule`);
      setTableData(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchBotRunIntervals = async () => {
    try {
      const response = await axios.get(`${apiUrl}/botRunIntervals`);
      setBotRunIntervals(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Smile Stories</title>
      </Helmet>
      {/* header */}
      <div className="w-full h-[50px] bg-blue-500 flex items-center">
        <button className="mx-2 bg-orange-200 border-2 border-orange-500 px-2 font-bold">
          smile stories
        </button>
      </div>
      <br />
      <br />

      {/* URL container */}
      <div className="grid md:grid-cols-6 gap-2 xs:grid-cols-12">
        {/* grid 1 */}
        <div className="col-span-5 flex flex-col pl-3 gap-3 ">
          <URLcomponent />
        </div>

        {/* grid 2 */}
        <div className="h-24 flex items-center md:justify-end xs:justify-end">
          <div className="flex flex-col gap-1 items-center justify-center pl-3 md:pr-10">
            <ToggleButton />
            <div className="flex flex-col">
              <p className="font-bold text-lg -mb-3 text-center">
                Turn off on all
              </p>
              <p className="font-bold text-lg">appointments</p>
            </div>
          </div>
        </div>
      </div>

      <br />
      <br />

      {/* Refresh Button */}
      <div className="flex justify-start md:justify-end p-0 md:px-8 w-full">
        <button
          onClick={() => window.location.reload()}
          className="flex justify-center items-center rounded-lg font-bold text-lg ml-5 bg-blue-500 px-5 text-white py-2"
        >
          Reload Page
        </button>
      </div>

      <br />
      <br />

      {/* form and table container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 w-full px-3">
        {/* grid 1 */}
        <div className="col-span-4 xl:col-span-3">
          <div className="w-full max-w-xs">
            <form className="border border-slate-400 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-md mb-2 font-bold border-slate-400 pb-2"
                >
                  {`Current interval: ${botRunIntervals?.fromTime} - ${botRunIntervals?.toTime}`}
                </label>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2 border-b border-slate-400 pb-2"
                >
                  Set interval
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2" >
                  From {"(Time)"}
                </label>
                <input
                  className="shadow appearance-none border border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="time"
                  placeholder="set start time"
                  onChange={(e) => {
                    setFromTime(e.target.value);
                  }}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm mb-2"
                >
                  To {"(Time)"}
                </label>
                <input
                  className="shadow appearance-none border border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="time"
                  placeholder="set end time"
                  onChange={(e) => {
                    setToTime(e.target.value);
                  }}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm mb-2" >
                  Number of runs
                </label>
                <input
                  className="shadow appearance-none border border-slate-400 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  type="number"
                  placeholder="Input number"
                  onChange={(e) => setNumberOfRuns(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  className="flex justify-center items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  onClick={(e) => submitForm(e)}
                >
                  Submit
                  {isLoading && (
                    <div className="pl-2">
                      <ReactLoading
                        type={"spin"}
                        color={"white"}
                        height={20}
                        width={20}
                      />
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* grid 2 */}
        <div className="col-span-8 xl:col-span-9 pr-8">
          <table className="w-full border-collapse border border-slate-400 ...">
            <thead>
              <td className=""></td>
              <td className=""></td>
              <td className="text-center text-lg font-bold py-2">
                Intervals set for today
              </td>
              <td className=""></td>
            </thead>

            <tbody>
              <tr>
                <td className="p-4 text-center border border-slate-400 w-[15%]">
                  Time
                </td>
                <td className="p-4 text-center border border-slate-400 w-[20%]">
                  Status
                </td>
                <td className="p-4  text-center border border-slate-400 w-[30%]">
                  Patient
                </td>
                <td className="p-4  text-center border border-slate-400 w-[30%]">
                  Appointment Date Time
                </td>
              </tr>

              {tableData?.map((index) => {
                return (
                    <tr key={index.time}>
                      <td className="p-4 text-center border border-slate-400 w-[15%]">
                        {index.time.slice(0, 5)}
                      </td>
                      <td className="p-4 text-center border border-slate-400 w-[20%]">
                        {index.status == "complete" ? (
                          <button className="px-3 py-1 bg-green-200 border-2 border-green-400">
                            Complete
                          </button>
                        ) : index.status == "failed" ? (
                          <button className="px-6 py-1 bg-red-200 border-2 border-red-400">
                            Failed
                          </button>
                        ) : (
                          "Scheduled"
                        )}
                      </td>
                      <td className="p-4  text-center border border-slate-400 w-[30%]">
                        {index.patient}
                      </td>
                      <td className="p-4  text-center border border-slate-400 w-[30%]">
                        {index.appointmentdateTime}
                      </td>
                    </tr>
                  
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <br />
      <br />
      <br />
      <br />
    </>
  );
}

export default App;
