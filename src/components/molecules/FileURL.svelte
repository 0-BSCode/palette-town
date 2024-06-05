<script lang="ts">
  import FileStore from "@/src/stores/fileStore";
  import FilePreview from "./FilePreview.svelte";
  import Dropzone from "svelte-file-dropzone";
  import Input from "$lib/components/ui/input/input.svelte";

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
<div>
  <Input type="text" on:paste={handlePasteEvent} />
  <!-- <input type="text" accept="image/*" on:paste={handlePasteEvent} /> -->
  <Dropzone disabled>
    <FilePreview />
  </Dropzone>
</div>
