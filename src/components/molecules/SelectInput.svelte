<script lang="ts">
  import * as Select from "$lib/components/ui/select/index.js";

  type SelectOption = {
    value: string;
    label: string;
  };

  /**
   * The options for the select input.
   * @type {SelectOption<T>[]}
   */
  export let options: SelectOption[];
  export let placeholder: string;
  export let value: string;
</script>

<Select.Root>
  <Select.Trigger class="w-[180px]">
    <Select.Value {placeholder} />
  </Select.Trigger>
  <Select.Content>
    {#each options as option}
      <Select.Item value={option.value} label={option.label}
        >{option.label}</Select.Item
      >
    {/each}
  </Select.Content>
  <Select.Input name="option" bind:value />
</Select.Root>
