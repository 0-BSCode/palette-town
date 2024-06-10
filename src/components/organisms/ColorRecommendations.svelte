<script lang="ts">
  import ColorPaletteService from "@/src/services/ColorPaletteService";
  import SelectedColorStore from "@/src/stores/selectedColorStore";
  import { ColorPaletteEnum } from "@/src/types/enums/ColorPaletteEnum";
  import type { ColorPaletteI } from "@/src/types/interfaces/ColorPaletteInterface";
  import type { ImageColorI } from "@/src/types/interfaces/ImageColorInterface";
  import SelectInput from "../molecules/SelectInput.svelte";

  const options = [
    {
      value: ColorPaletteEnum.MONOCHROME,
      label: "Monochrome",
    },
    {
      value: ColorPaletteEnum.MONOCHROME_DARK,
      label: "Monochrome Dark",
    },
    {
      value: ColorPaletteEnum.MONOCHROME_LIGHT,
      label: "Monochrome Light",
    },
    {
      value: ColorPaletteEnum.ANALOGIC,
      label: "Analogic",
    },
    {
      value: ColorPaletteEnum.COMPLEMENTARY,
      label: "Complementary",
    },
    {
      value: ColorPaletteEnum.ANALOGIC_COMPLEMENT,
      label: "Analogic Complement",
    },
    {
      value: ColorPaletteEnum.TRIAD,
      label: "Triad",
    },
    {
      value: ColorPaletteEnum.QUAD,
      label: "Quad",
    },
  ];

  let paletteRecommendation: ColorPaletteI | undefined = undefined;
  let selectedColor: ImageColorI | undefined = undefined;
  let paletteMode: ColorPaletteEnum = ColorPaletteEnum.MONOCHROME;
  const colorPaletteService = new ColorPaletteService();

  SelectedColorStore.subscribe(async (value) => {
    selectedColor = value;

    if (!value) {
      paletteRecommendation = undefined;
    }
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
  <h2
    class="scroll-m-20 border-b border-slate-100 pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  >
    Color Recommendations
  </h2>
  <SelectInput {options} placeholder="Select mode" value={paletteMode} />
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
