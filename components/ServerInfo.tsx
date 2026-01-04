import { collectServerData } from "@/lib/serverCollector";

export default function ServerInfo() {
  const data = collectServerData();
  return (
    <div>
      <h3>Server received headers data</h3>
      <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
    </div>
  );
}