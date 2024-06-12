<script lang="ts">
  import "./app.css";
  import FileInput from "./components/organisms/FileInput.svelte";
  import ColorPalette from "./components/organisms/ColorPalette.svelte";
  import ColorRecommendations from "./components/organisms/ColorRecommendations.svelte";
  import ModeToggle from "./components/molecules/ModeToggle.svelte";
</script>

<main class="flex h-screen min-h-fit flex-col bg-secondary md:flex-row">
  <ModeToggle />
  <nav class="mx-8 my-5 flex flex-col items-center gap-2">
    <FileInput />
  </nav>
  <body
    class="flex h-full flex-grow flex-col gap-6 overflow-y-auto px-5 py-5 md:py-3"
  >
    <ColorPalette />
    <ColorRecommendations />
  </body>
</main>
