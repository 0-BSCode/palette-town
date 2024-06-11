<script lang="ts">
  import FileStore from "@/src/stores/fileStore";
  export let previewText: string;
  export let heightValue: string;

  let fileUrl: string | undefined = undefined;
  let imgElem: HTMLImageElement;

  FileStore.subscribe((_fileUrl) => {
    fileUrl = _fileUrl;
    if (fileUrl) {
      imgElem.setAttribute("src", fileUrl);
    }
  });
</script>

<div
  class="flex flex-col justify-center px-3 py-6"
  style={`height: ${heightValue}`}
>
  <div class="relative flex flex-col justify-center overflow-y-hidden">
    <img
      bind:this={imgElem}
      class="object-contain"
      alt="Preview"
      style={`display: ${fileUrl ? "block" : "none"}`}
    />
  </div>
  {#if !fileUrl}
    <span style={`display: ${fileUrl ? "none" : "inline"}`}>{previewText}</span>
  {/if}
</div>
