<script lang="ts">
  import FileStore from "@/src/stores/fileStore";
  import { mode } from "mode-watcher";
  import Dropzone from "svelte-file-dropzone";
  import FilePreview from "./FilePreview.svelte";

  let themeMode: string | undefined = "light";

  mode.subscribe((_currentMode) => {
    themeMode = _currentMode;
  });

  interface DropzoneEvent {
    detail: {
      acceptedFiles: File[];
      fileRejections: File[];
    };
  }

  function handleFilesSelect(e: DropzoneEvent) {
    const { acceptedFiles, fileRejections } = e.detail;
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        FileStore.update((_currentFile) => {
          return reader.result as string;
        });
      });
      reader.readAsDataURL(file);
    }
  }
</script>

<div class="flex flex-col items-center gap-2">
  <Dropzone
    on:drop={handleFilesSelect}
    accept="image/*"
    multiple={false}
    containerStyles={`background-color: ${themeMode === "dark" ? "black" : "white"}; padding-block: 0.5rem; display: flex; flex-direction: column; flex: 2; align-items: center; justify-content: center; border: 2px dashed #ccc; border-radius: 5px; width: 100%`}
  >
    <FilePreview
      previewText={"Browse or upload an image"}
      heightValue={"20rem"}
    />
  </Dropzone>
</div>
