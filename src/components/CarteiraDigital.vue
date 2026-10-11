<template>
  <section class="area-carteira">
    <h3 class="title-carteira">Carteira digital</h3>

  <div class="colunas">
    <div class="container-resumo">
      <span class="box-resumo">
        <img width="96" height="96" src="https://img.icons8.com/parakeet-partial-filled/96/F25081/graph.png" alt="graph"/>
        <p>
          {{ moedaBR(totalGastos) }}
        </p>

      </span>

       <span class="box-resumo">
        <img width="80" height="80" src="https://img.icons8.com/dotty/80/40C057/graph.png" alt="graph"/>
        <p>
         {{ moedaBR(totalReceita) }}
       </p>
      </span>
    </div>

    <div>
      <form class="form" @submit.prevent="salvarTransacao">
        <CampoTexto type="number" placeholder="R$" v-model="formulario.valor"/>
        <CampoTexto type="text" placeholder="Descrição" v-model="formulario.descricao"/>
        <CampoTexto type="date" placeholder="Data evento" v-model="formulario.dataEvento"/>
        <select v-model="formulario.tipoEvento">
          <option value="">Selecione o tipo</option>
          <option value="receita">receita</option>
          <option value="gasto">gasto</option>
        </select>
        <button type="submit" class="btn-add">Adicionar</button>
      </form>
    </div>
  </div>
    <!-- Modal de Edição -->
    <div v-if="mostraModal" class="modal-overlay">
      <div class="modal-content form">
        <h3>Editar Transação</h3>
        <CampoTexto type="number" placeholder="R$" v-model="formulario.valor"/>
        <CampoTexto type="text" placeholder="Descrição" v-model="formulario.descricao"/>
        <CampoTexto type="date" placeholder="Data evento" v-model="formulario.dataEvento"/>
        <select v-model="formulario.tipoEvento">
          <option value="receita">receita</option>
          <option value="gasto">gasto</option>
        </select>
        <div class="actions">
          <button @click="salvarTransacao" class="btn-salve">Salvar Alterações</button>
          <button @click="cancelarEdicao" class="btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="search">
      <CampoTexto type="text" placeholder="Buscar..." v-model="termoBusca"/>
    </div>

    <div class="carteira cards">
      <div v-for="transacao in transacoesPaginadas" :key="transacao.id" class="card" :class="transacao.tipoEvento === 'receita' ? 'receita' : 'gasto'">
        <p class="descricao">{{transacao.descricao}}</p>
        <p>{{formataDataBR(transacao.dataEvento)}}</p>
        <p>{{ transacao.tipoEvento }}</p>
        <p>{{moedaBR(transacao.valor)}}</p>
        <div class="actions">
          <button class="btn-remove" @click="remover(transacao.id)">Excluir</button>
          <button class="btn-edit" @click="iniciarEdicao(transacao)">Editar</button>
        </div>
      </div>
    </div>

    <div class="paginacao">
      <button :disabled="paginaAtual === 1" @click="paginaAtual--" class="btn-ant">Anterior</button>
      <span>{{ paginaAtual }} de {{ totalPaginas }}</span>
      <button :disabled="paginaAtual === totalPaginas" @click="paginaAtual++" class="btn-next">Próxima</button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import '@/css/carteiraDigital.css';
import CampoTexto from '@/components/CampoTexto.vue';

interface Transacao {
  id: number;
  valor: number;
  descricao: string;
  dataEvento: string;
  tipoEvento: string;
}

const termoBusca = ref('');
const paginaAtual = ref(1);
const itensPorPagina = 5;
const editandoId = ref<number | null>(null);
const mostraModal = ref(false);



const totalGastos = computed(() => {
  return transacoes.value
    .filter(transacao => transacao.tipoEvento === 'gasto')
    .reduce((acc, transacao) => acc + transacao.valor, 0);
});



const totalReceita = computed(() => {
  return transacoes.value
    .filter(transacao => transacao.tipoEvento === 'receita')
    .reduce((acc, transacao) => acc + transacao.valor, 0);
});


const formulario = ref<Omit<Transacao, 'id'>>({
  valor: 0, descricao: '', tipoEvento: '', dataEvento: ''
});

const transacoes = ref<Transacao[]>([
  { id: 1, valor: 2000, descricao: "Salário", dataEvento: "2026-09-30", tipoEvento: "receita" }
]);

const transacoesFiltradas = computed(() => 
  transacoes.value.filter(t => t.descricao.toLowerCase().includes(termoBusca.value.toLowerCase()))
);

const totalPaginas = computed(() => Math.max(1, Math.ceil(transacoesFiltradas.value.length / itensPorPagina)));

const transacoesPaginadas = computed(() => {
  const inicio = (paginaAtual.value - 1) * itensPorPagina;
  return transacoesFiltradas.value.slice(inicio, inicio + itensPorPagina);
});

function salvarTransacao() {
   if (!formulario.value.valor || !formulario.value.descricao || !formulario.value.dataEvento || !formulario.value.tipoEvento) {
    alert("Por favor, preencha todos os campos.");
    return;  
  }

  if (editandoId.value) {
    const index = transacoes.value.findIndex(t => t.id === editandoId.value);
    transacoes.value[index] = { id: editandoId.value, ...formulario.value };
    editandoId.value = null;
    mostraModal.value = false;
  } else {
    transacoes.value.push({ id: Date.now(), ...formulario.value });
  }
  limparFormulario();
}


function iniciarEdicao(t: Transacao) {
  editandoId.value = t.id;
  formulario.value = { ...t };
  mostraModal.value = true;
}

function cancelarEdicao() {
  editandoId.value = null;
  mostraModal.value = false;
  limparFormulario();
}

function limparFormulario() {
  formulario.value = { valor: 0, descricao: '', tipoEvento: '', dataEvento: '' };
}

function remover(id: number) {
  if (confirm("Deseja apagar transação?")) {
    transacoes.value = transacoes.value.filter(t => t.id !== id);
  }
}

function moedaBR(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formataDataBR(data: string): string {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

</script>
