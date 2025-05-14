interface ProjectInfoDetailProps {
  info: string;
  isVisible: boolean;
}

export default function ProjectInfoDetail({ info, isVisible }: ProjectInfoDetailProps) {
  if (!isVisible) return null;

  return (
    <div style={{ position: 'absolute', top: '-100px', left: '-30px', color: "#000" }}>
      {info}
      <p>sasaa</p>
    </div>
  );
}