import React, { useState } from "react";
import Toggle from "react-toggle";
import "react-toggle/style.css"; // 標準スタイル

const ToggleSwitch = () => {
  const [checked, setChecked] = useState(false);

  return (
    <Toggle
      defaultChecked={checked}
      onChange={() => setChecked(!checked)}
      icons={false} // アイコンを非表示にしたい場合
    />
  );
};

export default ToggleSwitch;
