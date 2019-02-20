precision mediump float;

#define MODE_H	10
#define MODE_S	11
#define MODE_L	12
#define MODE_HS	13
#define MODE_SL	14
#define MODE_HL	15

#define MODE_R	20
#define MODE_G	21
#define MODE_B	22
#define MODE_RG	23
#define MODE_GB	24
#define MODE_BR	25

float hue2rgb(float f1, float f2, float hue) {
	if (hue < 0.0)
		hue += 1.0;
	else if (hue > 1.0)
		hue -= 1.0;
	float res;
	if ((6.0 * hue) < 1.0)
		res = f1 + (f2 - f1) * 6.0 * hue;
	else if ((2.0 * hue) < 1.0)
		res = f2;
	else if ((3.0 * hue) < 2.0)
		res = f1 + (f2 - f1) * ((2.0 / 3.0) - hue) * 6.0;
	else
		res = f1;
	return res;
}

vec3 hsl2rgb(vec3 hsl) {
	vec3 rgb;

	if (hsl.y == 0.0) {
		rgb = vec3(hsl.z); // Luminance
	} else {
		float f2;
		
		if (hsl.z < 0.5)
			f2 = hsl.z * (1.0 + hsl.y);
		else
			f2 = hsl.z + hsl.y - hsl.y * hsl.z;

		float f1 = 2.0 * hsl.z - f2;
		
		rgb.r = hue2rgb(f1, f2, hsl.x + (1.0/3.0));
		rgb.g = hue2rgb(f1, f2, hsl.x);
		rgb.b = hue2rgb(f1, f2, hsl.x - (1.0/3.0));
	}   
	return rgb;
}

vec3 hsl2rgb(float h, float s, float l) {
	return hsl2rgb(vec3(h, s, l));
}

uniform vec2 resolution;
uniform int mode;
uniform vec3 elements;

void main() {
	vec2 uv = gl_FragCoord.xy / resolution;
	vec3 rgb = vec3(1.0, 0.0, 0.0);

	// HSL
	if (mode == MODE_H) {
		rgb = hsl2rgb(uv.y, elements.y / 100.0, elements.z / 100.0);
	} else if (mode == MODE_S) {
		rgb = hsl2rgb(elements.x / 360.0, uv.y, elements.z / 100.0);
	} else if (mode == MODE_L) {
		rgb = hsl2rgb(elements.x / 360.0, elements.y / 100.0, uv.y);
	} else if (mode == MODE_HS) {
		rgb = hsl2rgb(uv.x, uv.y, elements.z / 100.0);
	} else if (mode == MODE_SL) {
		rgb = hsl2rgb(elements.x / 360.0, uv.x, uv.y);
	} else if (mode == MODE_HL) {
		rgb = hsl2rgb(uv.x, elements.y / 100.0, uv.y);
	
	// RGB
	} else if (mode == MODE_R) {
		rgb = vec3(uv.y, elements.y / 255.0, elements.z / 255.0);
	} else if (mode == MODE_G) {
		rgb = vec3(elements.x / 255.0, uv.y, elements.z / 255.0);
	} else if (mode == MODE_B) {
		rgb = vec3(elements.x / 255.0, elements.y / 255.0, uv.y);
	} else if (mode == MODE_RG) {
		rgb = vec3(uv.x, uv.y, elements.z / 255.0);
	} else if (mode == MODE_GB) {
		rgb = vec3(elements.x / 255.0, uv.x, uv.y);
	} else if (mode == MODE_BR) {
		rgb = vec3(uv.y, elements.y / 255.0, uv.x);
	}

	gl_FragColor = vec4(rgb, 1.0);
}