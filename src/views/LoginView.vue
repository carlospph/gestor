<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const router = useRouter();
const route = useRoute();

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref<string | null>(null);

async function entrar() {
  if (!email.value || !password.value) return;
  loading.value = true;
  error.value = null;

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    const redirect = (route.query.redirect as string) || '/';
    router.push(redirect);
  } catch (e: any) {
    error.value = traduzErro(e.code);
  } finally {
    loading.value = false;
  }
}

function traduzErro(code: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/user-not-found':
      return 'Usuário não encontrado.';
    case 'auth/wrong-password':
      return 'Senha incorreta.';
    case 'auth/invalid-credential':
      return 'E-mail ou senha inválidos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente mais tarde.';
    default:
      return 'Erro ao entrar. Tente novamente.';
  }
}
</script>

<template>
  <div
    style="
      max-width: 360px;
      margin: 80px auto;
      padding: 24px;
      font-family: sans-serif;
    "
  >
    <h1 style="margin: 0 0 24px; font-size: 22px">Entrar</h1>

    <form @submit.prevent="entrar">
      <div style="margin-bottom: 12px">
        <label
          style="
            display: block;
            font-size: 13px;
            color: #555;
            margin-bottom: 4px;
          "
          >E-mail</label
        >
        <input
          v-model="email"
          type="email"
          required
          :disabled="loading"
          style="
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
          "
        />
      </div>

      <div style="margin-bottom: 16px">
        <label
          style="
            display: block;
            font-size: 13px;
            color: #555;
            margin-bottom: 4px;
          "
          >Senha</label
        >
        <input
          v-model="password"
          type="password"
          required
          :disabled="loading"
          style="
            width: 100%;
            padding: 8px 10px;
            border: 1px solid #ccc;
            border-radius: 6px;
            box-sizing: border-box;
          "
        />
      </div>

      <button
        type="submit"
        :disabled="loading"
        style="
          width: 100%;
          padding: 10px;
          border: none;
          border-radius: 6px;
          background: #4f46e5;
          color: #fff;
          font-weight: 600;
          cursor: pointer;
        "
        :style="{ opacity: loading ? 0.6 : 1 }"
      >
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p v-if="error" style="color: #dc2626; margin-top: 12px; font-size: 14px">
        ⚠️ {{ error }}
      </p>
    </form>
  </div>
</template>
