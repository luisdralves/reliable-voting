import Head from "next/head";
import { useRouter } from "next/router";
import { api } from "src/utils/api";

export default function Home() {
  const router = useRouter();
  const { isLoading, isError, isSuccess } =
    api.voter.getLowestAvailableId.useQuery(undefined, {
      onSuccess: (lowestAvailableId) => {
        void router.push(String(lowestAvailableId));
      },
    });

  return (
    <>
      <Head>
        <title>Reliable voting - connecting</title>
      </Head>
      <main>
        <p>
          {isLoading && "Setting up a secure connection..."}
          {isError && "Error connecting"}
          {isSuccess && "Redirecting..."}
        </p>
      </main>
    </>
  );
}
