import React, { useRef, useEffect, useState } from 'react';
import { RippleButton } from "./multi-type-ripple-buttons.jsx";

// --- Internal Helper --- //
const CheckIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    className={className}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const ShaderCanvas = () => {
  const canvasRef = useRef(null);
  const glProgramRef = useRef(null);
  const glBgColorLocationRef = useRef(null);
  const glRef = useRef(null);
  const [backgroundColor, setBackgroundColor] = useState([0.98, 0.98, 1.0]);

  useEffect(() => {
    const root = document.documentElement;
    const updateColor = () => {
      const isDark = root.classList.contains('dark');
      setBackgroundColor(isDark ? [0.05, 0.05, 0.07] : [0.98, 0.98, 1.0]);
    };
    updateColor();
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') updateColor();
      }
    });
    observer.observe(root, { attributes: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const gl = glRef.current;
    const program = glProgramRef.current;
    const location = glBgColorLocationRef.current;
    if (gl && program && location) {
      gl.useProgram(program);
      gl.uniform3fv(location, new Float32Array(backgroundColor));
    }
  }, [backgroundColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    glRef.current = gl;

    const vs = `attribute vec2 aPosition; void main() { gl_Position = vec4(aPosition, 0.0, 1.0); }`;
    const fs = `
      precision highp float;
      uniform float iTime;
      uniform vec2 iResolution;
      uniform vec3 uBackgroundColor;
      mat2 rotate2d(float a){ float c=cos(a),s=sin(a); return mat2(c,-s,s,c); }
      float variation(vec2 v1,vec2 v2,float strength,float speed){ return sin(dot(normalize(v1),normalize(v2))*strength+iTime*speed)/100.0; }
      vec3 paintCircle(vec2 uv,vec2 center,float rad,float width){
        vec2 diff=center-uv; float len=length(diff);
        len+=variation(diff,vec2(0.,1.),5.,2.);
        len-=variation(diff,vec2(1.,0.),5.,2.);
        float circle=smoothstep(rad-width,rad,len)-smoothstep(rad,rad+width,len);
        return vec3(circle);
      }
      void main(){
        vec2 uv=gl_FragCoord.xy/iResolution.xy;
        uv.x*=1.5; uv.x-=0.25;
        float mask=0.0;
        float radius=.35;
        vec2 center=vec2(.5);
        mask+=paintCircle(uv,center,radius,.035).r;
        mask+=paintCircle(uv,center,radius-.018,.01).r;
        mask+=paintCircle(uv,center,radius+.018,.005).r;
        vec2 v=rotate2d(iTime)*uv;
        vec3 fg=vec3(v.x,v.y,.7-v.y*v.x);
        vec3 color=mix(uBackgroundColor,fg,mask);
        color=mix(color,vec3(1.),paintCircle(uv,center,radius,.003).r);
        gl_FragColor=vec4(color,1.);
      }`;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);
    glProgramRef.current = program;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const iTimeLoc = gl.getUniformLocation(program, 'iTime');
    const iResLoc = gl.getUniformLocation(program, 'iResolution');
    glBgColorLocationRef.current = gl.getUniformLocation(program, 'uBackgroundColor');
    gl.uniform3fv(glBgColorLocationRef.current, new Float32Array(backgroundColor));

    let rafId;
    const render = (time) => {
      gl.uniform1f(iTimeLoc, time * 0.001);
      gl.uniform2f(iResLoc, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      rafId = requestAnimationFrame(render);
    };
    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    onResize();
    window.addEventListener('resize', onResize);
    rafId = requestAnimationFrame(render);
    return () => { window.removeEventListener('resize', onResize); cancelAnimationFrame(rafId); };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full block z-0 pointer-events-none" />;
};

// --- PricingCard --- //
export const PricingCard = ({
  planName, description, price, features, buttonText,
  isPopular = false, buttonVariant = 'primary', onSelect
}) => {
  return (
    <div className={[
      'backdrop-blur-[14px] rounded-2xl shadow-xl flex-1 px-7 py-8 flex flex-col relative',
      'bg-gradient-to-br from-white/60 to-white/20 border border-black/10',
      'dark:from-white/10 dark:to-white/5 dark:border-white/10',
      'transition-all duration-300 hover:-translate-y-1 z-10',
      isPopular ? 'scale-105 ring-2 ring-cyan-400/30 dark:from-white/20 dark:border-cyan-400/30 shadow-2xl' : '',
    ].join(' ')}>
      {isPopular && (
        <div className="absolute -top-4 right-4 px-3 py-1 text-xs font-bold rounded-full bg-cyan-400 text-slate-900 shadow-lg z-20">
          Most Popular
        </div>
      )}
      <div className="mb-3">
        <h2 className="text-4xl font-extralight tracking-tight text-slate-900 dark:text-white">{planName}</h2>
        <p className="text-sm text-slate-600 dark:text-white/70 mt-1">{description}</p>
      </div>
      <div className="my-6 flex items-baseline gap-1">
        <span className="text-5xl font-extralight text-slate-900 dark:text-white">${price}</span>
        <span className="text-sm text-slate-500 dark:text-white/60">/mo</span>
      </div>
      <div className="w-full mb-5 h-px bg-gradient-to-r from-transparent via-slate-300/60 dark:via-white/20 to-transparent"></div>
      <ul className="flex flex-col gap-2.5 text-sm text-slate-700 dark:text-white/85 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2.5">
            <CheckIcon className="text-cyan-500 w-4 h-4 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
      <RippleButton
        className={[
          'mt-auto w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200',
          buttonVariant === 'primary'
            ? 'bg-cyan-400 hover:bg-cyan-300 text-slate-900'
            : 'bg-black/8 hover:bg-black/15 text-slate-800 border border-black/15 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/20',
        ].join(' ')}
        onClick={onSelect}
      >
        {buttonText}
      </RippleButton>
    </div>
  );
};

// --- ModernPricingPage --- //
export const ModernPricingPage = ({
  title,
  subtitle,
  plans,
  showAnimatedBackground = true,
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      {showAnimatedBackground && <ShaderCanvas />}
      <main className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center px-4 py-24">
        <div className="w-full max-w-5xl mx-auto text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extralight leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-cyan-600 to-blue-600 dark:from-white dark:via-cyan-300 dark:to-blue-400">
            {title}
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 dark:text-white/75 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-8 md:gap-5 justify-center items-stretch w-full max-w-5xl">
          {plans.map((plan) => <PricingCard key={plan.planName} {...plan} />)}
        </div>
      </main>
    </div>
  );
};
