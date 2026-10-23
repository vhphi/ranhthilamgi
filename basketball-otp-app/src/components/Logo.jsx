
import React from "react";

export default function Logo({
  width = 360,
  className = "",
}) {
  return (
    <img
      src="./public/logo.png"
      alt="Ranh Thi Lam GG? - Duck Logo"
      width={width}
      className={className}
      style={{
        display: "block",
        height: "auto",
        objectFit: "contain",
      }}
    />
  );
}
