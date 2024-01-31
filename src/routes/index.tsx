import {
  component$,
  useOnDocument,
  // sync$,
  $,
  useSignal,
  // Slot,
  // useServerData,
  useTask$,
  // Signal,
  useContext,
  Slot,
  // useContextProvider,
  // Slot,
  // HTMLAttributes,
} from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { EditContext, EditFieldContext, ServerContext } from "~/@cms/state";
// import { EditField } from "~/@cms/state";

export const EDIT_EVENT = "app_edit";
export const CONFIRM_EVENT = "app_confirm";

export interface Props {
  path: any;
  content: any;
}
export const EditText = component$((props: Props) => {
  const serverContext = useContext(ServerContext);
  const edit = useContext(EditContext);
  const editField = useContext(EditFieldContext);
  const ref = useSignal<HTMLSpanElement>();
  const newContent = useSignal("");
  useTask$(({ track }) => {
    track(edit);
    console.log("edit.value", edit.value);
  });

  // const editMode = useSignal(editField.value === props.path && edit.value);
  useTask$(({ track }) => {
    track(ref);
    if (edit.value && ref.value) {
      const el = ref.value;
      el.focus();

      function inputLastRange(element: HTMLElement) {
        //Create a range (a range is a like the selection but invisible)
        const range = document.createRange();
        //Select the entire contents of the element with the range
        range.selectNodeContents(element);
        //collapse the range to the end point. false means collapse to end rather than the start
        range.collapse(false);
        //get the selection object (allows you to change selection)

        const selection = window.getSelection(); //get the selection object (allows you to change selection)
        if (selection) {
          selection.removeAllRanges(); //remove any selections already made
          selection.addRange(range); //make the range you have just created the visible selection
        }
      }
      inputLastRange(el);
    }
    //   // track(editMode);
    //   // track(serverDataSignal);
    //   track(() => editField.value);
    //   if (editField.value !== props.path) {
    //     return;
    //   }
    //   // editMode.value = edit.value;
  });
  // useTask$(({ track }) => {
  //   track(edit);
  //   if (edit.value === false && ref.value) {
  //     newContent.value = ref.value.textContent || "";
  //     return;
  //   }
  // });
  // console.log(
  //   "editMode.value",
  //   // editMode.value,
  //   edit.value,
  //   editField.value,
  //   props.path,
  //   editField.value === props.path,
  // );
  console.log("newContent", newContent.value);
  if (newContent.value && edit.value === false) {
    return newContent.value;
  }

  if (edit.value === true && editField.value === props.path) {
    console.log("EDIT MODE");
    return (
      <span
        ref={ref}
        // @ts-ignore
        contentEditable={"plaintext-only"}
        // onInput$={(evt) => {
        //   debugger;
        //   newContent.value = `${evt.data}`;
        //   // debugger;
        //   console.log("input enter", newContent.value);
        // }}
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
        autofocus
      >
        {newContent.value || props.content}
      </span>
    );
  } else if (serverContext.value[props.path]) {
    // overwrite the content with the server value
    return <div>?? {serverContext.value[props.path]}</div>;
  }
  // default value by developer
  return props.content;
});

interface TextProps {
  path: string;
  children?: any;
}
export const Text = component$(function Text({ path }: TextProps) {
  return <EditText path={path} content={<Slot />} />;
});

export default component$(() => {
  // const editMode = useSignal(false);
  // const canEdit = useSignal(false);
  const edit = useContext(EditContext);
  const editField = useContext(EditFieldContext);
  useOnDocument(
    EDIT_EVENT,
    $((evt: any) => {
      edit.value = evt.detail;
      console.log("editMode.value", evt.detail);
    }),
  );
  return (
    <div class="m-5">
      {edit.value && (
        <div>
          <button
            onClick$={() => {
              // const detail = true;
              // document.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail }));
              // console.log("clicked", EDIT_EVENT, detail);
              if (editField.value === "appText") {
                editField.value = "";
                return;
              } else {
                editField.value = "appText";
              }
              console.log("editField.value", editField.value);
            }}
          >
            Edit {editField.value === "appText" ? "Done" : "'appText'"}
          </button>
          <button
            onClick$={() => {
              const detail = false;
              edit.value = detail;
              // document.dispatchEvent(new CustomEvent(EDIT_EVENT, { detail }));
              console.log("clicked", EDIT_EVENT, detail);
            }}
          >
            Confirm
          </button>
        </div>
      )}

      <div class="flex flex-col">
        <h3>Welcome</h3>
        <div>
          <Text path="appText">Default View</Text>
        </div>
      </div>
      {edit.value === false && (
        <div class="fixed bottom-0 right-0 m-4 p-4 text-white">
          {/* @ts-ignore */}
          <button onClick="document.dispatchEvent(new CustomEvent('app_edit', { detail: true }));">
            Edit Page
          </button>
        </div>
      )}
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
