<template>
  <v-app>
    <v-layout class="matrix">
      <canvas id="matr"></canvas>
    </v-layout>
<!--     {{ $t('test') }}
    <v-btn style="width:200px" v-on:click='changeLang'>{{$i18n.locale}}</v-btn> -->
    <nuxt />
  </v-app>
</template>

<script>
  import matrix from '@/assets/scripts/matrix'
  export default {
    methods: {
      changeLang () {
        this.$i18n.locale = (this.$i18n.locale === 'ru') ? 'en' : 'ru'
      }
    },

    mounted () {
      matrix()
    }
  }
</script>

<style scoped>
  .canvas#matr{
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    margin: auto;
  }

  .matrix{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    z-index: 0;
  }
</style>
