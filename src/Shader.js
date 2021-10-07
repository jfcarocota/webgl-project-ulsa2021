import ShaderCompiler from './ShaderCompiler.js';
import ProgramLinker from './ProgramLinker.js';

class Shader {

  constructor(gl, vsSource, fsSource){
    
    return this.initShader(gl, vsSource, fsSource);
  }

  loadShader(gl, type, source){
    const shader = gl.createShader(type);

    return new ShaderCompiler(gl, shader, source);
  }

  async initShader(gl, vsSource, fsSource){

    const vs = gl.VERTEX_SHADER;
    const fs = gl.FRAGMENT_SHADER;
    const vsFile = await this.getFile(vsSource);
    const fsFile = await this.getFile(fsSource);
    const vertexShader = this.loadShader(gl, vs, vsFile);
    const fragmentShader = this.loadShader(gl, fs, fsFile);

    return new ProgramLinker(gl, vertexShader, fragmentShader);
  }

  async getFile(filePath) {
    const file = await fetch(filePath).then(res => res.text().then(data => data));
    if(!file){
        console.error(`Warning: Loading of ${filePath} Failed!`);
    }
    return file;
  }
}

export default Shader;