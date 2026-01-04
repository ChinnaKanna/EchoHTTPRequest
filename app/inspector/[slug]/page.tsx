import { INSPECTOR_PAGES } from "@/config/pages";
import ServerInfo from "@/components/ServerInfo";
import ClientInfo from "@/components/ClientInfo";

export default function InspectorPage({ params }: any) {
  const page = INSPECTOR_PAGES.find(p => p.slug === params.slug);
  if (!page) return <h1>Not found</h1>;

  return (
    <main style={{ padding: 16 }}>
      <h2>{page.title}</h2>
      <ServerInfo />
      <ClientInfo />
    </main>
  );
}