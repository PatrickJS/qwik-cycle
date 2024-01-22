import {
  component$,
  useOnDocument,
  // sync$,
  $,
  useSignal,
  // Slot,
  useServerData,
  useTask$,
  Signal,
  useContext,
  useContextProvider,
  Slot,
  HTMLAttributes,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ServerContext } from "~/@cms/state";

export const EDIT_EVENT = "app_edit";
export const CONFIRM_EVENT = "app_confirm";

export interface Props {
  bind: Signal<boolean>;
  path: any;
  content: any;
}
export const EditText = component$((props: Props) => {
  const serverContext = useContext(ServerContext);
  // const serverData = useServerData(SERVER_STATE, props.content);

  // undefined on client after initial load even as data is transferred
  // const serverContent = serverData[props.path];

  const editMode = useSignal(false);
  // const serverDataSignal = useSignal(serverContext.value[props.path]);

  // useOnDocument(
  //   EDIT_EVENT,
  //   $((evt: any) => {
  //     console.log(EDIT_EVENT, evt.detail, serverDataSignal.value);
  //     if (evt.detail.type === "edit") {
  //       editMode.value = true;
  //     } else if (evt.detail.type === "confirm") {
  //       editMode.value = false;
  //     }
  //     editMode.value = editMode.value;
  //   }),
  // );

  useTask$(({ track }) => {
    track(editMode);
    // track(serverDataSignal);
    track(props.bind);
    editMode.value = props.bind.value;
    console.log(
      "task editMode.value",
      editMode.value,
      serverContext.value[props.path],
    );
  });
  // useOnDocument(
  //   CONFIRM_EVENT,
  //   $((evt: any) => {
  //     console.log(CONFIRM_EVENT, evt);
  //     editMode.value = false;
  //     console.log("editMode.value", editMode.value, serverDataSignal.value);
  //   }),
  // );

  if (editMode.value === true) {
    return (
      <span
        // @ts-ignore
        contentEditable={editMode.value ? "plaintext-only" : "false"}
        onInput$={(evt, target) => {
          console.log("input enter", target?.textContent);
        }}
        onKeyDown$={(evt: any) => {
          console.log(
            "key down",
            evt.key,
            evt.code,
            evt.keyCode,
            evt.which,
            evt,
          );
        }}
      >
        {props.content}
      </span>
    );
  } else if (editMode.value === false && serverContext.value[props.path]) {
    return serverContext.value[props.path];
  }
  return props.content;
});

interface TextProps {
  bind: Signal<boolean>;
  path: string;
  children: any;
}
export function Text({ bind, path, children }: TextProps) {
  return <EditText bind={bind} path={path} content={children} />;
}

export default component$(() => {
  const editMode = useSignal(false);
  useOnDocument(
    EDIT_EVENT,
    $((evt: any) => {
      editMode.value = evt.detail;
      console.log("editMode.value", editMode.value, evt.detail);
    }),
  );
  return (
    <div class="m-5">
      <div>
        <button
          onClick$={() => {
            const detail = true;
            document.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail }));
            console.log("clicked", EDIT_EVENT, detail);
          }}
        >
          Edit
        </button>
        <button
          onClick$={() => {
            const detail = false;
            document.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail }));
            console.log("clicked", EDIT_EVENT, detail);
          }}
        >
          Confirm
        </button>
      </div>
      <div class="flex flex-col">
        <div>lol</div>
        <Text bind={editMode} path="appText">
          Loading... hello world
        </Text>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik Cycle",
    },
  ],
};
