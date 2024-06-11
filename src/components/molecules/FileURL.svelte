<script lang="ts">
  import FileStore from "@/src/stores/fileStore";
  import FilePreview from "./FilePreview.svelte";
  import Dropzone from "svelte-file-dropzone";
  import Input from "$lib/components/ui/input/input.svelte";
  import { mode } from "mode-watcher";

  let imgString: string = "";
  let theme: string | undefined = "light";

  mode.subscribe((_currentMode) => {
    theme = _currentMode;
  });

  FileStore.subscribe((_fileUrl) => {
    if (!_fileUrl) {
      imgString = "";
    }
  });

  function handlePasteEvent(e: ClipboardEvent) {
    // Clipboard data is either an image or an image url
    // TODO: Handle error
    let file = e.clipboardData?.files[0];
    const textData = e.clipboardData?.getData("Text");
    if (file) {
      // TODO: Extract file URL logic (used a lot)
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        FileStore.update((_currentFile) => {
          return reader.result as string;
        });
      });
      reader.readAsDataURL(file);
    } else if (textData?.length) {
      FileStore.update((_currentFile) => {
        return textData;
      });
    }
  }
</script>

<!-- Paste image data from URL or clipboard -->
<div class="flex flex-col gap-2">
  <Input
    type="text"
    on:paste={handlePasteEvent}
    placeholder="Paste image or image URL"
    bind:value={imgString}
  />
  <Dropzone
    disabled
    containerStyles={`background-color: ${theme === "dark" ? "black" : "white"}; padding-block: 0.5rem; display: flex; flex-direction: column; flex: 2; align-items: center; justify-content: center; border: 2px dashed #ccc; cursor: not-allowed; border-radius: 5px`}
  >
    <FilePreview previewText={"Image Preview"} heightValue={"18rem"} />
  </Dropzone>
</div>
