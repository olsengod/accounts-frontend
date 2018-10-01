<template>
  <div>
    <h1 v-if="error.statusCode === 404">Страница не найдена</h1>
    <h1 v-else>Внутренняя ошибка сервера</h1>
    <div>
      {{error.error}}
      {{error.responses}}
    </div>
    <nuxt-link to="/">Вернуться на главную</nuxt-link>
  </div>
</template>

<script>
export default {
  layout: 'empty',
  props: ['error', 'responses']
}
</script>