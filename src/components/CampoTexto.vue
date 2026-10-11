
<script setup lang="ts">
    defineProps <{
        type: 'text' | 'number' | 'date'
        placeholder:string
    }>()

    const model = defineModel<string | number>();
</script>

<template>
    <input :type="type" :placeholder="placeholder" v-model="model" class="field"/>
</template>


<style scoped>
    .field{
        padding: 14px 6px;
        border:1px solid #ccc;
        border-radius:5px;
        width:100%;
    }
</style>