<script lang="ts">
  import FileStore from "@/src/stores/fileStore";

  let fileUrl: string | undefined = undefined;
  let imgElem: HTMLImageElement;

  FileStore.subscribe((_fileUrl) => {
    fileUrl = _fileUrl;
    if (fileUrl) {
      imgElem.setAttribute("src", fileUrl);
    }
  });
</script>

<!-- Not using conditional rendering bc on first upload, img will be undefined -->
<div
  class="relative flex h-full flex-1 flex-col justify-center overflow-y-hidden"
>
  <img
    bind:this={imgElem}
    class="h-96 object-contain"
    alt="Preview"
    style={`display: ${fileUrl ? "block" : "none"}`}
  />
</div>
<span style={`display: ${fileUrl ? "none" : "inline"}`}>Image Preview</span>
