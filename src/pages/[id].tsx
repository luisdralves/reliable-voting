import styled from "@emotion/styled";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { api } from "src/utils/api";

const countVotes = (votesArray: { id: number; voterId: number }[]) =>
  votesArray.reduce((results, { id }) => {
    if (results[id] === undefined) {
      results[id] = 1;
    } else {
      results[id]++;
    }

    return results;
  }, {} as Record<number, number>);

const Main = styled.main`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  max-width: 800px;
  margin: 0 auto;
`;

const Button = styled.button<{ isSelected?: boolean }>`
  background-color: ${({ isSelected }) =>
    isSelected ? "green" : "transparent"};
  color: ${({ isSelected }) => (isSelected ? "white" : "black")};
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  min-width: 48px;
  transition: 250ms ease-in-out;
  transition-property: background-color, color, opacity;
  cursor: pointer;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const Buttons = styled.ul`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  list-style: none;
  padding: 8px;
`;

const AdminButtons = () => {
  const state = api.state.get.useQuery();
  const lockMutation = api.state.lock.useMutation();
  const unlockMutation = api.state.unlock.useMutation();
  const isDisabled =
    state.isLoading || lockMutation.isLoading || unlockMutation.isLoading;

  return (
    <>
      <Button
        disabled={state.data?.locked || isDisabled}
        onClick={() => lockMutation.mutate()}
      >
        Lock
      </Button>
      <Button
        disabled={!state.data?.locked || isDisabled}
        onClick={() => unlockMutation.mutate()}
      >
        Unlock
      </Button>
    </>
  );
};

export default function Home() {
  const [vote, setVote] = useState<number>();
  const [submittedVote, setSubmittedVote] = useState<number>();
  const router = useRouter();
  const id = useMemo(() => {
    const id = Number(router.query.id);
    if (typeof id === "number" && !Number.isNaN(id) && id >= 0 && id <= 20) {
      return id;
    }
    return undefined;
  }, [router.query.id]);

  const state = api.state.get.useQuery(undefined, {
    refetchInterval: 2000,
  });
  const votes = api.vote.getAll.useQuery(undefined, {
    enabled: state.data?.locked,
    refetchInterval: 2000,
  });
  const voters = api.voter.getAll.useQuery(undefined, {
    refetchInterval: 2000,
  });
  const voter = api.voter.get.useQuery({ id }, { enabled: id !== undefined });
  const voteMutation = api.vote.post.useMutation({
    onSuccess: (data) => {
      setSubmittedVote(data.id);
      setVote(undefined);
    },
  });
  const isDisabled = vote === undefined || id === undefined;

  useEffect(() => {
    setVote(undefined);
    setSubmittedVote(undefined);
  }, [state.data?.locked]);

  return (
    <>
      <Head>
        <title>Reliable voting</title>
      </Head>
      <Main>
        <p style={{textAlign:'center'}}>
          {'Voted for:'}
          <br/>
          {submittedVote === undefined ? "did not vote yet" : submittedVote}
        </p>
        {state.isSuccess &&
          state.data?.locked &&
          votes.isSuccess &&
          voter.isSuccess && (
            <>
              <pre>
                <code>{JSON.stringify(countVotes(votes.data), null, 2)}</code>
              </pre>

              {id === 0 && <AdminButtons />}
            </>
          )}

        {state.isSuccess &&
          !state.data?.locked &&
          voters.isSuccess &&
          voter.isSuccess && (
            <>
              <Buttons>
                {[...Array((voters?.data?.length ?? 1) - 1).keys()].map((i) => (
                  <li key={i}>
                    <Button isSelected={vote === i} onClick={() => setVote(i)}>
                      {i}
                    </Button>
                  </li>
                ))}
              </Buttons>

              <Button
                disabled={isDisabled}
                onClick={() => {
                  if (isDisabled) {
                    return;
                  }
                  voteMutation.mutate({ voterId: id, id: vote });
                }}
              >
                Vote
              </Button>

              {id === 0 && <AdminButtons />}
            </>
          )}
      </Main>
    </>
  );
}
