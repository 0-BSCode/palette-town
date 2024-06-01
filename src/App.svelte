<script lang="ts">
  import Dropzone from "svelte-file-dropzone";

  let acceptedFile = undefined;
  let rejectedFile: File | undefined = undefined;
  let showFile: boolean = false;
  let file: HTMLImageElement;

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
      showFile = true;

      const reader = new FileReader();
      reader.addEventListener("load", () => {
        file.setAttribute("src", reader.result as string);
      });
      reader.readAsDataURL(acceptedFile);
    } else {
      showFile = false;
    }
  }

  function handleDeleteFile() {
    acceptedFile = undefined;
    showFile = false;
  }
</script>

<main class="flex">
  <nav class="m-8 flex w-1/4 flex-col">
    <Dropzone
      on:drop={handleFilesSelect}
      accept={"image/*"}
      multiple={false}
      containerStyles="padding: 0;"
    >
      {#if showFile}
        <div class="relative">
          <p>Test</p>
          <img bind:this={file} class="w-full" src="" alt="Preview" />
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
  <body class="flex flex-grow flex-col bg-slate-400"> </body>
</main>
