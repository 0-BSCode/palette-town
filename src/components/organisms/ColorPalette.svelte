<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import FileStore from "@/src/stores/fileStore";
  import SelectedColorStore from "@/src/stores/selectedColorStore";
  import type { ImageColorI } from "@/src/types/interfaces/ImageColorInterface";
  import calculateRGBBrightness from "@/src/utils/calculateRGBBrightness";
  import { extractColorsFromSrc } from "extract-colors";

  let palette: ImageColorI[] = [];
  let selectedColor: ImageColorI | undefined = undefined;

  FileStore.subscribe(async (value) => {
    if (value) {
      const colors = await extractColorsFromSrc(value, {
        // TODO: Allow users to tweak
        distance: 0.2,
      });
      palette = colors.map((r) => ({
        ...r,
        isDark: calculateRGBBrightness(r.red, r.green, r.blue) < 128,
      }));
      SelectedColorStore.update((_current) => {
        return palette[palette.length - 1];
      });
    }
  });

  SelectedColorStore.subscribe((value) => {
    selectedColor = value;
  });

  function handleColorSelect(color: ImageColorI) {
    SelectedColorStore.update((_current) => {
      console.log("Updating to ", color);
      return color;
    });
  }
</script>

<div>
  <h1>Color Palette</h1>
  {#if palette.length}
    <div class="flex flex-wrap gap-2">
      {#each palette as color}
        <Button
          style={`background-color: ${color.hex}; color: ${color.isDark ? "white" : "black"}; ${color.hex === selectedColor?.hex ? "border: 2px solid black" : ""}`}
          on:click={() => handleColorSelect(color)}
        >
          <p>
            {color.hex}
          </p>
        </Button>
      {/each}
    </div>
  {:else}
    <p>No colors found</p>
  {/if}
</div>
