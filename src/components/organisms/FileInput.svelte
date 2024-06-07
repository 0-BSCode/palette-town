<!-- Place form to upload/delete inputted image -->
<script lang="ts">
  import { TabsEnum } from "@/src/types/enums/TabsEnum";
  import * as Tabs from "$lib/components/ui/tabs";
  import FileDropzone from "../molecules/FileDropzone.svelte";
  import FileUrl from "../molecules/FileURL.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import FileStore from "@/src/stores/fileStore";
  import SelectedColorStore from "@/src/stores/selectedColorStore";

  let imgData: File | string | undefined = undefined;
  let activeTab: TabsEnum = TabsEnum.UPLOAD;

  async function handleDeleteFile() {
    FileStore.update((_currentFile) => {
      return undefined;
    });
    SelectedColorStore.update((_current) => {
      return undefined;
    });
  }
</script>

<div>
  <Tabs.Root value={activeTab}>
    <Tabs.List>
      <Tabs.Trigger value={TabsEnum.UPLOAD}>Upload</Tabs.Trigger>
      <Tabs.Trigger value={TabsEnum.URL}>URL</Tabs.Trigger>
    </Tabs.List>
    <!-- Upload image from local -->
    <Tabs.Content value={TabsEnum.UPLOAD}>
      <FileDropzone />
    </Tabs.Content>
    <!-- Upload image from URL or clipboard-->
    <Tabs.Content value={TabsEnum.URL}><FileUrl /></Tabs.Content>
    <Button on:click={handleDeleteFile}>Delete</Button>
  </Tabs.Root>
</div>
