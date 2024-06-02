<script lang="ts">
  import Dropzone from "svelte-file-dropzone";
  import { extractColorsFromSrc } from "extract-colors";
  import type { ColorI } from "./types/interfaces/ColorInterface";
  import calculateRGBBrightness from "./utils/calculateRGBBrightness";

  let acceptedFile = undefined;
  let rejectedFile: File | undefined = undefined;
  let showFile: boolean = false;
  let file: HTMLImageElement;
  let colors: ColorI[] = [];

  interface DropzoneEvent {
    detail: {
      acceptedFiles: File[];
      fileRejections: File[];
    };
  }

  function handleFilesSelect(e: DropzoneEvent) {
    const { acceptedFiles, fileRejections } = e.detail;
    acceptedFile = acceptedFiles[0];
    rejectedFile = fileRejections[0];

    if (acceptedFile) {
      showFile = true;

      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        file.setAttribute("src", reader.result as string);
        const result = await extractColorsFromSrc(file.src);
        colors = result.map((r) => ({
          ...r,
          isDark: calculateRGBBrightness(r.red, r.green, r.blue) < 128,
        }));
      });
      reader.readAsDataURL(acceptedFile);
    } else {
      showFile = false;
    }
  }

  function handleDeleteFile() {
    acceptedFile = undefined;
    showFile = false;
    colors = [];
  }
</script>

<main class="flex">
  <nav class="m-8 flex w-1/4 flex-col">
    <Dropzone
      on:drop={handleFilesSelect}
      accept={"image/*"}
      multiple={false}
      containerStyles="padding: 0;"
    >
      {#if showFile}
        <div class="relative">
          <p>Test</p>
          <img bind:this={file} class="max-h-fit w-full" src="" alt="Preview" />
        </div>
      {:else}
        <span>Image Preview</span>
      {/if}
    </Dropzone>
    <button
      on:click={handleDeleteFile}
      class="z-50 my-2 w-full border-2 border-red-200 text-center"
      >Delete</button
    >
  </nav>
  <body class="flex flex-grow flex-col bg-slate-400">
    {#each colors as color}
      <div
        class="p-3"
        style={`background-color: ${color.hex}; color: ${color.isDark ? "white" : "black"}`}
      >
        {color.hex}
      </div>
    {/each}
  </body>
</main>
