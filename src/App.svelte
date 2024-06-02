<script lang="ts">
  import Dropzone from "svelte-file-dropzone";
  import { extractColorsFromSrc } from "extract-colors";
  import type { ImageColorI } from "./types/interfaces/ImageColorInterface";
  import calculateRGBBrightness from "./utils/calculateRGBBrightness";
  import ColorPaletteService from "./services/ColorPaletteService";
  import type { ColorPaletteI } from "./types/interfaces/ColorPaletteInterface";

  let acceptedFile: File | undefined = undefined;
  let rejectedFile: File | undefined = undefined;
  let file: HTMLImageElement;
  let colors: ImageColorI[] = [];
  let palette: ColorPaletteI | undefined = undefined;
  let selectedColor: ImageColorI | undefined = undefined;
  const colorPaletteService = new ColorPaletteService();
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
        selectedColor = colors[colors.length - 1];
      });
      reader.readAsDataURL(acceptedFile);
    }
  }

  function handleDeleteFile() {
    acceptedFile = undefined;
    colors = [];
  }

  async function handleColorSelect(colorHex: string) {
    selectedColor = colors.find((c) => c.hex === colorHex);
    // TODO: Make reactive statement
    palette = await colorPaletteService.fetchPalette(colorHex);
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
  <body class="flex h-full w-3/4 flex-grow flex-col gap-3 bg-slate-400 p-3">
    <!-- Color list -->
    <section class="flex flex-col gap-1">
      <h2>Image Colors</h2>
      {#if colors.length}
        <div class="flex flex-wrap gap-2">
          {#each colors as color}
            <button
              class="flex aspect-square w-fit items-center rounded-md p-5"
              style={`background-color: ${color.hex}; color: ${color.isDark ? "white" : "black"}; ${color.hex === selectedColor?.hex ? "border: 2px solid black" : ""}`}
              on:click={() => handleColorSelect(color.hex)}
            >
              <p>
                {color.hex}
              </p>
            </button>
          {/each}
        </div>
      {:else}
        <p>No colors found</p>
      {/if}
    </section>
    <!-- Color Recommender -->
    {#if palette}
      <section class="flex h-48 flex-col gap-2">
        <h2>Color Recommendations</h2>
        <div class="flex flex-1">
          {#each palette.colors || [] as paletteColor}
            <button
              style={`flex: 1; background-color: ${paletteColor.hex}; color: ${paletteColor.isDark ? "white" : "black"}`}
            >
              {paletteColor.hex}
            </button>
          {/each}
        </div>
      </section>
    {/if}
  </body>
</main>
