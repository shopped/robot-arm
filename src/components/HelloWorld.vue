<template>
	<div class="container">
		<div class="row">
			<div class="child">
				<div v-for="(servo, index) in position" :key="index">
					<p v-if="Object.keys(labels).includes(String(index))">
						{{labels[index]  }} :
						<input type="text" v-model="position[index]">
						<input type="range" min=0 max=180 v-model="position[index]">
					</p>
				</div>
				<button v-on:click="console.log('clicked')">Send</button>
				<br>
				<button v-on:click="console.log('clicked')">Save</button>
			</div>
			<div class="child">
				<p>List of saved configs go here</p>
			</div>
		</div>
		<div class="row">
			<div class="child">
				<h1>Rotation Canvas</h1>
				<canvas id="rotation-canvas" width="500px" height="500px"></canvas>
			</div>
			<div class="child">
				<h1>Position Canvas</h1>
					<canvas id="position-canvas" width="500px" height="500px"></canvas>
			</div>
		</div>
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
	},
	mounted: function() {
		const canvas1 = document.getElementById('rotation-canvas');
		const canvas2 = document.getElementById('position-canvas');
		const c1 = canvas1.getContext('2d');
		const c2 = canvas2.getContext('2d');
		c1.beginPath();
		c1.moveTo(100, 100);
		c1.lineTo(200, 200);
		c1.lineWidth = 5;
		c1.stroke();
		console.log(c2);
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
.container {
	display: flex;
	flex-direction: column;
}
.row {
	display: flex;
}
</style>
