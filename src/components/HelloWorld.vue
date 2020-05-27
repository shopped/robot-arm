<template>
	<div class="container steelblue">
		<div class="row pink">
			<div class="child">
				<div v-for="(servo, index) in position" :key="index">
					<p v-if="Object.keys(labels).includes(String(index))">
						{{labels[index]  }} :
						<input type="text" v-model.Number="position[index]" style="width: 50px;">
						<input type="range" min=0 max=180 v-model.Number="position[index]">
					</p>
				</div>
				<button v-on:click="send()">Send</button>
				<br>
				<button v-on:click="randomize()">Randomize</button>
				<br>
				<button v-on:click="reset()">Reset</button>
				<br>
				<button v-on:click="saveState()">Save</button>
			</div>
			<div class="child">
				<p>Put ip here</p>
				<input type="text" v-model="ip">
				<p>List of saved configs go here</p>
				<span v-for="(value, name) in this.saved" :key="name">
					<button v-on:click="loadState(value)">{{name}} {{value}}</button>
				</span>
			</div>
			<div class="child">
				<h1>Initial Offset</h1>
				<div v-for="(servo, index) in initialOffset" :key="index+'i'">
					<p v-if="Object.keys(labels).includes(String(index))">
						{{labels[index]  }} :
						<input type="text" v-model.Number="initialOffset[index]" style="width: 50px;">
						<input type="range" min=-360 max=360 v-model.Number="initialOffset[index]">
					</p>
				</div>
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
			<div class="child">
				<Three v-bind:position="animatedPosition"/>
			</div>
		</div>
	</div>
</template>

<script>
const axios = require('axios');
import { gsap } from "gsap";
import Three from './Three.vue';
import Vue from 'vue';

export default {
  name: 'HelloWorld',
  components: {
		Three
  },
	data: function() {
		const tp = {};
		[...new Array(16)].map((v, i) => tp[i] = 0);
		return {
			position: [...new Array(6)].map(() => 0),
			initialOffset: [...new Array(6)].map(() => 0),
			saved: {
				straight: [0,0,0,0,0,0],
				halfway: [90,90,90,90,90,90],
				flexed: [180,180,180,180,180,180]
			},
			tweenedPosition: tp,
			labels: {
				0: "Base Rotation",
				1: "Shoulder",
				2: "Elbow",
				3: "Wrist",
				4: "Wrist Rotation",
				5: "Clamp"
			},
			canvas: {},
			cw: 0,
			ch: 0,
			ip: 'http://192.168.1.123:5000',
			trash: null
		}
	},
	computed: {
		animatedPosition: function() {
			const one = Object.values(this.tweenedPosition).slice(0,16);
			const two = one.map(n => n.toFixed(0));
			return two;
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
		saveState: function() {
			const key = "new";
			let counter = 1;
			while (Object.keys(this.saved).includes(key+counter)) {
				counter++;
			}
			Vue.set(this.saved, key+counter, this.position.slice(0,6));
		},
		loadState: function(value) {
			const newPosition = [];
			for (let i=0;i<6; i++) {
				newPosition.push(value[i]);
			}
			this.position = newPosition;
		},
		reset: function() {
			this.position = [...new Array(16)].map(() => 0);
		},
		send: function() {
			axios.post(this.ip, this.position);
		},
		randomize: function() {
			const newArray = [];
			for (let i=0;i<this.position.length;i++) {
				newArray[i] = Math.floor(Math.random()*181);
			}
			this.position = newArray;
		},
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
		},
		drawPositionInput: function(cp, a, b, c, d, e) {
			cp.clearRect(0, 0, this.cw, this.ch);
			let prevx = 250;
			let prevy = 250;
			cp.beginPath();
			cp.strokeStyle = "#FFFF00";
			const originSize = 6;
			cp.arc(prevx, prevy, originSize, 0, 2*Math.PI);
			cp.stroke();
			cp.strokeStyle = "#000000";
			const arm = [a, b, c]
			for (const index of [1, 2, 3]) {
				const deg = arm.slice(0, index).reduce((p, c) => p + c)
				cp.beginPath();
				cp.moveTo(prevx, 500 - prevy);
				prevx -= 70 * Math.cos(deg * Math.PI / 180);
				prevy += 70 * Math.sin(deg * Math.PI / 180);
				cp.lineTo(prevx, 500 - prevy);
				cp.stroke();
			}
			this.trash = d + e;
		}
	},
	watch: {
		position: {
			handler: function(vals) {
				for (let i=0;i<vals.length;i++) {
					gsap.to(this.$data.tweenedPosition, { duration: 0.5, [i]: parseInt(vals[i]) + parseInt(this.initialOffset[i]) })
				}
			}
		},
		initialOffset: {
			handler: function(vals) {
				for (let i=0;i<vals.length;i++) {
					gsap.to(this.$data.tweenedPosition, { duration: 0.5, [i]: parseInt(vals[i]) + parseInt(this.position[i]) })
				}
			}
		},
		animatedPosition: {
			handler: function(val) {
				const cr = this.canvas.rotation;
				const cp = this.canvas.position;
				this.drawRotationGuides(cr);
				this.drawRotationInput(cr, parseInt(val[0]));
				this.drawPositionInput(cp ,parseInt(val[1]), parseInt(val[2]), parseInt(val[3]), parseInt(val[4]), parseInt(val[5]))
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	flex: 1;
}
.pink {
	background-color: pink;
}
.steelblue {
	background-color: steelblue;
}
.row {
	display: flex;
	flex: 1;
	flex-direction: row;
	width:100%;
	height:50%;
}
.child {
	display: flex;
	flex-direction: column;
	flex: 1;
	height:100%;
	width:30%;
}
</style>
