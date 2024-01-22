import {
  Signal,
  createContextId,
  Slot,
  useContextProvider,
  useSignal,
  component$,
  useServerData,
} from "@builder.io/qwik";

export const SERVER_STATE = "SERVER_STATE";

export const ServerContext = createContextId<Signal<any>>("server.context");

export const ServerProvider = component$(() => {
  const serverData = useServerData(SERVER_STATE, {});
  const server = useSignal(serverData);
  useContextProvider(ServerContext, server);

  return <Slot />;
});
