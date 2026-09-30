<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<template>
  <div style="text-align: center; padding: 80px; font-family: sans-serif">
    <h1 style="font-size: 48px; margin: 0">404</h1>
    <p style="color: #666">Página não encontrada.</p>
    <button
      @click="router.push('/')"
      style="
        margin-top: 16px;
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        background: #4f46e5;
        color: #fff;
        cursor: pointer;
      "
    >
      Voltar ao início
    </button>
  </div>
</template>
