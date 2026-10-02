export const navigation = [
  ["Câu chuyện", "/story"],
  ["Vật liệu", "/materials"],
  ["Bộ sưu tập", "/collection"],
  ["Truy xuất", "/trace"],
  ["Đối tác", "/business"],
  ["Về SenPine", "/about"],
] as const;

export const navigationEn = [
  ["Our Story", "/story"],
  ["Materials", "/materials"],
  ["Collection", "/collection"],
  ["Traceability", "/trace"],
  ["For Business", "/business"],
  ["About SenPine", "/about"],
] as const;

export interface MaterialSpec {
  composition: string;
  weightGsm: string;
  widthCm: string;
  tensileStrength: string;
  handFeel: string;
  moq: string;
  applications: string;
  ecoAttribute: string;
}

export interface MaterialItem {
  id: string;
  name: string;
  number: string;
  origin: string;
  originEn: string;
  description: string;
  descriptionEn: string;
  price: number;
  position: string;
  code: string;
  detail: string;
  detailEn: string;
  specs: {
    vi: MaterialSpec;
    en: MaterialSpec;
  };
}

export const materials: MaterialItem[] = [
  {
    id: "pinefiber",
    name: "PineFiber",
    number: "01",
    origin: "SỢI LÁ DỨA",
    originEn: "PINEAPPLE LEAF FIBER",
    description: "Một khởi đầu mới cho lá dứa sau thu hoạch. Dòng vật liệu chủ lực trong kế hoạch SenPine với khả năng mở rộng sản lượng cao.",
    descriptionEn: "A regenerative new dawn for post-harvest pineapple leaves. SenPine's flagship circular bio-fabric engineered for industrial scalability.",
    price: 500000,
    position: "0%",
    code: "SP-PF-001",
    detail: "Định hướng phát triển vải từ 100% sợi lá dứa cho ứng dụng thời trang, phụ kiện và hợp tác sản xuất B2B. Cấu trúc sợi thô mộc, thoáng mát, bền kéo cao và tự phân hủy sinh học.",
    detailEn: "Developed from 100% extracted pineapple leaf fiber for commercial apparel, lifestyle accessories, and B2B textile manufacturing. High tensile durability and natural biodegradability.",
    specs: {
      vi: {
        composition: "100% Sợi lá dứa nông nghiệp",
        weightGsm: "180 - 220 GSM",
        widthCm: "145 cm (khổ tiêu chuẩn)",
        tensileStrength: "> 450 N (Độ bền đứt cao)",
        handFeel: "Mộc mạc, cấu trúc linen tự nhiên, thoáng khí",
        moq: "50 mét (Đơn hàng thử nghiệm B2B)",
        applications: "Áo sơ mi, túi canvas sinh thái, nón, giày vải, đồng phục",
        ecoAttribute: "100% Nguồn phụ phẩm nông nghiệp Đồng bằng sông Cửu Long",
      },
      en: {
        composition: "100% Circular Pineapple Leaf Fiber",
        weightGsm: "180 - 220 GSM",
        widthCm: "145 cm (Standard bolt width)",
        tensileStrength: "> 450 N (Superior tensile rating)",
        handFeel: "Artisanal linen-like texture, breathable, crisp",
        moq: "50 meters (Pilot sample orders)",
        applications: "Shirts, eco-tote bags, hats, casual tailoring, sneakers",
        ecoAttribute: "100% Agricultural biomass upcycled from Mekong Delta",
      },
    },
  },
  {
    id: "blend",
    name: "SenPine Blend",
    number: "02",
    origin: "LÁ DỨA × TƠ SEN",
    originEn: "PINEAPPLE × LOTUS SILK",
    description: "Kết nối hai nguồn nguyên liệu bản địa. Một hướng nghiên cứu giữa tính ứng dụng bền chắc và sự xốp nhẹ tinh tế.",
    descriptionEn: "Synergizing two indigenous botanicals. An exquisite balance between pineapple durability and lotus silk softness.",
    price: 2000000,
    position: "50%",
    code: "SP-SB-001",
    detail: "Tỷ lệ phối trộn tiêu chuẩn: khoảng 95% sợi lá dứa và 5% tơ sen. Đem lại độ bóng nhẹ, bề mặt êm dịu hơn trên da, khả năng kháng khuẩn tự nhiên từ dịch chiết tơ sen.",
    detailEn: "Standard formulation: 95% circular pineapple fiber and 5% lotus stem silk. Imparts a subtle luster, delicate hand-feel, and intrinsic botanical antibacterial properties.",
    specs: {
      vi: {
        composition: "95% Sợi lá dứa + 5% Tơ sen tự nhiên",
        weightGsm: "140 - 160 GSM",
        widthCm: "140 cm",
        tensileStrength: "> 380 N",
        handFeel: "Mềm mịn, bóng nhẹ, êm ái trên da, kháng khuẩn",
        moq: "30 mét (Bộ sưu tập thời trang B2B)",
        applications: "Váy đầm cao cấp, áo sơ mi sang trọng, khăn choàng, phụ kiện",
        ecoAttribute: "Quy trình dệt khép kín, thân thiện sinh thái",
      },
      en: {
        composition: "95% Pineapple Leaf Fiber + 5% Lotus Silk",
        weightGsm: "140 - 160 GSM",
        widthCm: "140 cm",
        tensileStrength: "> 380 N",
        handFeel: "Silky soft, subtle luster, gentle drape, antimicrobial",
        moq: "30 meters (Designer capsule collection)",
        applications: "Luxury dresses, fine shirts, flowing scarves, premium linings",
        ecoAttribute: "Closed-loop mechanical extraction, zero microplastics",
      },
    },
  },
  {
    id: "sensilk",
    name: "SenSilk",
    number: "03",
    origin: "TƠ SEN",
    originEn: "PURE LOTUS SILK",
    description: "Dành cho những thiết kế dạ hội và giới hạn. Trân trọng nguồn nguyên liệu quý hiếm và kỹ nghệ rút tơ sen thủ công đỉnh cao.",
    descriptionEn: "Reserved for haute couture and limited collector pieces. Celebrating precious botanical rarity and master manual extraction.",
    price: 15000000,
    position: "100%",
    code: "SP-SS-001",
    detail: "Tơ sen được định hướng khai thác tỉ mỉ từ cuống sen tươi (~50.000 cọng sen cho 1kg tơ). Sợi siêu nhẹ, thoáng khí tối đa, mát mẻ vào mùa hạ và ấm áp vào mùa đông.",
    detailEn: "Artisanally extracted from fresh lotus stems (~50,000 stems yield 1kg of fiber). Featherweight, natural thermoregulating, subtle botanical fragrance.",
    specs: {
      vi: {
        composition: "100% Tơ sen khai thác thủ công",
        weightGsm: "80 - 110 GSM",
        widthCm: "120 cm (Khổ lụa quý)",
        tensileStrength: "> 290 N (Độ đàn hồi tự nhiên)",
        handFeel: "Siêu nhẹ, bồng bềnh sang trọng, hương sen dịu nhẹ",
        moq: "5 mét (Dự án đặt hàng bespoke/couture)",
        applications: "Khăn dạ hội, áo dài truyền thống cao cấp, trang phục sưu tầm",
        ecoAttribute: "Di sản thủ công làng nghề & nông nghiệp sen Việt",
      },
      en: {
        composition: "100% Hand-harvested Lotus Stem Silk",
        weightGsm: "80 - 110 GSM",
        widthCm: "120 cm (Artisanal luxury width)",
        tensileStrength: "> 290 N (Natural micro-elasticity)",
        handFeel: "Featherlight, serene drape, whisper-soft fragrance",
        moq: "5 meters (Bespoke haute couture)",
        applications: "Evening gowns, bespoke scarves, high-fashion statement pieces",
        ecoAttribute: "Celebrates Vietnamese lotus heritage and zero-chemical artisanal craft",
      },
    },
  },
];

export interface ProductItem {
  id: number;
  slug: string;
  name: string;
  english: string;
  price: number;
  color: string;
  colorEn: string;
  category: string;
  categoryEn: string;
  isDemoVariant: boolean;
  materialUsed: string;
  materialUsedEn: string;
  description: string;
  descriptionEn: string;
}

export const products: ProductItem[] = [
  {
    id: 0,
    slug: "ao-so-mi-tu-nhien",
    name: "Áo sơ mi tự nhiên",
    english: "The Everyday Shirt",
    price: 760000,
    color: "Ivory",
    colorEn: "Ivory Natural",
    category: "Trang phục",
    categoryEn: "Apparel",
    isDemoVariant: true,
    materialUsed: "PineFiber (100% Sợi lá dứa)",
    materialUsedEn: "PineFiber (100% Pineapple leaf fiber)",
    description: "Áo sơ mi phom rộng thư thái với cấu trúc dệt thoáng khí từ sợi lá dứa. Bền bỉ, đứng phom và thân thiện tối đa với làn da.",
    descriptionEn: "Relaxed tailored shirt featuring breathable structure woven from pure pineapple fiber. Resilient, crisp silhouette, and gentle on the skin.",
  },
  {
    id: 1,
    slug: "vay-dang-dai",
    name: "Váy dáng dài",
    english: "The Quiet Dress",
    price: 1400000,
    color: "Sage",
    colorEn: "Botanical Sage",
    category: "Trang phục",
    categoryEn: "Apparel",
    isDemoVariant: true,
    materialUsed: "SenPine Blend (95% Dứa + 5% Sen)",
    materialUsedEn: "SenPine Blend (95% Pineapple + 5% Lotus Silk)",
    description: "Váy dáng dài thanh lịch khai thác độ rủ mềm mại của dòng vải SenPine Blend. Mang cảm giác thoáng mát tự nhiên cùng độ bóng nhẹ quý phái.",
    descriptionEn: "Effortless maxi dress showcasing the fluid drape of SenPine Blend. Breathable comfort with a sophisticated, subtle botanical sheen.",
  },
  {
    id: 2,
    slug: "khan-choang",
    name: "Khăn choàng",
    english: "The Soft Scarf",
    price: 410000,
    color: "Natural",
    colorEn: "Natural Cream",
    category: "Phụ kiện",
    categoryEn: "Accessories",
    isDemoVariant: true,
    materialUsed: "SenPine Blend kết hợp viền tơ",
    materialUsedEn: "SenPine Blend with lotus silk edge",
    description: "Khăn choàng dệt mộc với độ xốp nhẹ và khả năng giữ ấm dịu dàng. Điểm nhấn hoàn hảo cho phong cách thời trang bền vững tối giản.",
    descriptionEn: "Artisanal lightweight woven scarf with tactile warmth and comforting softness. An understated emblem of minimalist circular elegance.",
  },
  {
    id: 3,
    slug: "tui-vai",
    name: "Túi vải",
    english: "The Daily Tote",
    price: 330000,
    color: "Natural",
    colorEn: "Raw Linen Hue",
    category: "Phụ kiện",
    categoryEn: "Accessories",
    isDemoVariant: true,
    materialUsed: "PineFiber dệt thô chịu lực",
    materialUsedEn: "Heavyweight durable PineFiber",
    description: "Túi tote đa năng gia công từ vải sợi dứa chịu lực cao. Bền bỉ đồng hành trong mọi hoạt động hàng ngày thay thế túi nilon.",
    descriptionEn: "Heavy-duty everyday tote crafted from high-tensile pineapple canvas. Built to replace single-use plastics for years to come.",
  },
  {
    id: 4,
    slug: "mu-bucket",
    name: "Mũ bucket",
    english: "The Weekend Hat",
    price: 290000,
    color: "Sage",
    colorEn: "Muted Sage",
    category: "Phụ kiện",
    categoryEn: "Accessories",
    isDemoVariant: true,
    materialUsed: "PineFiber dệt thoi đứng phom",
    materialUsedEn: "Structured weave PineFiber",
    description: "Mũ bucket phong cách tối giản với khả năng chống nắng tự nhiên và thoát nhiệt tốt, phù hợp cho những chuyến dạo chơi cuối tuần.",
    descriptionEn: "Contemporary bucket hat offering natural UV defense and superior thermal ventilation for conscious weekend escapes.",
  },
  {
    id: 5,
    slug: "vi-vai",
    name: "Ví vải",
    english: "The Little Wallet",
    price: 260000,
    color: "Ivory",
    colorEn: "Ivory Weave",
    category: "Phụ kiện",
    categoryEn: "Accessories",
    isDemoVariant: true,
    materialUsed: "PineFiber dệt mịn",
    materialUsedEn: "Fine weave PineFiber",
    description: "Ví vải nhỏ gọn với cấu trúc ngăn tiện dụng. Bề mặt vải sợi tự nhiên bền chắc càng sử dụng càng tăng thêm độ bóng cổ điển.",
    descriptionEn: "Compact cardholder wallet engineered with durable vegetable weave that gracefully develops a natural vintage patina over time.",
  },
];

export interface JourneyStep {
  step: string;
  title: string;
  titleEn: string;
  label: string;
  text: string;
  textEn: string;
  image: string;
}

export const journey: JourneyStep[] = [
  {
    step: "01",
    title: "Từ vùng nguyên liệu",
    titleEn: "Agricultural Biomass",
    label: "NATURE",
    text: "Lá dứa sau thu hoạch tại Cần Thơ, Hậu Giang và cuống sen Đồng Tháp mở đầu chuỗi giá trị tuần hoàn. Hợp tác nâng cao thu nhập cho nông hộ.",
    textEn: "Post-harvest pineapple leaves in Can Tho, Hau Giang and lotus stems from Dong Thap initiate our circular chain, uplifting local farming communities.",
    image: "origins",
  },
  {
    step: "02",
    title: "Đánh thức từng xơ",
    titleEn: "Mechanical Extraction",
    label: "EXTRACTION",
    text: "Lá tươi được đưa qua máy tuốt xơ cơ học, rửa sạch tạp chất, ép nước và sấy kiểm soát nhiệt độ nhằm giữ trọn độ bền kéo tự nhiên của cellulose.",
    textEn: "Fresh leaves undergo specialized mechanical decortication, purification washing, and controlled dehydration to preserve inherent cellulose tensile strength.",
    image: "botanical",
  },
  {
    step: "03",
    title: "Chuẩn hóa xơ thô",
    titleEn: "Raw Fiber QC",
    label: "FIBER",
    text: "Xơ dứa và xơ tơ sen được chải kỹ, loại bỏ sợi ngắn và phân loại độ mảnh theo quy chuẩn kỹ thuật phòng thí nghiệm trước khi đưa vào dệt.",
    textEn: "Pineapple and lotus fibers are meticulously carded, eliminating short fuzz and categorizing micron fineness to laboratory standards.",
    image: "materials",
  },
  {
    step: "04",
    title: "Kết nối thành sợi dệt",
    titleEn: "Yarn Spinning",
    label: "YARN",
    text: "Hệ thống máy kéo sợi chuyên dụng tạo ra sợi đơn và sợi chập (95% dứa + 5% sen) với độ săn đồng đều, sẵn sàng cho các kiểu dệt phong phú.",
    textEn: "High-precision spinning creates single and blended yarns (95% pineapple + 5% lotus) with uniform twist, primed for versatile weaving looms.",
    image: "materials",
  },
  {
    step: "05",
    title: "Dệt nên cấu trúc vải",
    titleEn: "Bio-Fabric Weaving",
    label: "FABRIC",
    text: "Máy dệt thoi hiện đại đan xen từng tao sợi thành các thước vải PineFiber, SenPine Blend và SenSilk với độ rủ, độ bền và cảm giác chạm hoàn hảo.",
    textEn: "Modern looms weave yarn threads into PineFiber, SenPine Blend, and SenSilk with impeccable tactile hand-feel and structural integrity.",
    image: "materials",
  },
  {
    step: "06",
    title: "Nhuộm sinh thái & Thiết kế",
    titleEn: "Eco-Finishing & Design",
    label: "FINISHING",
    text: "Vải trải qua quá trình tiền xử lý sinh học không clo độc hại, nhuộm màu tự nhiên hoặc giữ sắc mộc nguyên bản theo bản vẽ nhà mốt.",
    textEn: "Fabrics undergo non-toxic enzyme bioscouring and natural plant dyeing or remain in unbleached ivory hues per designers' artistic vision.",
    image: "collection",
  },
  {
    step: "07",
    title: "Thời trang & Hộ chiếu số",
    titleEn: "Fashion & Digital Passport",
    label: "FASHION",
    text: "Mỗi sản phẩm hoàn thiện được gắn mã truy xuất nguồn gốc số (Product Passport), cho phép kiểm tra toàn bộ dữ liệu minh bạch đến tận nông hộ.",
    textEn: "Each finished garment is paired with a Digital Product Passport, empowering consumers to trace the entire lineage back to the farmer.",
    image: "fashion",
  },
];

export const corporateInfo = {
  name: "Công ty Cổ phần SenPine",
  nameEn: "SenPine Joint Stock Corporation",
  tradeName: "SENPINE",
  academicProject: "Dự án nghiên cứu & khởi nghiệp: Vải sinh học từ tơ sen và sợi lá dứa trong thời trang bền vững",
  university: "Trường Đại học Công nghiệp Thành phố Hồ Chí Minh (IUH)",
  faculty: "Khoa Quản trị Kinh doanh - Lớp DHTMDT20C",
  foundingGroup: "Nhóm 4",
  advisor: "ThS. Chu Thị Thùy",
  factoryAddress: "Khu công nghiệp Sông Hậu, khu vực Châu Thành, thành phố Cần Thơ",
  factoryAddressEn: "Song Hau Industrial Park, Chau Thanh, Can Tho / Hau Giang, Vietnam",
  factoryArea: "1.000 m²",
  businessModel: "B2B2C (Nguyên liệu B2B + Bộ sưu tập thử nghiệm B2C)",
  breakEvenTimeline: "Tháng 25 (Giai đoạn 5 - Ổn định và mở rộng thị trường)",
  plannedProductionMix: {
    pineappleFiberRatio: "96.9%",
    lotusSilkRatio: "3.1%",
  },
};

export const currency = (amount: number, lang: "vi" | "en" = "vi") => {
  if (lang === "en") {
    // Approximate conversion rate ~25,000 VND / USD
    const usd = Math.round(amount / 25000);
    return usd < 1 ? "< $1 USD" : `$${new Intl.NumberFormat("en-US").format(usd)} USD`;
  }
  return new Intl.NumberFormat("vi-VN").format(amount) + " ₫";
};
