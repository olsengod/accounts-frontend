<template>
  <v-app>
    <v-layout class="matrix">
      <canvas id="matr"></canvas>
    </v-layout>
    <!-- <div style="z-index: 1">
      <h1 v-if="error.statusCode === 404">Страница не найдена</h1>
      <h1 v-else>Внутренняя ошибка сервера</h1>
      <div>
        {{error}}
        {{error.error}}
        {{error.responses}}
      </div>
      <nuxt-link to="/">Вернуться на главную</nuxt-link>
    </div> -->
    <v-container fluid fill-height align-center justify-center style="z-index: 1">
      <v-layout align-center justify-center column class="main-layout">
        <v-layout align-center justify-center class="card-layout">
          <v-card class="card elevation-12">
            <v-toolbar justify-center align-center style="text-align: center; align-items: center;" class="error">
              <v-toolbar-title>
                <span
                  style="font-weight: 400; font-size: 18pt; color: rgb(255,255,255)"
                  v-if="error.statusCode === 404">{{ $t('errorPage.pageNotFound') }}
                </span>
                <span 
                  style="font-weight: 400; 
                  font-size: 18pt; 
                  color: rgb(63, 28, 49)"
                  v-else>{{ $t('errorPage.internalError') }}
                </span>
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text style="padding-left: 20px; padding-right: 20px; padding-top: 20px">
              <div style="font-weight: 400; font-size: 12pt; color: rgb(63, 28, 49)">
                {{error}}
              </div>
            </v-card-text>
            <v-card-actions style="padding-left: 20px; padding-right: 20px">
              <v-spacer></v-spacer>
              <nuxt-link style="text-decoration: none" to="/">
                <v-btn
                  class="returnBtn"
                  flat 
                  color="rgb(56, 150, 29)" 
                  style="margin-right: 10px; padding: 0; font-size: 9pt">{{ $t('errorPage.returnHome') }}</v-btn>
              </nuxt-link>
            </v-card-actions>
          </v-card>
        </v-layout>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  props: ['error', 'responses']
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