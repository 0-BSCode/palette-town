<script lang="ts">
  import "./app.css";
  import { extractColorsFromSrc } from "extract-colors";
  import type { ImageColorI } from "./types/interfaces/ImageColorInterface";
  import calculateRGBBrightness from "./utils/calculateRGBBrightness";
  import ColorPaletteService from "./services/ColorPaletteService";
  import type { ColorPaletteI } from "./types/interfaces/ColorPaletteInterface";
  import { ColorPaletteEnum } from "./types/enums/ColorPaletteEnum";
  import { Button } from "$lib/components/ui/button";
  import FileInput from "./components/organisms/FileInput.svelte";
  import ColorPalette from "./components/organisms/ColorPalette.svelte";
  import ColorRecommendations from "./components/organisms/ColorRecommendations.svelte";

  let acceptedFile: File | undefined = undefined;
  let rejectedFile: File | undefined = undefined;
  let file: HTMLImageElement;
  let colors: ImageColorI[] = [];
  let palette: ColorPaletteI | undefined = undefined;
  let selectedColor: ImageColorI | undefined = undefined;
  let paletteMode: ColorPaletteEnum = ColorPaletteEnum.MONOCHROME;
  let modeOption: ColorPaletteEnum = ColorPaletteEnum.MONOCHROME;
  const colorPaletteService = new ColorPaletteService();
  // TODO: Fix (when there's a valid input bc it can be file or URL)
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
    palette = await colorPaletteService.fetchPalette(colorHex, paletteMode);
  }

  async function handleModeSelect() {
    paletteMode = modeOption;
    // TODO: Deal with undefined hex
    palette = await colorPaletteService.fetchPalette(
      selectedColor?.hex || "",
      paletteMode,
    );
  }

  // TODO: Clean up (separate logic for image data and image URL data)
  async function pasteFunction(e: ClipboardEvent) {
    acceptedFile = e.clipboardData?.files[0];
    const textData = e.clipboardData?.getData("Text");
    if (acceptedFile) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        file.setAttribute("src", reader.result as string);
      });
      reader.readAsDataURL(acceptedFile);
    } else if (textData?.length) {
      file.setAttribute("src", textData);
    }
  }
</script>

<main class="flex h-screen min-h-fit">
  <nav class="m-8 flex w-1/4 flex-col items-center gap-2">
    <h1>Image</h1>
    <FileInput />
    <!-- <form id="new_document_attachment" method="post" enctype="multipart/form-data"> -->
    <input type="text" accept="image/*" on:paste={pasteFunction} />
    <!-- </form> -->

    <Button on:click={handleDeleteFile}>Delete</Button>
  </nav>
  <body class="flex h-full w-3/4 flex-grow flex-col gap-3 bg-slate-400 p-3">
    <ColorPalette />
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
    <ColorRecommendations />
    {#if palette}
      <section class="flex h-48 flex-col gap-2">
        <h2>Color Recommendations</h2>
        <select bind:value={modeOption} on:change={handleModeSelect}>
          {#each Object.values(ColorPaletteEnum) as value}
            <option {value} selected={paletteMode === value}>{value}</option>
          {/each}
        </select>
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
