import { useState, useEffect } from "react";

interface typingtext {
  text: string,
}

const TypingText = (props: typingtext) => {
  const [displayedText, setDisplayedText] = useState('');
  const speed = 10

  useEffect(() => {
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      if (currentIndex < props.text.length) {
        setDisplayedText(props.text.slice(0, currentIndex + 1));
        currentIndex += 1;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [props.text, speed]);

  return (
    <p>{displayedText}</p>
  );
};

export default TypingText