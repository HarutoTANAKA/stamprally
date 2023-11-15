<template>
  <div></div>
</template>

<script>

export default {
  created () {
    this.goTop()
  },
  methods: {
    goTop () {
      // ホーム画面(ユーザ側)にリダイレクト
      this.$store.dispatch('setCurrentStamprally', { id: null, name: null, lat: 0, lng: 0, color: '#fafafa' })
      this.$router.push({ name: 'stamprally' })
    }
  }
}
</script>
<style scoped>

</style>
