class ShaderCompiler{
  constructor(gl, shader, source){

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const status = gl.COMPILE_STATUS;

    if(!gl.getShaderParameter(shader, status)){
        this.shaderError(gl, shader);
    }

    return shader;
  }

  shaderError(gl, shader){
    const error = gl.getShaderInfoLog(shader);

    console.error(`Unable to initialize the shader program: ${error}`);
    gl.deleteShader(shader);
  }
}

export default ShaderCompiler;