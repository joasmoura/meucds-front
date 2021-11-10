<template>
<Acesso>
  <h1>Playlists</h1>
</Acesso>
</template>

<script>
import Acesso from '@/components/Acesso'
export default {
  middleware: 'auth',
  components: { Acesso }

}
</script>

<style>

</style>
