<script lang="ts">
  import Dropzone from "svelte-file-dropzone";
  import { extractColorsFromSrc } from "extract-colors";
  import type { ColorI } from "./types/interfaces/ColorInterface";
  import calculateRGBBrightness from "./utils/calculateRGBBrightness";

  let acceptedFile: File | undefined = undefined;
  let rejectedFile: File | undefined = undefined;
  let file: HTMLImageElement;
  let colors: ColorI[] = [];
  $: showFile = acceptedFile !== undefined;

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
      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        file.setAttribute("src", reader.result as string);
        const result = await extractColorsFromSrc(file.src, {
          // TODO: Allow user to control settings
          distance: 0.2,
        });
        colors = result.map((r) => ({
          ...r,
          isDark: calculateRGBBrightness(r.red, r.green, r.blue) < 128,
        }));
      });
      reader.readAsDataURL(acceptedFile);
    }
  }

  function handleDeleteFile() {
    acceptedFile = undefined;
    colors = [];
  }
</script>

<main class="flex h-screen min-h-fit">
  <nav class="m-8 flex w-1/4 flex-col items-center gap-2">
    <h1>Image</h1>
    <Dropzone
      on:drop={handleFilesSelect}
      accept={"image/*"}
      multiple={false}
      containerStyles="padding-block: 0.5rem; display: flex; flex-direction: column; flex: 2; align-items: center; justify-content: center; border: 2px dashed #ccc; border-radius: 5px; width: 100%;"
    >
      {#if showFile}
        <div
          class="relative flex h-full flex-1 flex-col justify-center overflow-y-hidden"
        >
          <img
            bind:this={file}
            class="h-96 object-contain"
            src=""
            alt="Preview"
          />
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
  <body class="flex h-full w-3/4 flex-grow flex-col bg-slate-400 p-3">
    <!-- Color list -->
    <section class="flex flex-wrap gap-2">
      {#each colors as color}
        <div
          class="flex aspect-square w-fit items-center rounded-md p-5"
          style={`background-color: ${color.hex}; color: ${color.isDark ? "white" : "black"}`}
        >
          <p>
            {color.hex}
          </p>
        </div>
      {/each}
    </section>
  </body>
</main>
