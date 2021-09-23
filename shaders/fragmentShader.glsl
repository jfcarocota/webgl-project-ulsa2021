#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 oColor;

void main()
{
  fragColor = vec4(oColor, 1);
}