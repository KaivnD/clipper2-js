import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ShapeEditor } from "./shape-editor";

function App() {
  return (
    <>
      <ShapeEditor />
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
