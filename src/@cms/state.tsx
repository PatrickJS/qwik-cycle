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

export const EditContext = createContextId<Signal<any>>("server.edit");
export const EditFieldContext = createContextId<Signal<any>>("server.field");

export const ServerProvider = component$(() => {
  const serverData = useServerData(SERVER_STATE, {});
  const server = useSignal(serverData);
  const edit = useSignal(false);
  const editField = useSignal("");
  useContextProvider(ServerContext, server);
  useContextProvider(EditContext, edit);
  useContextProvider(EditFieldContext, editField);

  return <Slot />;
});
