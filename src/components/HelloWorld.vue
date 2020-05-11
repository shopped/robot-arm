<template>
  <div class="hello">
		<div v-for="(servo, index) in position" :key="index">
			<p v-if="Object.keys(labels).includes(String(index))">
				{{labels[index]  }} :
				<input type="text" v-model="position[index]">
				<input type="range" min=0 max=180 v-model="position[index]">
			</p>
		</div>
		<button v-on:click="alert('clicked')">Send</button>
<br>
		<button v-on:click="alert('clicked')">Save</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
	data: function() {
		return {
			position: [...new Array(16)].map(() => 0),
			labels: {
				0: "Base Rotation",
				1: "Shoulder",
				2: "Elbow",
				4: "Wrist",
				5: "Wrist Rotation",
				6: "Clamp"
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
