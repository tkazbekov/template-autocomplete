import React from "react";
import TextEditor from "./components/text-editor/TextEditor";
import Header from "./components/header/Header";
import "./App.css";

function App() {
  return (
    <div className="app-wrap">
      <Header />
      <main className="content">
        <TextEditor />
      </main>
    </div>
  );
}

export default App;
