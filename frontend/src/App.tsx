import "./App.css";

import viteLogo from "/vite.svg";
import React, { useState } from "react";

import reactLogo from "./assets/react.svg";
import { readPdf } from "./utils";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <input
        type="file"
        multiple={false}
        onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
          if (!e.target.files) return;

          const pdf = e.target.files[0];
          await readPdf(pdf);
        }}
      />
    </>
  );
}

export default App;
