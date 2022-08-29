import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import axios from "axios";
import { apiUrl } from "../globals/globalVariables";

export default function ToggleButton() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    
    callData();
  }, []);

  async function callData() {
    try {
      const result1 = await axios.get(`${apiUrl}/botStatus`);
      setEnabled(result1.data.state);
    } catch (err) {
      console.log(err);
    }
  }

  const changeState = async ()=>{
    try {
      const result1= await axios.patch(`${apiUrl}/botStatus-update`, {name:"botStatus", state: !enabled});
      setEnabled(!enabled);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Switch
      checked={enabled}
      onChange={()=>changeState()}
      className={`${
        enabled
          ? "bg-white border border-slate-400"
          : "border border-white bg-blue-500"
      } relative inline-flex w-28 items-center rounded-lg`}
    >
      <span className="sr-only">Enable notifications</span>
      <span
        className={`${
          enabled
            ? "translate-x-12 bg-blue-500 text-white"
            : " bg-white translate-x border"
        } inline-block h-12  w-[61.5px] transform rounded-md  flex items-center justify-center text-xl font-semibold`}
      >
        {enabled ? "on" : "off"}
      </span>
    </Switch>
  );
}
