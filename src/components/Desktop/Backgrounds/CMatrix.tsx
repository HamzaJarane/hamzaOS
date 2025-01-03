/*
 written by: Lawrence McDaniel / FullStackWithLawrence and HamzaJarane (Typing)

 This is a refactored implementation of the Matrix Raining Letters effect based on this blog post
 https://dev.to/javascriptacademy/matrix-raining-code-effect-using-javascript-4hep


*/
import React, { useRef, useEffect } from "react";

import "./CMatrix.css";

const renderMatrix = (ref: React.RefObject<HTMLCanvasElement>, color: string) => {
    const canvas = ref.current;
    if(!canvas) return;

    const context = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
    const alfavit  = "ЯШЕРТЫУИОПЮЩЁЪАСДФГЧЙКЛЬЖЗХЦВБНМ";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const alphabet = katakana + alfavit + latin + nums;

    const fontSize = 16;
    const columns = canvas.width / fontSize;

    const rainDrops: number[] = [];

    for (let x = 0; x < columns; x++) {
        rainDrops[x] = 1;
    }

    const render = () => {
        context.fillStyle = "rgba(0, 0, 0, 0.05)"; // black w a tiny bit of alpha
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = color ? color : "#0F0";
        context.font = fontSize + "px monospace";

        for (let i = 0; i < rainDrops.length; i++) {
            // randomize the string of characters to render
            const text = alphabet.charAt(
                Math.floor(Math.random() * alphabet.length)
            );
            context.fillText(text, i * fontSize, rainDrops[i] * fontSize);

            if (
                rainDrops[i] * fontSize > canvas.height &&
                Math.random() > 0.975
            ) {
                rainDrops[i] = 0;
            }
            rainDrops[i]++;
        }
    };
    return render;
};

const CMatrix = ({ color = 'green', classNames }: { color?: string, classNames?: string }) => {
    const ref = useRef<HTMLCanvasElement>(null);
    const thisClassName = "mrl-container " + classNames || '';
    
    useEffect(() => {
        const render = renderMatrix(ref, color);
        const intervalId = setInterval(() => {
            if(typeof render !== 'undefined') render();
        }, 30);
        return () => clearInterval(intervalId);
    }, [color]);

    return ( <canvas className={thisClassName} ref={ref} /> );
};

export default CMatrix;