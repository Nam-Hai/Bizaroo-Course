import Media from './Media'
import { N } from '../../utils/namhai'
import { Plane, Transform } from 'ogl'

export default class {
  constructor({ gl, scene }) {
    this.scene = scene
    this.group = new Transform()
    this.gl = gl
    this.medias = N.get('.home__gallery__media img')

    console.log('mediads,', this.medias);

    this.createGeometry()
    this.createGalery()


    this.group.setParent(scene)
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGalery() {
    this.galery = Object.entries(this.medias).map(([index, element]) => new Media({ element, geometry: this.geometry, gl: this.gl, index, scene: this.scene }))
    console.log(this.galery);
  }

}
