const FireAnimate = () => {
  const particleCount = 50;
  return (
    <div className="fire">
      {Array.from({ length: particleCount }).map((_, index) => (
        <div className="particle" key={index}></div>
      ))}
    </div>
  );
};

export default FireAnimate;