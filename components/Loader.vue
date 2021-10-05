<template>
  <b-skeleton-wrapper :loading="load" style="min-height:200px">
      <template #loading>
        <b-card>
          <b-skeleton width="85%"></b-skeleton>
          <b-skeleton width="55%"></b-skeleton>
          <b-skeleton width="70%"></b-skeleton>
        </b-card>
      </template>
  </b-skeleton-wrapper>
</template>

<script>
export default {
  props: ['load']
}
</script>

<style>

</style>
