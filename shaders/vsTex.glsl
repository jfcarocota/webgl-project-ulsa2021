#version 300 es
precision mediump float;

in vec3 position;
in vec2 iTexCoords;
in vec3 iColor;
out vec3 oColor;
out vec2 oTexCoords;
uniform float iTime;
uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main()
{
  gl_Position = projectionMatrix * viewMatrix * (modelMatrix * vec4(position, 1));
  oColor = iColor;
  oTexCoords = vec2(iTexCoords.s, 1.0 - iTexCoords.t);
}