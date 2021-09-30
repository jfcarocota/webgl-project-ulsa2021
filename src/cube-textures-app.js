//gl context initialize
const canvas = document.getElementById('gl-canvas');
const gl = canvas.getContext('webgl2');

//Shader para posiciones
const vertexShader = `#version 300 es
precision mediump float;

in vec3 position;
in vec3 iColor;
in vec2 iTextureCoord;
out vec3 oColor;
out vec2 oTextureCoord;
uniform float iTime;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
  gl_Position = projectionMatrix * viewMatrix * (modelMatrix * vec4(position, 1));
  oColor = iColor;
  oTextureCoord = iTextureCoord;
}
`;

//shader para color
const fragmentShader = `#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 oColor;
in vec2 oTextureCoord;
uniform sampler2D uSampler;

void main()
{
  fragColor = texture2D(uSampler, oTextureCoord);
}
`;
//  fragColor = vec4(oColor, 1) * texture2D(uSampler, oTextureCoord);

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

//Cube vertices
const cubeCoords = [
  -1,-1,-1, 1,-1,-1, 1,1,-1, -1,1,-1, //front quad
  -1,-1,1, 1,-1,1, 1,1,1, -1,1,1, //back quad
  -1,-1,-1, -1,-1,1, -1,1,1, -1,1,-1, //left quad
  1,-1,-1, 1,-1,1, 1,1,1, 1,1,-1, //right quad
  -1,-1,-1, 1,-1,-1, 1,-1,1, -1,-1,1, //down quad
  -1,1,-1, 1,1,-1, 1,1,1, -1,1,1 //top quad
];

const vertexColorArray = [
  1,0,0, 1,0,0, 1,0,0, 1,0,0,//front quad color
  0,1,0, 0,1,0, 0,1,0, 0,1,0,//back quad color
  0,0,1, 0,0,1, 0,0,1, 0,0,1,//left quad color
  1,1,0, 1,1,0, 1,1,0, 1,1,0,//right quad color
  0,1,1, 0,1,1, 0,1,1, 0,1,1,//down quad color
  1,0,1, 1,0,1, 1,0,1, 1,0,1//top quad color
];

const indexArray = [
  0,1,2, 0,2,3, //front quad indices
  4,5,6, 4,6,7, //back quad indices
  8,9,10, 8,10,11, //left quad indices
  12,13,14, 12,14,15,
  16,17,18, 16,18,19,
  20,21,22, 20,22,23
];

const textureCoordinates = [
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
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
gl.STATIC_DRAW);

const isPowerOf2 = (value) =>{
  return (value & (value - 1)) == 0;
}

const loadTexture = (gl, url) => {

  const texture = gl.createTexture();

  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Because images have to be download over the internet
  // they might take a moment until they are ready.
  // Until then put a single pixel in the texture so we can
  // use it immediately. When the image has finished downloading
  // we'll update the texture with the contents of the image.
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                width, height, border, srcFormat, srcType,
                pixel);

  const image = new Image();
  image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                  srcFormat, srcType, image);

    // WebGL1 has different requirements for power of 2 images
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
       // Yes, it's a power of 2. Generate mips.
       gl.generateMipmap(gl.TEXTURE_2D);
    } else {
       // No, it's not a power of 2. Turn of mips and set
       // wrapping to clamp to edge
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
       gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
  };
  image.src = url;

  return texture;
}

const texture = loadTexture(gl, 'cubetexture.png');



const indexArrayBuffer = gl.createBuffer();
const vertexColorBuffer = gl.createBuffer();
const postionBuffer = gl.createBuffer();
const textureCoordBuffer = gl.createBuffer();

let now = Date.now();

const uniformTime = gl.getUniformLocation(program, 'iTime');
const uniformSampler = gl.getUniformLocation(program, "uSampler");
const uModelMatrix = gl.getUniformLocation(program, 'modelMatrix');
const uViewMatrix = gl.getUniformLocation(program, 'viewMatrix');
const uProjectionMatrix = gl.getUniformLocation(program, 'projectionMatrix');
const attribVertexColor = gl.getAttribLocation(program, 'iColor');
const attribPosition = gl.getAttribLocation(program,'position');
const textureCoord = gl.getAttribLocation(program, 'iTextureCoord');

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

  gl.activeTexture(gl.TEXTURE0);
  // Bind the texture to texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.uniform1f(uniformTime, deltaTime);

  gl.uniformMatrix4fv(uModelMatrix, false, modelMatrix);
  gl.uniformMatrix4fv(uViewMatrix, false, viewMatrix);
  gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix);
  gl.uniform1i(uniformSampler, 0);

  //color
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColorArray), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attribVertexColor);
  gl.vertexAttribPointer(attribVertexColor, 3, gl.FLOAT, gl.FALSE, 0, 0);

  //vertex
  gl.bindBuffer(gl.ARRAY_BUFFER, postionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeCoords), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(attribPosition);
  gl.vertexAttribPointer(attribPosition, 3, gl.FLOAT, gl.FALSE, 0, 0);

  //indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexArrayBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexArray), gl.STATIC_DRAW);

  //Texture
  gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
  gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, gl.FALSE, 0, 0);
  gl.enableVertexAttribArray(textureCoord);

  gl.drawElements(gl.TRIANGLES, indexArray.length, gl.UNSIGNED_SHORT, 0);
  //gl.drawArrays(gl.TRIANGLES, 0, 6);
  requestAnimationFrame(update);
}

requestAnimationFrame(update);