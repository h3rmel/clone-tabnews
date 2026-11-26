import { ReactNode } from "react";
import useSWR from "swr";

type StatusResponse = {
  updated_at: string;
  dependencies: {
    database: {
      version: string;
      max_connections: number;
      opened_connections: number;
    };
  };
};

async function fetchAPI(key: string) {
  const response = await fetch(key);

  return response.json();
}

export default function Page(): ReactNode {
  const { data, error, isLoading } = useSWR<StatusResponse, Error>(
    "api/v1/status",
    fetchAPI,
    {
      refreshInterval: 5000,
    },
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <section className="flex flex-col w-full">
        <h1 className="text-2xl mb-4">Status</h1>
        {error && <p className="text-red-500">Error fetching status</p>}
        {isLoading && <p>Loading...</p>}
        {data && (
          <ul>
            <li>
              Versão do banco de dados: {data.dependencies.database.version}
            </li>
            <li>
              Conexões abertas: {data.dependencies.database.opened_connections}
            </li>
            <li>
              Conexões máximas: {data.dependencies.database.max_connections}
            </li>
            <li>
              Última atualização:{" "}
              {new Date(data.updated_at).toLocaleString("pt-BR")}
            </li>
          </ul>
        )}
      </section>
    </main>
  );
}
