<template>
    <div id="three"></div>
</template>

<script>
import * as Three from 'three';
import { OrbitControls } from './OrbitControls.js'

export default {
  name: 'ThreeTest',
  props: ["position"],
  data() {
    return {
      camera: null,
      scene: null,
      renderer: null,
      controls: null,
      origin: {x: 0, y: 0, z: 0},
      all: [],
      counter: 0
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('three');

        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        this.camera.position.z = 1;

        this.scene = new Three.Scene();

        // base
        this.createComponent(0.4, 0.1, 0.4, 0, 0.05, 0);
        // base rotation motor
        this.createComponent(0.2, 0.3, 0.1, 0.1, 0.15, 0, 0, 0.1, 0);
        // shoulder joint
        this.createComponent(0.1, 0.6, 0.2, 0, 0.3, 0, 0, 0.4, 0);
        // this.all[0].position.x += 1000;
        // this.all[1].position.x += 1000;
        // elbow joint
        // wrist joint
        // wrist rotation motor
        // clamp

        this.renderer = new Three.WebGLRenderer({antialias: true});
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.update();
        container.appendChild(this.renderer.domElement);

    },
    createComponent: function(w=1, h=1, l=1, x=0, y=0, z=0, ox=0, oy=0, oz=0) {
      const geometry = new Three.BoxGeometry(w, h, l);
      const material = new Three.MeshNormalMaterial();
      const mesh = new Three.Mesh(geometry, material);

      geometry.translate(x, y, z);
      
      mesh.position.x = ox
      mesh.position.y = oy;
      mesh.position.z = oz;

      this.all.push(mesh);
      this.scene.add(mesh);
    },
    animate: function() {
        requestAnimationFrame(this.animate);
        this.counter++;
        if (this.counter >= 300) {
          this.counter = 0;
        }
        if (Math.floor(this.counter / 100) === 0) {
          this.all[2].rotation.x += 2*Math.PI/100;
          this.all[2].rotation.y = 0;
          this.all[2].rotation.z = 0;
        } else if (Math.floor(this.counter / 100) === 1) {
          this.all[2].rotation.x = 0;
          this.all[2].rotation.y += 2*Math.PI/100;
          this.all[2].rotation.z = 0;
        } else {
          this.all[2].rotation.x = 0;
          this.all[2].rotation.y = 0;
          this.all[2].rotation.z += 2*Math.PI/100;
        }
        this.renderer.render(this.scene, this.camera);
    }
  },
  mounted() {
      this.init();
      this.animate();
  },
  watch: {
    position: function(v) {
      const parsedV = v.map(i => parseInt(i)/180*Math.PI)
      this.all[1].rotation.y = parsedV[0];
      this.all[2].rotation.y = parsedV[0];
      this.all[2].rotation.z = parsedV[1];
    }
  }
}
</script>

<style scoped>
    #three {
      width: 100%;
      height: 100%;
    }
</style>