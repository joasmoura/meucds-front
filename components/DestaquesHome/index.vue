<template>
  <section>
    <b-container fluid="sm">
      <b-link to="/artistas/1">
        <div class="bannerDestaque">
          Destaque
        </div>
      </b-link>
    </b-container>
  </section>
</template>

<script>
export default {

}
</script>

<style>
  .bannerDestaque {
    background: #ccc;
    height: 200px;
    border-radius: 20px 20px 0 0;
    padding:10px;
  }

  @media screen and (max-width: 480px) {
    .bannerDestaque {
      height: 120px;
    }
  }
</style>
