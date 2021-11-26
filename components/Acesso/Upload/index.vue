<template>
  <div class="item">
    <div class="d-flex flex-row align-items-center justify-content-between py-2 my-2 text-center ">
        <div class="m-auto"><slot name="numero" /></div>
        <div class="w-75"><slot name="input"/></div>
        <div class="m-auto" ><b-btn v-if="remover" variant="outline-primary" @click="$emit('remover', i)" size="sm" title="Remover"><b-icon icon="trash" /></b-btn></div>
    </div>
    <div class="w-100 p-1"><slot name="letra"/></div>
  </div>
</template>

<script>
export default {
  props: {
    i: Number,
    remover: Boolean
  }
}
</script>

<style>
  .item{
    box-shadow: 0 0 2px #e6e6e6;
    border-radius: 10px;
  }

  .item:hover{
    background: #f2f2f2;
  }
</style>
