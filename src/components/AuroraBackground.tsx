import React from "react";

const AuroraBackground: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <>
      <div className="aurora-bg" />
      <div style={{ width: "100%", height: "100%" }}>{children}</div>
    </>
  );
};

export default AuroraBackground;
