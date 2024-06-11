<!-- Place form to upload/delete inputted image -->
<script lang="ts">
  import { TabsEnum } from "@/src/types/enums/TabsEnum";
  import * as Tabs from "$lib/components/ui/tabs";
  import FileDropzone from "../molecules/FileDropzone.svelte";
  import FileUrl from "../molecules/FileURL.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import FileStore from "@/src/stores/fileStore";
  import SelectedColorStore from "@/src/stores/selectedColorStore";

  let activeTab: TabsEnum = TabsEnum.UPLOAD;
  let disableBtn: boolean = true;

  FileStore.subscribe((_currentFile) => {
    disableBtn = _currentFile === undefined;
  });

  async function handleDeleteFile() {
    FileStore.update((_currentFile) => {
      return undefined;
    });
    SelectedColorStore.update((_current) => {
      return undefined;
    });
  }
</script>

<div class="flex w-full flex-col items-center gap-1">
  <h1 class="scroll-m-20 text-xl font-extrabold tracking-tight lg:text-2xl">
    Image Upload
  </h1>
  <Tabs.Root value={activeTab} class="flex w-full flex-col items-center gap-1">
    <Tabs.List class="w-full">
      <Tabs.Trigger value={TabsEnum.UPLOAD} class="w-full">Upload</Tabs.Trigger>
      <Tabs.Trigger value={TabsEnum.URL} class="w-full">URL</Tabs.Trigger>
    </Tabs.List>
    <!-- Upload image from local -->
    <Tabs.Content value={TabsEnum.UPLOAD} class="w-full">
      <FileDropzone />
    </Tabs.Content>
    <!-- Upload image from URL or clipboard-->
    <Tabs.Content value={TabsEnum.URL} class="w-full"><FileUrl /></Tabs.Content>
    <Button
      on:click={handleDeleteFile}
      class="mt-3 w-full"
      disabled={disableBtn}>Delete</Button
    >
  </Tabs.Root>
</div>
