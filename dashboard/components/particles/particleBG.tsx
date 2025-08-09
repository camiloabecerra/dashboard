"use client";

import { useEffect } from "react";
import particleConfig from "./config";

export default function ParticleBG() {
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
      script.async = true;
      script.onload = () => {
        if (window.particlesJS) {
          window.particlesJS("particles-js", particleConfig); 
        }
      };
      document.body.appendChild(script);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-gradient-to-br from-[#5c9ead] to-[#ffffff]" id="particles-js"></div>
    );
}
