<script lang="ts">
  import ColorPaletteService from "@/src/services/ColorPaletteService";
  import SelectedColorStore from "@/src/stores/selectedColorStore";
  import { ColorPaletteEnum } from "@/src/types/enums/ColorPaletteEnum";
  import type { ColorPaletteI } from "@/src/types/interfaces/ColorPaletteInterface";
  import type { ImageColorI } from "@/src/types/interfaces/ImageColorInterface";

  let paletteRecommendation: ColorPaletteI | undefined = undefined;
  let selectedColor: ImageColorI | undefined = undefined;
  let paletteMode: ColorPaletteEnum = ColorPaletteEnum.MONOCHROME;
  const colorPaletteService = new ColorPaletteService();

  SelectedColorStore.subscribe(async (value) => {
    selectedColor = value;
  });

  async function setPalette(
    selectedColor: ImageColorI,
    paletteMode: ColorPaletteEnum,
  ) {
    paletteRecommendation = await colorPaletteService.fetchPalette(
      selectedColor.hex,
      paletteMode,
    );
  }

  $: if (selectedColor) {
    setPalette(selectedColor, paletteMode);
  }
</script>

<div>
  <h2>Color Recommendations</h2>
  <select bind:value={paletteMode}>
    {#each Object.values(ColorPaletteEnum) as value}
      <option {value} selected={paletteMode === value}>{value}</option>
    {/each}
  </select>
  {#if paletteRecommendation}
    <div class="flex flex-1">
      {#each paletteRecommendation.colors || [] as paletteColor}
        <button
          style={`flex: 1; background-color: ${paletteColor.hex}; color: ${paletteColor.isDark ? "white" : "black"}`}
        >
          {paletteColor.hex}
        </button>
      {/each}
    </div>
  {/if}
</div>
