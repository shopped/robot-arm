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
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('three');

        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        this.camera.position.z = 3;

        this.scene = new Three.Scene();

        // base
        this.createComponent(0.4, 0.1, 0.4, 0, 0.05, 0);
        // base rotation motor
        this.createComponent(0.2, 0.3, 0.1, 0.1, 0.15, 0, 0, 0.1, 0);
        // shoulder joint
        this.createComponent(0.1, 0.6, 0.2, 0, 0.3, 0, 0, 0.4, 0);
        // elbow joint
        this.createComponent(0.1, 0.6, 0.2, 0, 0.3, 0, 0, 1.0, 0);
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
      this.all[3].rotation.y = parsedV[0];

      this.all[2].rotation.z = parsedV[1];

      // xy adjustments from z axis shoulder rotation
      // xz adjustments from y axis base rotation
      // The third thing is I'm not sure, probably some function of the first two partial derivative bullshit
      this.all[3].position.x = -(0.6)*Math.cos(parsedV[0])*Math.sin(parsedV[1]);
      this.all[3].position.y = 0.3 + (0.6)*Math.cos(parsedV[1]);
      this.all[3].position.z = (0.6)*Math.sin(parsedV[0])*Math.sin(parsedV[1]);

      this.all[3].rotation.z = parsedV[2];
      this.all[3].rotation.z += parsedV[1];
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