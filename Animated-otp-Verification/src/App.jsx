import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const App = () => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];
  const [status, setStatus] = useState('idle');
  const [showVerifiedText, setShowVerifiedText] = useState(false);

  useEffect(() => {
    const isComplete = otp.every(digit => digit !== '');
    if (isComplete) {
      inputRefs.forEach(ref => {
        if (ref.current) ref.current.blur();
      });
      setStatus('success');

      const textTimer = setTimeout(() => {
        setShowVerifiedText(true);
      }, 1500);

      return () => clearTimeout(textTimer);
    } else {
      setStatus('idle');
      setShowVerifiedText(false);
    }
  }, [otp]);

  const handleChange = (index, e) => {
    if (status !== 'idle') return;
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (status !== 'idle') return;
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    if (status !== 'idle') return;
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 4).split('');
    if (pastedData.some(char => isNaN(char))) return;

    const newOtp = [...otp];
    pastedData.forEach((char, index) => {
      newOtp[index] = char;
    });
    setOtp(newOtp);

    const nextEmptyIndex = pastedData.length < 4 ? pastedData.length : 3;
    if (inputRefs[nextEmptyIndex].current) {
      inputRefs[nextEmptyIndex].current.focus();
    }
  };

  const boxVariants = {
    idle: {
      x: 0,
      rotate: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    success: (i) => {
      const offsets = [120, 40, -40, -120];
      const rotations = [0, -8, 8, -12]; 
      const delay = 1.0; 
      
      if (i === 0) {
        return {
          x: [0, 120, 120], 
          rotate: [0, 12, 0], 
          scale: [1, 0.95, 1.15, 1], 
          zIndex: 4,
          transition: {
            duration: 0.9,
            times: [0, 0.5, 0.7, 1], 
            delay: delay,
            ease: [0.25, 1, 0.5, 1] 
          }
        };
      }
      return {
        x: offsets[i],
        rotate: rotations[i], 
        scale: [1, 0.85, 0], 
        opacity: [1, 1, 0], 
        zIndex: 3 - i,
        transition: {
          duration: 0.6,
          times: [0, 0.8, 1],
          delay: delay,
          ease: "easeInOut"
        }
      };
    }
  };

  const textVariants = {
    idle: { color: "#ffffff" },
    success: { 
      color: "rgba(255, 255, 255, 0)", 
      transition: { delay: 1.0, duration: 0.2 } 
    }
  };

  const tickContainerVariants = {
    idle: { opacity: 0, scale: 0.5, x: "-50%", y: "-50%" },
    success: { 
      opacity: 1, 
      scale: 1,
      x: "-50%", 
      y: "-50%",
      transition: { 
        delay: 1.45, 
        duration: 0.5, 
        type: "spring", 
        stiffness: 250,
        damping: 20
      }
    }
  };

  const tickPathVariants = {
    idle: { pathLength: 0 },
    success: { 
      pathLength: 1,
      transition: { delay: 1.5, duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <div className="app-wrapper">
      <div className={`otp-container ${status === 'success' ? 'is-complete' : ''}`}>
        <div className="drag-handle"></div>
        <div className="otp-header">
          <AnimatePresence mode="wait">
            <motion.div
              key={showVerifiedText ? 'verified' : 'unverified'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h1>{showVerifiedText ? 'Verified successfully' : "Let's verify your number"}</h1>
              <p>
                {showVerifiedText ? 'Your phone number has been verified.' : "We've sent a 4-digit code to your phone.\nIt'll auto-verify once entered."}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="otp-inputs" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <motion.div 
              key={index} 
              className="input-wrapper"
              custom={index}
              variants={boxVariants}
              initial="idle"
              animate={status}
            >
              <motion.input
                type="text"
                inputMode="numeric"
                maxLength={1}
                ref={inputRefs[index]}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="otp-input"
                readOnly={status !== 'idle'}
                variants={textVariants}
                initial="idle"
                animate={status}
              />

              {index === 0 && (
                <motion.svg 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  className="final-tick"
                  variants={tickContainerVariants}
                  initial="idle"
                  animate={status}
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="#ffffff"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    variants={tickPathVariants}
                  />
                </motion.svg>
              )}
            </motion.div>
          ))}
        </div>

        <div className="otp-footer">
          Didn't receive the code? <button type="button">Resend</button>
        </div>
      </div>
    </div>
  );
};

export default App;