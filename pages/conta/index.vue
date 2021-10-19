<template>
    <b-container>
        <banner />

        <b-row>
            <b-col md="3">
                <Menu />
            </b-col>

            <b-col md="9">
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
