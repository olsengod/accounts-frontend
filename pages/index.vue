<template>
  <div>
    INDEX
  </div>
</template>

<script>
	import { mapState } from 'vuex'
export default {
  layout: 'default',
  middleware: ['autologin', 'authenticated'],
  created () {
    console.log(this.user.state)
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>
