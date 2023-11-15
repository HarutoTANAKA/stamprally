<template>
  <!--コンソールで表示するユーザ画面のプレビュー-->
  <b-container class="py-0" style="border-radius: 3px; height: 88vh">
    <b-row class="d-flex mb-3">
      <b-col>
        <div class="d-flex justify-content-center">
          <iframe
            width="350px"
            height="690px"
            frameborder="0"
            scrolling="no"
            marginheight="0"
            marginwidth="0"
            style="border-radius: 10px; border: #696969 solid 5px"
            allow="geolocation 'src'; camera 'src'"
            src="https://stamprally3-test.web.app/stamprally/PGWf6Q2wnYUelUbGM34Z/"
          ></iframe>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'AppPreview'
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 10px
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, .3);
  border-radius: 4px;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, .3);
}
</style>
