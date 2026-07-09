import logo from "../assets/Logo.png";

export default function Logo({
  width = 180,
  height = "auto",
  className = "",
}) {
  return (
    <img
      src={logo}
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