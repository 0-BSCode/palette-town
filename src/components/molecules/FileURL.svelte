<script lang="ts">
  import FileStore from "@/src/stores/fileStore";
  import FilePreview from "./FilePreview.svelte";
  import Dropzone from "svelte-file-dropzone";
  import Input from "$lib/components/ui/input/input.svelte";

  let imgString: string = "";

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
  <Dropzone disabled containerStyles="cursor: not-allowed;">
    <FilePreview previewText={"Image Preview"} heightValue={"18rem"} />
  </Dropzone>
</div>
