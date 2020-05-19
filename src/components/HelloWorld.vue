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
			},
			canvas: {},
			cw: 0,
			ch: 0,
		}
	},
	mounted: function() {
		const canvas1 = document.getElementById('rotation-canvas');
		const canvas2 = document.getElementById('position-canvas');
		const cr = canvas1.getContext('2d');
		const cp = canvas2.getContext('2d');
		this.canvas.rotation = cr;
		this.canvas.position = cp;
		cr.lineWidth = 5;
		cp.lineWidth = 5;
		this.drawRotationGuides(cr);
		this.cw = canvas1.width;
		this.ch = canvas2.height;
	},
	methods: {
		drawRotationGuides: function(cr) {
			cr.clearRect(0, 0, this.cw, this.ch);
			cr.beginPath();
			cr.strokeStyle = "#0000FF"
			cr.moveTo(50, 50);
			cr.lineTo(250, 50);
			cr.stroke();
			cr.beginPath();
			cr.strokeStyle = "#FF0000"
			cr.moveTo(250, 50);
			cr.lineTo(450, 50);
			cr.stroke();
			cr.beginPath();
			cr.strokeStyle = "#00FF00"
			cr.moveTo(250, 50);
			cr.lineTo(250, 250);
			cr.stroke();
		},
		drawRotationInput: function(cr, deg) {
			cr.beginPath();
			cr.strokeStyle = "#000000";
			cr.moveTo(250, 50);
			const x = 250 - 200 * Math.cos(deg * Math.PI / 180);
			const y = 50 + 200 * Math.sin(deg * Math.PI / 180);
			cr.lineTo(x, y)
			cr.stroke();
		}
	},
	watch: {
		position: {
			//deep: true,
			handler: function(val) {
				const cr = this.canvas.rotation;
				this.drawRotationGuides(cr);
				this.drawRotationInput(cr, parseInt(val[0]));
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
.container {
	display: flex;
	flex-direction: column;
}
.row {
	display: flex;
}
</style>
