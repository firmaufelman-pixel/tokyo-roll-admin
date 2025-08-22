import Spin from "antd/es/spin";
import React from "react";

function Loader({ height }: any) {
  return (
    <div
      style={{
        height: height ? height : "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" />
    </div>
  );
}

export default Loader;
