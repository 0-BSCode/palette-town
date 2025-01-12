<script lang="ts">
  import ColorPaletteService from "@/src/services/ColorPaletteService";
  import SelectedColorStore from "@/src/stores/selectedColorStore";
  import { ColorPaletteEnum } from "@/src/types/enums/ColorPaletteEnum";
  import type { ColorPaletteI } from "@/src/types/interfaces/ColorPaletteInterface";
  import type { ImageColorI } from "@/src/types/interfaces/ImageColorInterface";
  import * as Select from "$lib/components/ui/select/index.js";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import { copyText } from "svelte-copy";
  import { Copy, Check } from "svelte-radix";
  import Spinner from "../atoms/Spinner.svelte";

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
  let selectedHexString: string | undefined = undefined;
  let paletteMode: ColorPaletteEnum = ColorPaletteEnum.MONOCHROME;
  const colorPaletteService = new ColorPaletteService();
  let isFetching: boolean = false;

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
    isFetching = true;
    paletteRecommendation = await colorPaletteService.fetchPalette(
      selectedColor.hex,
      paletteMode,
    );
    isFetching = false;
  }

  function handleTextCopy(hex: string) {
    copyText(hex);
    selectedHexString = hex;

    setTimeout(() => {
      selectedHexString = undefined;
    }, 3000);
  }

  $: if (selectedColor) {
    setPalette(selectedColor, paletteMode);
  }
</script>

<div>
  <h2
    class="scroll-m-20pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
  >
    Color Recommendations
  </h2>
  <Separator class="my-4" />
  <!-- Select Input -->
  <div class="flex flex-col gap-2">
    <Label for="option">Palette Mode</Label>
    <Select.Root
      selected={options.filter((option) => option.value === paletteMode)[0]}
      disabled={selectedColor === undefined}
    >
      <Select.Trigger class="w-[180px]">
        <Select.Value placeholder="Select mode" />
      </Select.Trigger>
      <Select.Content>
        {#each options as option}
          <Select.Item
            value={option.value}
            label={option.label}
            on:click={() => (paletteMode = option.value)}
            >{option.label}</Select.Item
          >
        {/each}
      </Select.Content>
      <Select.Input name="option" bind:value={paletteMode} />
    </Select.Root>
  </div>
  {#if isFetching}
    <div class="flex h-24 w-full flex-col justify-center">
      <Spinner />
    </div>
  {:else}
    <!-- Color Recommendation -->
    {#if paletteRecommendation}
      <div class="mt-4 flex flex-1 flex-wrap gap-2">
        {#each paletteRecommendation.colors || [] as paletteColor}
          <Button
            on:click={() => handleTextCopy(paletteColor.hex)}
            class="relative h-24 w-24"
            style={`background-color: ${paletteColor.hex}; color: ${paletteColor.isDark ? "white" : "black"}`}
          >
            <p>
              {paletteColor.hex}
            </p>
            {#if paletteColor.hex === selectedHexString}
              <Check class="absolute right-1 top-1" size={20} />
            {:else}
              <Copy class="absolute right-1 top-1" size={20} />
            {/if}
          </Button>
        {/each}
      </div>
    {/if}
  {/if}
</div>
