const stories: Record<string, [string, string]> = {
  story: ["Từ một chiếc lá", "Đến một hành trình mới"],
  materials: ["Lá dứa · Tơ sen", "Chạm vào câu chuyện vật liệu"],
  collection: ["Everyday Collection", "Vật liệu bước vào đời sống"],
  business: ["Cùng phát triển", "Từ ý tưởng đến chất liệu"],
  sustainability: ["Nguồn gốc · Vòng đời", "Từng bước hướng đến tuần hoàn"],
  about: ["Từ tự nhiên", "Dệt nên tương lai"],
  contact: ["Cùng kết nối", "Mở đầu một câu chuyện mới"],
  trace: ["Nguồn gốc · Hành trình", "Theo dấu từng sợi dệt"],
};

export function MotionRibbon({ variant }: { variant: string }) {
  const phrases = stories[variant] || stories.materials;
  return (
    <div className={`motion-ribbon motion-ribbon-${variant}`} aria-hidden="true">
      <div className="motion-ribbon-track">
        {[0, 1].map((copy) => <div className="motion-ribbon-group" key={copy}>{[0, 1, 2].map((repeat) => <span className="motion-ribbon-phrase" key={repeat}><span>{phrases[0]}</span><i>✳</i><span>{phrases[1]}</span><i>✳</i></span>)}</div>)}
      </div>
    </div>
  );
}
