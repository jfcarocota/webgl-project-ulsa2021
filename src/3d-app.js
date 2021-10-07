import Shader from "./Shader.js";
import Texture from "./Texture.js";

//gl context initialize
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl2');

const program = await new Shader(gl, "../shaders/vsTex.glsl", "../shaders/fsTex.glsl");
gl.useProgram(program);

let now = Date.now();

const programInfo = {
  uniforms: {
    time: gl.getUniformLocation(program, 'iTime'),
    matrices: {
      modelMatrix: gl.getUniformLocation(program, 'modelMatrix'),
      viewMatrix: gl.getUniformLocation(program, 'viewMatrix'),
      projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix'),
    },
    sampler: gl.getUniformLocation(program, 'imgSampler')
  },
  attributes: {
    vertexColor: gl.getAttribLocation(program, 'iColor'),
    position: gl.getAttribLocation(program,'position'),
    texCoords: gl.getAttribLocation(program, 'iTexCoords')
  },
  geometryInfo:{
    cubeCoords: [
      -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, //front quad
      -1,-1,1, 1,-1,1, 1,1,1, -1,1,1, //back quad
      -1,-1,-1, -1,-1,1, -1,1,1, -1,1,-1, //left quad
      1,-1,-1, 1,-1,1, 1,1,1, 1,1,-1, //right quad
      -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,1, //down quad
      -1,1,-1, 1,1,-1, 1,1,1, -1,1,1 //top quad
    ],
    vertexColorArray: [
      1,0,0, 1,0,0, 1,0,0, 1,0,0,//front quad color
      0,1,0, 0,1,0, 0,1,0, 0,1,0,//back quad color
      0,0,1, 0,0,1, 0,0,1, 0,0,1,//left quad color
      1,1,0, 1,1,0, 1,1,0, 1,1,0,//right quad color
      0,1,1, 0,1,1, 0,1,1, 0,1,1,//down quad color
      1,0,1, 1,0,1, 1,0,1, 1,0,1//top quad color
    ],
    indexArray: [
      0,1,2, 0,2,3, //front quad indices
      4,5,6, 4,6,7, //back quad indices
      8,9,10, 8,10,11, //left quad indices
      12,13,14, 12,14,15,
      16,17,18, 16,18,19,
      20,21,22, 20,22,23
    ],
    texCoordsArray: [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
    ]
  },
  buffers: {
    indexArrayBuffer: gl.createBuffer(),
    vertexColorBuffer: gl.createBuffer(),
    postionBuffer: gl.createBuffer(),
    texBuffer: gl.createBuffer()
  },
  textures: [
    new Texture(gl, "textures/cubetexture.png")
  ]
};

const modelMatrix = mat4.create();
const viewMatrix = mat4.create();
const projectionMatrix = mat4.create();

mat4.scale(
  viewMatrix,
  viewMatrix,
  [1, 1, 1]
);

mat4.translate(
  viewMatrix,
  viewMatrix,
  [0, 0, -10]
);

const update = ()=> {

  const deltaTime = (Date.now() - now) / 1000;
  now = Date.now();
  //console.log(deltaTime);

  mat4.rotate(
    modelMatrix,
    modelMatrix,
    deltaTime * 1,
    [1, 1, 0]
  );

  //clear screen
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  /*mat4.translate(
    modelMatrix,
    modelMatrix,
    [0, 0, 0]
  );*/

  /*mat4.translate(
    viewMatrix,
    viewMatrix,
    [0, 0, -10]
  );*/

  mat4.perspective(
    projectionMatrix,
    45 * (Math.PI / 180),
    canvas.clientWidth / canvas.clientHeight,
    1,
    1000
  );

  gl.uniform1f(programInfo.uniforms.time, deltaTime);

  gl.uniformMatrix4fv(programInfo.uniforms.matrices.modelMatrix, false, modelMatrix);
  gl.uniformMatrix4fv(programInfo.uniforms.matrices.viewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(programInfo.uniforms.matrices.projectionMatrix, false, projectionMatrix);

  //color
  gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers.vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(programInfo.geometryInfo.vertexColorArray), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(programInfo.attributes.vertexColor);
  gl.vertexAttribPointer(programInfo.attributes.vertexColor, 3, gl.FLOAT, gl.FALSE, 0, 0);

  //vertex
  gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers.postionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(programInfo.geometryInfo.cubeCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(programInfo.attributes.position);
  gl.vertexAttribPointer(programInfo.attributes.position, 3, gl.FLOAT, gl.FALSE, 0, 0);

  //Load Texture
  gl.bindBuffer(gl.ARRAY_BUFFER, programInfo.buffers.texBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(programInfo.geometryInfo.texCoordsArray), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(programInfo.attributes.texCoords);
  gl.vertexAttribPointer(programInfo.attributes.texCoords, 2, gl.FLOAT, gl.FALSE, 0, 0);

  //indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, programInfo.buffers.indexArrayBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(programInfo.geometryInfo.indexArray), gl.STATIC_DRAW);

  //Using texture loaded
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, programInfo.textures[0]);
  gl.uniform1i(programInfo.uniforms.sampler, 0);

  gl.drawElements(gl.TRIANGLES, programInfo.geometryInfo.indexArray.length, gl.UNSIGNED_SHORT, 0);
  //gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);