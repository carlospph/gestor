<script setup lang="ts">
import '@/css/loginView.css';
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

<section id="login">
  <div class="box-img">
    <h2>vue</h2>
  </div>



  <div class="form-container">
      <div class="form-content">
      <h1>Acesso ao sistema</h1>
      <form @submit.prevent="entrar" class="form">
      <div>
        <label for="email">E-mail</label>
        <input
          v-model="email"
          type="email"
          id="email"
          required
          class="field"
          :disabled="loading"/>
      </div>

      <div>
        <label for="senha">Senha</label>
        <input
          v-model="password"
          type="password"
          required
          class="field"
          :disabled="loading"
          id="senha"
        />
      </div>

      <button
        type="submit"
        :disabled="loading" class="btn-entrar">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>

      <p v-if="error" class="error">
        ⚠️ {{ error }}
      </p>
      </form>
      </div>
  </div>
    


</section>

</template>
