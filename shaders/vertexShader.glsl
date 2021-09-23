#version 300 es
precision mediump float;

in vec3 position;
in vec3 iColor;
out vec3 oColor;
uniform float iTime;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
  gl_Position = projectionMatrix * viewMatrix * (modelMatrix * vec4(position, 1));
  oColor = iColor;
}