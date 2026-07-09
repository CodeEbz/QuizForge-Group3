export default function Logo({
  width = 180,
  height = "auto",
  className = "",
}) {
  return (
    <img
      src="/assets/Logo.png"
      alt="QuizForge"
      className={className}
      width={width}
      height={height}
      draggable={false}
      style={{
        objectFit: "contain",
        userSelect: "none",
      }}
    />
  );
}