import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const DevDashboard = () => {
  const [value, setValue] = useState("");

  const navigate = useNavigate();
  const updateURLQuery = () => {
    if (value) {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("filter", `${value}`);
      navigate(`?${newParams.toString()}`, {
        replace: true,
      });
    } else {
      const newParams = new URLSearchParams(window.location.search);
      newParams.delete("filter");
      navigate(`?${newParams.toString()}`, {
        replace: true,
      });
    }
  };

  return (
    <div style={{ marginTop: "64px" }}>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={updateURLQuery}>update URL Query</button>
    </div>
  );
};
