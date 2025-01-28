import React, { useState, useEffect } from "react";

const TypingAnimation = ({ staticText, messages }) => {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loop, setLoop] = useState(0);

  useEffect(() => {
    const currentMessage = messages[loop % messages.length];

    if (!isDeleting && text.length < currentMessage.length) {
      setTimeout(() => setText(currentMessage.slice(0, text.length + 1)), 100);
    } else if (isDeleting && text.length > 0) {
      setTimeout(() => setText(currentMessage.slice(0, text.length - 1)), 50);
    } else if (!isDeleting && text.length === currentMessage.length) {
      setTimeout(() => setIsDeleting(true), 1000); // Pausa antes de borrar
    } else if (isDeleting && text.length === 0) {
      setIsDeleting(false);
      setLoop(loop + 1);
    }
  }, [text, isDeleting, messages, loop]);

  return (
    <div className="flex bg-transparent">
      <h1 className="text-6xl font-bold text-gray-800 relative">
        <span>{staticText}</span>{" "}
        <span className="relative">
          {text}
          <span className="blink">|</span>
        </span>
      </h1>
    </div>
  );
};

export default TypingAnimation;