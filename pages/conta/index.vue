<template>
    <b-container fluid class="">
        <b-row align-v="stretch">
            <b-col md="2"  class="bg-light">
                <Menu />
            </b-col>

            <b-col md="10">
                <banner />
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import Banner from '../../components/Acesso/Banner.vue'
import Menu from '../../components/Acesso/Menu.vue'
export default {
  middleware: 'auth',
  components: { Menu, Banner }
}
</script>

<style>

</style>
