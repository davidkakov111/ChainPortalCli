import { Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, SimpleChanges } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-three-dviewer',
  templateUrl: './three-dviewer.component.html',
  styleUrl: './three-dviewer.component.scss'
})
export class ThreeDViewerComponent implements OnInit, OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private controls: any;
  private animationFrameId!: number;
  private model: THREE.Object3D | null = null;
  private needAnimation: boolean = true;

  constructor(private el: ElementRef, private renderer2: Renderer2) {}

  @Input() file: File | null = null;

  async ngOnInit(): Promise<void> {
    await this.initScene(); // Initialize the scene when the component is created
    window.addEventListener('resize', () => this.onResize()); // Resize the scene

    // Toggle animation based on mouse enter / leave
    const container = this.el.nativeElement.querySelector('.viewer-container');
    this.renderer2.listen(container, 'mouseenter', () => {
      this.needAnimation = false;
    });
    this.renderer2.listen(container, 'mouseleave', () => {
      this.needAnimation = true;
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationFrameId);
    if (this.renderer) {
      this.renderer.dispose();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['file'] && changes['file'].currentValue) {
      this.loadModel(); // Call loadModel method whenever 'file' changes
    }
  }

  private async initScene(): Promise<void> {
    const container = this.el.nativeElement.querySelector('.viewer-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    container.appendChild(this.renderer.domElement);

    this.camera.position.z = 5;

    // Dynamically import OrbitControls
    // @ts-ignore: This line will ignore the TypeScript error for the import
    const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls');
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;

    // Add basic lighting
    const light = new THREE.AmbientLight(0x404040, 10);
    this.scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 10);
    directionalLight.position.set(1, 1, 1).normalize();
    this.scene.add(directionalLight);

    // Include animation
    this.animate();
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(() => this.animate());
    if (this.model && this.needAnimation) {
      this.model.rotation.x += 0.01;
      this.model.rotation.y += 0.01;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private async loadModel(): Promise<void> {
    if (!this.file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      if (!this.file) return;

      const content = reader.result as ArrayBuffer;
      const extension = this.file.name.split('.').pop()?.toLowerCase();

      if (extension === 'glb') {
        // Dynamically import GLTFLoader only when needed
        // @ts-ignore: This line will ignore the TypeScript error for the import
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader');
        const loader = new GLTFLoader();
        loader.parse(content, '', (gltf: any) => {
          this.updateModel(gltf.scene);
        }, (error: any) => {
          console.error('Error loading GLB model:', error);
        });
      } else if (extension === 'obj') {
        // Dynamically import OBJLoader only when needed
        // @ts-ignore: This line will ignore the TypeScript error for the import
        const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader');
        const loader = new OBJLoader();
        const textContent = new TextDecoder().decode(content); // Convert ArrayBuffer to string
        const object = loader.parse(textContent);
        this.updateModel(object);
      }
    };

    reader.readAsArrayBuffer(this.file);
  }

  private updateModel(newModel: THREE.Object3D): void {
    if (this.model) {
      this.scene.remove(this.model); // Remove previous model
    }
    this.model = newModel;
    this.scene.add(this.model);
  }

  private onResize(): void {
    const container = this.el.nativeElement.querySelector('.viewer-container');
    const width = container.clientWidth;
    const height = container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
}