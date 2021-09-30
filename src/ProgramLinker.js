class ProgramLinker{
  constructor(gl, vertexShader, fragmentShader){

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const status = gl.LINK_STATUS;

    if(!gl.getProgramParameter(program, status)){
      this.programError(gl, program);
    }

    return program;
  }

  programError(gl, program){

    const error = gl.getProgramInfoLog(program);

    console.error(`Unable to initialize the Program: ${error}`);
    gl.deleteProgram(program);
  }
}

export default ProgramLinker;