import markdown from "./assets/tanstack-react-query-hash-files-blobs.md?raw";
import { Markdown } from "./components/Markdown";

import "./globals.css";

function App() {
  return (
    <>
      <Markdown markdown={markdown} />
    </>
  );
}

export default App;
