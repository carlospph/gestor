<template>
  <h3>Carteira digital</h3>

  <div class="campos">
    <input type="text" placeholder="R$" v-model="formulario.valor"/>
    <input type="text" placeholder="Descrição" v-model="formulario.descricao"/>
    <input type="date" placeholder="Data" v-model="formulario.dataEvento"/>
    <select v-model="formulario.tipoEvento">
      <option value="selecione">Selecione o tipo</option>
      <option value="receita">receita</option>
      <option value="gasto">gasto</option>
    </select>
    <button @click="addTransation">Adicionar</button>
  </div>


  <div class="lista-transacoes">
    <div v-for="transacao in transacoes" :key="transacao.id">
    <p>
      {{transacao.descricao}}
    </p>
    <p>{{transacao.dataEvento}}</p>
    <p>{{transacao.tipoEvento}}</p>
    <p>{{transacao.valor}}</p>
    <div class="actions">
      <button class="btn-remove" @click="remover(transacao.id)">Excluir</button>
      <button class="btn-edit">Editar</button>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import '../../src/css/carteiraDigital.css';

interface Formulario{
  valor:number,
  descricao:string,
  dataEvento: string,
  tipoEvento: string,
}

interface Transacao extends Formulario{
  id:number
}

const formulario = ref<Formulario>({
  valor:null,
  descricao:'',
  tipoEvento:'',
  dataEvento:''
})

const transacoes = ref<Transacao[]>([{
  id:1,
  valor:2000,
  descricao:"Salário",
  dataEvento: "2026-09-30",
  tipoEvento: "receita"
},
{
  id:2,
  valor:4000,
  descricao:"Salário PLR",
  dataEvento: "2026-09-22",
  tipoEvento: "receita"
},
{
  id:3,
  valor:500,
  descricao:"Supermercado",
  dataEvento: "2026-09-30",
  tipoEvento: "gasto"
}])


function addTransation(){
  transacoes.value.push({
    id:Date.now(),
    descricao:formulario.value.descricao,
    valor:formulario.value.valor,
    tipoEvento: formulario.value.tipoEvento,
    dataEvento:formulario.value.dataEvento
  })

  alert("Adicionada a transação")
}


function remover(id:number) :void{
  if(confirm("Deseja apagar transação?")){
    transacoes.value = transacoes.value.filter(t=>t.id !== id)
  }
}

</script>