"use client";
import { useEffect, useState } from "react";

const Preloader = () => {
  const [active, setActive] = useState(true);
  const [progress, setProgress] = useState(0);

  const colors = {
    brown: "#826740",
    lightBrown: "#B5A388",
    green: "#4CAF50",
    pink: "#FF4081",
  };

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
      if (prevProgress === 100) {
        clearInterval(progressTimer);
        return 100;
      }
      return Math.min(prevProgress + 1, 100);
      });
    }, 1);

    const hideTimer = setTimeout(() => {
      setActive(false);
    }, 1000);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!active) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100px",
          height: "100px",
        }}
      >
        {/* Base circle - thicker border */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid #B5A388",
            borderRadius: "50%",
          }}
        />

        {/* Multiple colored ripple effects */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid",
            borderColor: colors.brown,
            borderRadius: "50%",
            opacity: 0.3,
            animation: "ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid",
            borderColor: colors.green,
            borderRadius: "50%",
            opacity: 0.25,
            animation: "ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
            animationDelay: "0.3s",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            border: "4px solid",
            borderColor: colors.pink,
            borderRadius: "50%",
            opacity: 0.2,
            animation: "ripple 1.5s cubic-bezier(0, 0, 0.2, 1) infinite",
            animationDelay: "0.6s",
          }}
        />

        {/* Content container */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              color: colors.brown,
              fontSize: "10px",
              letterSpacing: "1px",
            }}
          >
            LOADING
          </div>

          {/* Progress bar */}
          <div
            style={{
              width: "40px",
              height: "4px",
              background: "#E9DFD1",
              position: "relative",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: `${progress}%`,
                background:
                  "linear-gradient(to right, #4CAF50, #FF4081, #4CAF50)",
                transition: "width 0.3s ease-out",
              }}
            />
          </div>

          <div
            style={{
              color: colors.brown,
              fontSize: "12px",
              fontWeight: 500,
            }}
          >
            {progress}%
          </div>
        </div>

        {/* Keyframes for ripple animation */}
        <style jsx>{`
          @keyframes ripple {
            0% {
              transform: scale(1);
              opacity: 0.3;
            }
            100% {
              transform: scale(3);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Preloader;
