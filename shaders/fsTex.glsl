#version 300 es
precision mediump float;

out vec4 fragColor;
in vec3 oColor;
in vec2 oTexCoords;
uniform sampler2D imgSampler;

void main()
{
  fragColor = vec4(oColor, 1) * texture(imgSampler, oTexCoords);
  //fragColor = vec4(oColor, 1);
}