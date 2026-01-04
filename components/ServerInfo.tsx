import { collectServerData } from "@/lib/serverCollector";

export default function ServerInfo() {
  const data = collectServerData();
  return (
    <div>
      <h3>Server received data as part of request</h3>
      <pre><code>{JSON.stringify(data, null, 2)}</code></pre>
    </div>
  );
}
