<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { signOut, onAuthStateChanged, type Unsubscribe } from 'firebase/auth';
import { auth } from '../firebase';
import '../../src/css/homeView.css';
import CarteiraDigital from '../components/CarteiraDigital.vue';
const email = auth.currentUser?.email ?? '';

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
  } catch (e) {
    console.error('Erro ao sair:', e);
  }
}
</script>

<template>
  <div>
    <header class="homeView">
      <span v-if="email">{{ email }}</span>
      <button
        @click="sair">
        Sair
      </button>
    </header>

    <CarteiraDigital/>
  </div>
</template>
