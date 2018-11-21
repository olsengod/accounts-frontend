<template>
	<v-layout align-center justify-center>
	  <img class="spinner" src="cereris-logo.png" height="40">
	</v-layout>
</template>

<style scoped>
	.spinner {
		position: absolute;
    top: 50%;
    left: 50%;
    width: 120px;
    height: 120px;
    margin:-60px 0 0 -60px;
    -webkit-animation: turn 3s infinite;
    animation: turn 3s infinite;
	}
	@-webkit-keyframes turn {
    to {
      -webkit-transform: rotateY(360deg);
    }
  }
  @keyframes turn {
    to {
      transform: rotateY(360deg);
    }
  }
</style>