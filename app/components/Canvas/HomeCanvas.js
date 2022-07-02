import Media from './Media'
import { N } from '../../utils/namhai'
import { Plane, Transform } from 'ogl'

export default class {
  constructor({ gl, scene, sizes, screenAspectRatio }) {
    this.sizes = sizes
    this.scene = scene
    this.group = new Transform()
    this.gl = gl
    this.mediasElement = N.get('.home__gallery__media img')

    console.log('mediads,', this.mediasElement);

    this.createGeometry()
    this.createGalery()


    this.group.setParent(scene)
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGalery() {
    this.medias = Object.entries(this.mediasElement).map(([index, element]) =>
      new Media({
        element,
        geometry: this.geometry,
        gl: this.gl,
        index,
        scene: this.scene,
        sizes: this.sizes,
        screenAspectRatio: this.screenAspectRatio
      })
    )
    console.log(this.galery);
  }

  onResize(event) {
    Object.values(this.medias).map(media => media.onResize(event))
  }
}
