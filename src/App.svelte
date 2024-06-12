<script lang="ts">
  import "./app.css";
  import FileInput from "./components/organisms/FileInput.svelte";
  import ColorPalette from "./components/organisms/ColorPalette.svelte";
  import ColorRecommendations from "./components/organisms/ColorRecommendations.svelte";
  import ModeToggle from "./components/molecules/ModeToggle.svelte";
</script>

<main class="flex h-screen min-h-fit bg-secondary">
  <ModeToggle />
  <nav class="mx-8 my-5 flex w-1/4 flex-col items-center gap-2">
    <FileInput />
  </nav>
  <body class="flex h-full w-3/4 flex-grow flex-col gap-6 overflow-y-auto p-3">
    <ColorPalette />
    <ColorRecommendations />
  </body>
</main>
