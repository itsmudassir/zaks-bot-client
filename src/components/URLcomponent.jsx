import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl } from "../globals/globalVariables";
import ReactLoading from "react-loading";

const URLcomponent = () => {
  const [url, setUrl] = useState("");
  const [newUrl, setnewUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    try {
      fetchUrl();
    } catch (err) {
      console.log(err);
    }
  }, []);

  const fetchUrl = async () => {
    try {
      const response = await axios.get(`${apiUrl}/targetDomain`);
      setUrl(response.data.url);
    } catch (err) {
      console.log(err);
    }
  };

  const updateUrl = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`${apiUrl}/targetDomain-update`, {
        name: "targetDomain",
        url: newUrl,
      });
      fetchUrl();
    } catch (err) {
      console.log(err);
    }
    finally{
      setIsLoading(false);
    }
  };

  return (
    <>
      <div>
        <div className="flex items-center w-full">
          <input
            className="border-2 border-slate-400 p-1 w-[70%]"
            type="text"
            value={url}
            disabled
          />
          <p className="font-bold text-lg ml-5">Source Url</p>
        </div>

        <div className="flex items-center w-full">
          <input
            className="border-2 border-slate-400 p-1 w-[70%]"
            type="text"
            onChange={(e) => setnewUrl(e.target.value)}
          />
          <button
            onClick={() => updateUrl()}
            className="flex justify-center items-center rounded-lg font-bold text-lg ml-5 bg-blue-500 px-5 text-white py-2"
          >
            Update
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
      </div>
    </>
  );
};

export default URLcomponent;
