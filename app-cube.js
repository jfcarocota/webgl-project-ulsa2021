//gl context initialize
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl2');

//Shader para posiciones
const vertexShader = `#version 300 es
precision mediump float;

in vec2 position;
in vec3 iColor;
out vec3 oColor;
uniform float iTime;
uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;

void main()
{
  gl_Position = projectionMatrix * modelMatrix * vec4(position, 0, 1);
  oColor = iColor;
}
`;

//shader para color
const fragmentShader = `#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 oColor;

void main()
{
  fragColor = vec4(oColor, 1);
}
`;

//Compiling shaders
const vs = gl.createShader(gl.VERTEX_SHADER);
const fs = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(vs, vertexShader);
gl.shaderSource(fs, fragmentShader);

gl.compileShader(vs);
gl.compileShader(fs);

if(!gl.getShaderParameter(vs, gl.COMPILE_STATUS)){
  console.error(gl.getShaderInfoLog(vs));
}

if(!gl.getShaderParameter(fs, gl.COMPILE_STATUS)){
  console.error(gl.getShaderInfoLog(fs));
}

const program = gl.createProgram();
gl.attachShader(program, vs);
gl.attachShader(program, fs);
gl.linkProgram(program);

if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
  console.error(gl.getProgramInfoLog(program));
}

gl.useProgram(program);

//Drawing basic triangle
const triangleCoords = [
  // Front face
  -1.0, -1.0,  1.0,
  1.0, -1.0,  1.0,
  1.0,  1.0,  1.0,
 -1.0,  1.0,  1.0,

 // Back face
 -1.0, -1.0, -1.0,
 -1.0,  1.0, -1.0,
  1.0,  1.0, -1.0,
  1.0, -1.0, -1.0,

 // Top face
 -1.0,  1.0, -1.0,
 -1.0,  1.0,  1.0,
  1.0,  1.0,  1.0,
  1.0,  1.0, -1.0,

 // Bottom face
 -1.0, -1.0, -1.0,
  1.0, -1.0, -1.0,
  1.0, -1.0,  1.0,
 -1.0, -1.0,  1.0,

 // Right face
  1.0, -1.0, -1.0,
  1.0,  1.0, -1.0,
  1.0,  1.0,  1.0,
  1.0, -1.0,  1.0,

 // Left face
 -1.0, -1.0, -1.0,
 -1.0, -1.0,  1.0,
 -1.0,  1.0,  1.0,
 -1.0,  1.0, -1.0,
];

const vertexColorArray = [
  1.0,  1.0,  1.0,    // Front face: white
  1.0,  0.0,  0.0,    // Back face: red
  0.0,  1.0,  0.0,    // Top face: green
  0.0,  0.0,  1.0,    // Bottom face: blue
  1.0,  1.0,  0.0,    // Right face: yellow
  1.0,  0.0,  1.0,
];

const indexArray = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23,   // left
];

const indexArrayBuffer = gl.createBuffer();
const vertexColorBuffer = gl.createBuffer();
const postionBuffer = gl.createBuffer();

let now = Date.now();

const uniformTime = gl.getUniformLocation(program, 'iTime');
const uModelMatrix = gl.getUniformLocation(program, 'modelMatrix');
const uProjectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');
const attribVertexColor = gl.getAttribLocation(program, 'iColor');
const attribPosition = gl.getAttribLocation(program,'position');

const modelMatrix = mat4.create();
const projectionMatrix = mat4.create();

const fieldOfView = 45 * Math.PI / 180;   // in radians
const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
const zNear = 0.1;
const zFar = 100.0;

const update = ()=> {

  const deltaTime = (Date.now() - now) / 1000;
  now = Date.now();
  //console.log(deltaTime);

  mat4.translate(
    modelMatrix,
    modelMatrix,
    [0.0, 0.0, -6.0]
  );

  mat4.rotate(
    modelMatrix,
    modelMatrix,
    deltaTime * 1,
    [0, 1, 1]
  );

  //clear screen
  gl.clearColor(0, 0, 0, 1);
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(uProjectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  gl.uniform1f(uniformTime, deltaTime);

  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);

  //color
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColorArray), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attribVertexColor);
  gl.vertexAttribPointer(attribVertexColor, 3, gl.FLOAT, gl.FALSE, 0, 0);

  //vertex
  gl.bindBuffer(gl.ARRAY_BUFFER, postionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attribPosition);
  gl.vertexAttribPointer(attribPosition, 2, gl.FLOAT, gl.FALSE, 0, 0);

  //indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexArrayBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);

  gl.drawElements(gl.TRIANGLES, indexArray.length, gl.UNSIGNED_SHORT, 0)
  //gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);