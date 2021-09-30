import ShaderCompiler from './ShaderCompiler.js';
import ProgramLinker from './ProgramLinker.js';

class Shader {

  constructor(gl, vertexShader, fragmentShader){
    const vs = gl.VERTEX_SHADER;
    const fs = gl.FRAGMENT_SHADER;

    const vsFile = await this.getFile(vsSource);
    const fsFile = await this.getFile(fsSource);

    const vertexShader = this.loadShader(gl, vs, vsFile);
    const fragmentShader = this.loadShader(gl, fs, fsFile);

    return new ProgramLinker(gl, vertexShader, fragmentShader);
  }

  loadShader(gl, type, source){
    const shader = gl.createShader(type);

    return new ShaderCompiler(gl, shader, source);
  }

  async getFile(filePath) {
    return await (await fetch(filePath)).then(result => {
      if(!restul){
        console.error(`Warning: Loading of ${filePath} Failed!`);
      }
      return result;
    });
  }
}

export default Shader;