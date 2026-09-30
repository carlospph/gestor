<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { signOut, onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { auth } from '../firebase';
import HelloWorld from '../components/HelloWorld.vue';

const router = useRouter();
let unsubscribe: Unsubscribe | null = null;

onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, (user) => {
    if (!user) {
      router.replace({ name: 'login' });
    }
  });
});

onUnmounted(() => {
  unsubscribe?.();
});

async function sair() {
  try {
    await signOut(auth);
    // O onAuthStateChanged acima cuida do redirecionamento.
  } catch (e) {
    console.error('Erro ao sair:', e);
  }
}
</script>

<template>
  <HelloWorld />
  <div
    style="
      max-width: 640px;
      margin: 0 auto;
      padding: 16px;
      font-family: sans-serif;
    "
  >
    <header
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 16px;
      "
    >
      <h1 style="font-size: 20px; margin: 0">Instruções</h1>
      <button
        @click="sair"
        style="
          padding: 6px 12px;
          border: 1px solid #ccc;
          border-radius: 6px;
          background: #fff;
          cursor: pointer;
        "
      >
        Sair
      </button>
    </header>
  </div>
</template>
