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
      parentGroup: null,
      all: [],
    }
  },
  methods: {
    init: function() {
        let container = document.getElementById('three');

        this.camera = new Three.PerspectiveCamera(70, container.clientWidth/container.clientHeight, 0.01, 10);
        this.camera.position.z = 3;

        this.scene = new Three.Scene();

        this.createComponent(0.4, 0.1, 0.4);//base
        this.createComponent(0.2, 0.3, 0.1, 0.1, 0.15, 0, 0,0,0);//base-rotator
        this.createComponent(0.1, 0.6, 0.2, 0, 0.3, 0, 0,0.3,0);//shoulder
        this.createComponent(0.1, 0.6, 0.2, 0, 0.3, 0, 0,0.6,0);//elbow
        this.createComponent(0.1, 0.3, 0.2, 0, 0.15, 0, 0,0.6,0);//wrist
        this.createComponent(0.1, 0.1, 0.1, 0, 0.05, 0, 0, 0.3, 0);//rotator
        // wrist rotation motor and
        // clamp
        const left = this.createMesh(0.05, 0.3, 0.1, 0.05, 0.15, 0, 0,0,0);
        const right = this.createMesh(0.05, 0.3, 0.1, -0.05, 0.15, 0, 0,0,0);

        this.parentGroup.add(left);
        this.parentGroup.add(right);

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
      if (!this.parentGroup) {
        this.parentGroup = mesh;
        this.scene.add(mesh);
      } else {
        this.parentGroup.add(mesh);
        this.parentGroup = mesh;
      }
    },
    createMesh: function(w=1, h=1, l=1, x=0, y=0, z=0, ox=0, oy=0, oz=0) {
      const geometry = new Three.BoxGeometry(w, h, l);
      const material = new Three.MeshNormalMaterial();
      const mesh = new Three.Mesh(geometry, material);

      geometry.translate(x, y, z);
      
      mesh.position.x = ox
      mesh.position.y = oy;
      mesh.position.z = oz;
      this.all.push(mesh);
      return mesh;
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
      this.all[2].rotation.z = parsedV[1];
      this.all[3].rotation.z = parsedV[2];
      this.all[4].rotation.z = parsedV[3];
      this.all[5].rotation.y = parsedV[4];

      if (parsedV[5] > Math.PI/4) parsedV[5] = Math.PI/4
      this.all[6].rotation.z = -parsedV[5];
      this.all[7].rotation.z = parsedV[5]; 
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