export type Language = "vi" | "en";

export interface TranslationDictionary {
  brand: {
    name: string;
    tagline: string;
    subtagline: string;
    corpName: string;
    legalNote: string;
  };
  nav: {
    story: string;
    materials: string;
    collection: string;
    trace: string;
    business: string;
    about: string;
    sustainability: string;
    contact: string;
    saved: string;
    cart: string;
    search: string;
    menu: string;
    close: string;
  };
  hero: {
    badge: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    ctaExplore: string;
    scrollDown: string;
    metrics: {
      stat1Val: string;
      stat1Label: string;
      stat2Val: string;
      stat2Label: string;
      stat3Val: string;
      stat3Label: string;
      stat4Val: string;
      stat4Label: string;
    };
  };
  origin: {
    eyebrow: string;
    title: string;
    description: string;
    lotusTitle: string;
    lotusSubtitle: string;
    lotusDesc: string;
    pineTitle: string;
    pineSubtitle: string;
    pineDesc: string;
    convergence: string;
  };
  pyramid: {
    eyebrow: string;
    title: string;
    subtitle: string;
    layers: Array<{
      title: string;
      tag: string;
      desc: string;
    }>;
  };
  materialsSec: {
    eyebrow: string;
    title: string;
    subtitle: string;
    exploreBtn: string;
    compareTitle: string;
    compareDesc: string;
    orderKitBtn: string;
  };
  journeySec: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  showroom: {
    eyebrow: string;
    title: string;
    subtitle: string;
    filterAll: string;
    filterApparel: string;
    filterAccessories: string;
    viewPiece: string;
    savePiece: string;
    addToBag: string;
    viewAllBtn: string;
  };
  traceSec: {
    eyebrow: string;
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    lookupBtn: string;
    passportTitle: string;
    openSamplePassport: string;
  };
  businessSec: {
    eyebrow: string;
    title: string;
    subtitle: string;
    sampleKitTitle: string;
    sampleKitDesc: string;
    requestSampleBtn: string;
    requestQuoteBtn: string;
    partnerProposalBtn: string;
  };
  footer: {
    mission: string;
    exploreTitle: string;
    corpTitle: string;
    legalTitle: string;
    newsletterTitle: string;
    newsletterPlaceholder: string;
    newsletterBtn: string;
    newsletterSuccess: string;
    disclaimer: string;
    copyright: string;
    backToTop: string;
  };
  common: {
    plannedPrice: string;
    disclaimerNotice: string;
    demoNotice: string;
    loading: string;
    success: string;
    error: string;
    themeLight: string;
    themeDark: string;
    langVi: string;
    langEn: string;
  };
}

export const translations: Record<Language, TranslationDictionary> = {
  vi: {
    brand: {
      name: "SenPine",
      tagline: "Vải Sinh Học Từ Tơ Sen & Sợi Lá Dứa",
      subtagline: "Từ Tự Nhiên, Dệt Nên Tương Lai",
      corpName: "Công ty Cổ phần SenPine",
      legalNote: "Đề án khởi nghiệp thời trang bền vững – ĐH Công nghiệp TP.HCM (IUH)",
    },
    nav: {
      story: "Câu chuyện",
      materials: "Vật liệu",
      collection: "Bộ sưu tập",
      trace: "Truy xuất",
      business: "Đối tác",
      about: "Về SenPine",
      sustainability: "Định hướng bền vững",
      contact: "Liên hệ",
      saved: "Đã lưu",
      cart: "Giỏ trải nghiệm",
      search: "Tìm kiếm",
      menu: "Menu",
      close: "Đóng",
    },
    hero: {
      badge: "CÔNG NGHỆ VẬT LIỆU SINH HỌC • B2B2C",
      titleLine1: "Vải Sinh Học",
      titleLine2: "Từ Tơ Sen & Sợi Dứa",
      description: "Giải pháp vật liệu tuần hoàn cho ngành thời trang bền vững. Kết nối phụ phẩm nông nghiệp Đồng bằng sông Cửu Long với chuỗi giá trị dệt may hiện đại.",
      ctaPrimary: "Khám phá Vật liệu B2B",
      ctaSecondary: "Hành trình Sợi",
      ctaExplore: "Tham quan Showroom",
      scrollDown: "Cuộn để khám phá",
      metrics: {
        stat1Val: "96.9%",
        stat1Label: "Sợi dứa tuần hoàn",
        stat2Val: "3.1%",
        stat2Label: "Tơ sen thượng hạng",
        stat3Val: "1.000 m²",
        stat3Label: "Nhà máy KCN Sông Hậu",
        stat4Val: "B2B2C",
        stat4Label: "Hệ sinh thái khép kín",
      },
    },
    origin: {
      eyebrow: "01 / NGUỒN GỐC & CÔNG NGHỆ",
      title: "Hai Nguồn Sợi Bản Địa Tạo Nên Một Vật Liệu",
      description: "Đề án khám phá khả năng kết hợp sợi từ lá dứa sau thu hoạch với tơ rút từ cuống sen Việt Nam.",
      lotusTitle: "TƠ SEN",
      lotusSubtitle: "Quý hiếm & Thượng hạng",
      lotusDesc: "Nguồn nguyên liệu quý hiếm, đòi hỏi kỹ thuật rút tơ thủ công. Đặc tính vật liệu cần được kiểm nghiệm trong giai đoạn phát triển.",
      pineTitle: "SỢI LÁ DỨA",
      pineSubtitle: "Chủ lực & Tuần hoàn",
      pineDesc: "60kg lá dứa tươi tạo ra 1kg xơ dệt bền chắc, chịu lực cao, tối ưu phụ phẩm nông nghiệp tại Đồng bằng sông Cửu Long.",
      convergence: "Hội tụ thành cấu trúc vải sinh học SenPine",
    },
    pyramid: {
      eyebrow: "02 / THÁP GIÁ TRỊ CỐT LÕI",
      title: "Hệ Thống Giá Trị Xuyên Suốt Doanh Nghiệp",
      subtitle: "La bàn chiến lược cân bằng giữa bài toán kinh tế thị trường và trách nhiệm sinh thái xã hội theo nghiên cứu đề tài.",
      layers: [
        {
          title: "Giá trị đối với Khách hàng",
          tag: "TÍNH NĂNG & CẢM XÚC",
          desc: "Độ bền cao từ sợi dứa hòa quyện sự xốp nhẹ, kháng khuẩn tự nhiên từ tơ sen. Xóa tan nỗi lo greenwashing bằng giải pháp truy xuất nguồn gốc số minh bạch.",
        },
        {
          title: "Giá trị đối với Thị trường",
          tag: "TỰ CHỦ VẬT LIỆU XANH",
          desc: "Tiên phong bổ sung nguồn vải sinh học chất lượng cao cho ngành dệt may Việt Nam, mở rộng cơ hội tham gia chuỗi cung ứng thời trang bền vững quốc tế.",
        },
        {
          title: "Giá trị đối với Môi trường",
          tag: "KINH TẾ TUẦN HOÀN",
          desc: "Giảm áp lực rác thải và đốt bỏ phụ phẩm nông nghiệp tại nhà vườn. Quy trình sản xuất tiết kiệm nước và tối thiểu hóa dấu chân carbon.",
        },
        {
          title: "Giá trị đối với Xã hội & Nông dân",
          tag: "SINH KẾ BỀN VỮNG",
          desc: "Hợp tác trực tiếp với nông hộ và hợp tác xã Cần Thơ, Hậu Giang, Đồng Tháp; gia tăng thu nhập và tạo việc làm xanh tại nông thôn.",
        },
      ],
    },
    materialsSec: {
      eyebrow: "03 / TRUNG TÂM VẬT LIỆU",
      title: "Ba Dòng Vải Sinh Học Chiến Lược",
      subtitle: "Phát triển theo phân tầng nguyên liệu để đáp ứng cả yêu cầu mở rộng sản lượng và nhu cầu phân khúc thời trang cao cấp.",
      exploreBtn: "Khám phá",
      compareTitle: "Bảng So Sánh Vật Liệu & Phân Cấp Giá",
      compareDesc: "Định vị cảm giác chạm và tỷ lệ sợi từ ứng dụng thường nhật đến dạ hội xa xỉ.",
      orderKitBtn: "Yêu cầu Bộ Mẫu Vải (Sample Kit)",
    },
    journeySec: {
      eyebrow: "02 / HÀNH TRÌNH 7 BƯỚC",
      title: "Từ Nông Nghiệp Tự Nhiên Đến Thời Trang",
      subtitle: "Quy trình kiểm soát chất lượng khép kín từ khâu thu mua lá tươi đến sản phẩm thời trang ứng dụng hoàn chỉnh.",
    },
    showroom: {
      eyebrow: "05 / BỘ SƯU TẬP ỨNG DỤNG",
      title: "Trải Nghiệm Cảm Quan Của Vải Thực Vật",
      subtitle: "Các thiết kế ứng dụng minh chứng cho phom dáng, độ rủ và độ bền thực tế của vải sợi dứa và tơ sen trong đời sống.",
      filterAll: "Tất cả",
      filterApparel: "Trang phục",
      filterAccessories: "Phụ kiện",
      viewPiece: "Xem chi tiết",
      savePiece: "Lưu thiết kế",
      addToBag: "Thêm vào giỏ trải nghiệm",
      viewAllBtn: "Xem toàn bộ bộ sưu tập",
    },
    traceSec: {
      eyebrow: "06 / HỘ CHIẾU SẢN PHẨM SỐ",
      title: "Minh Bạch Chuỗi Cung Ứng Đến Từng Lô Hàng",
      subtitle: "Kiểm tra hành trình ngược từ sản phẩm hoàn thiện về đến xưởng dệt, nhà máy và nông hộ thu hoạch.",
      inputPlaceholder: "Nhập mã lô (ví dụ: SP-PF-001, SP-SB-001, SP-SS-001)...",
      lookupBtn: "Tìm hồ sơ",
      passportTitle: "Hồ sơ Truy Xuất Nguồn Gốc Số",
      openSamplePassport: "Mở hộ chiếu vật liệu mẫu",
    },
    businessSec: {
      eyebrow: "07 / HỢP TÁC DOANH NGHIỆP",
      title: "Cung Ứng Vật Liệu Cho Nhà Thiết Kế & Thương Hiệu",
      subtitle: "Đồng hành phát triển bộ sưu tập xanh, cung ứng vải sỉ và linh hoạt chính sách sản lượng tối thiểu (MOQ) cho đối tác B2B.",
      sampleKitTitle: "Bộ Mẫu Vải SenPine (Material Sample Kit)",
      sampleKitDesc: "Gồm đầy đủ 3 mẫu swatch vải PineFiber, SenPine Blend, SenSilk cùng bảng dữ liệu kỹ thuật và hướng dẫn xử lý nhiệt/may mặc.",
      requestSampleBtn: "Yêu cầu Mẫu Thử",
      requestQuoteBtn: "Yêu cầu Báo Giá",
      partnerProposalBtn: "Đề xuất hợp tác",
    },
    footer: {
      mission: "Công ty Cổ phần SenPine – Tiên phong nghiên cứu và phát triển vải sinh học từ tơ sen và sợi lá dứa tại Việt Nam.",
      exploreTitle: "KHÁM PHÁ",
      corpTitle: "DOANH NGHIỆP",
      legalTitle: "PHÁP LÝ & DỰ ÁN",
      newsletterTitle: "NHẬN BÁO CÁO ESG & VẬT LIỆU",
      newsletterPlaceholder: "Địa chỉ email doanh nghiệp...",
      newsletterBtn: "Đăng ký",
      newsletterSuccess: "Cảm ơn bạn đã quan tâm đến nghiên cứu của SenPine.",
      disclaimer: "Lưu ý: SenPine là đề án nghiên cứu và khởi nghiệp học thuật thuộc Trường ĐH Công nghiệp TP.HCM (IUH). Toàn bộ nội dung, hình ảnh minh họa AI, mã truy xuất và bảng giá kế hoạch phục vụ bản mô phỏng tương tác; website không nhận đơn hàng hay thanh toán thương mại thực tế.",
      copyright: "© 2026–2027 Công ty Cổ phần SenPine. Bảo lưu mọi quyền.",
      backToTop: "Về đầu trang ↑",
    },
    common: {
      plannedPrice: "Giá kế hoạch",
      disclaimerNotice: "Giá kế hoạch phục vụ mô phỏng dự án SenPine; không phải giá giao dịch thực tế.",
      demoNotice: "Dữ liệu demo phục vụ trải nghiệm người dùng.",
      loading: "Đang tải dữ liệu...",
      success: "Thành công",
      error: "Đã xảy ra lỗi",
      themeLight: "Chế độ Sáng",
      themeDark: "Chế độ Tối",
      langVi: "Tiếng Việt",
      langEn: "English",
    },
  },
  en: {
    brand: {
      name: "SenPine",
      tagline: "Bio-Based Textiles From Lotus & Pineapple Fiber",
      subtagline: "From Nature to the Future of Textiles",
      corpName: "SenPine Joint Stock Corporation",
      legalNote: "Sustainable Fashion Startup Project – Industrial University of Ho Chi Minh City (IUH)",
    },
    nav: {
      story: "Our Story",
      materials: "Materials",
      collection: "Collection",
      trace: "Traceability",
      business: "For Business",
      about: "About SenPine",
      sustainability: "Sustainability",
      contact: "Contact",
      saved: "Saved",
      cart: "Experience Bag",
      search: "Search",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      badge: "CIRCULAR BIO-TEXTILES • B2B2C",
      titleLine1: "Bio-Based Textiles",
      titleLine2: "From Lotus & Pineapple",
      description: "Next-generation regenerative textile solutions for sustainable fashion. Connecting agricultural co-products of the Mekong Delta with modern textile value chains.",
      ctaPrimary: "Explore B2B Materials",
      ctaSecondary: "Fiber Journey",
      ctaExplore: "Visit Showroom",
      scrollDown: "Scroll to explore",
      metrics: {
        stat1Val: "96.9%",
        stat1Label: "Circular Pineapple Fiber",
        stat2Val: "3.1%",
        stat2Label: "Artisanal Lotus Silk",
        stat3Val: "1,000 m²",
        stat3Label: "Facility at Song Hau IP",
        stat4Val: "B2B2C",
        stat4Label: "Closed-loop Ecosystem",
      },
    },
    origin: {
      eyebrow: "01 / ORIGIN & TECHNOLOGY",
      title: "Two Indigenous Botanical Fibers, One Groundbreaking Textile",
      description: "Blending the exceptional tensile strength of pineapple leaves with the featherweight softness and natural antibacterial properties of Vietnamese lotus stems.",
      lotusTitle: "LOTUS SILK",
      lotusSubtitle: "Precious & Luxurious",
      lotusDesc: "Approximately 50,000 lotus stems yield 1kg of ultra-fine, breathable, naturally antibacterial luxury botanical silk.",
      pineTitle: "PINEAPPLE FIBER",
      pineSubtitle: "Scalable & Circular",
      pineDesc: "60kg of fresh pineapple leaves produce 1kg of strong, durable textile fiber, upcycling Mekong Delta agricultural biomass.",
      convergence: "Converging into SenPine's proprietary bio-fabric matrix",
    },
    pyramid: {
      eyebrow: "02 / CORE VALUE PYRAMID",
      title: "A Cohesive Corporate Value System",
      subtitle: "Our strategic compass harmonizing commercial viability with ecological and social accountability.",
      layers: [
        {
          title: "Value for Customers",
          tag: "TACTILE & EMOTIONAL",
          desc: "Enduring strength from pineapple fibers infused with soft, breathable, natural antibacterial lotus silk. Dispelling greenwashing through transparent digital product passports.",
        },
        {
          title: "Value for the Market",
          tag: "DOMESTIC SUPPLY INDEPENDENCE",
          desc: "Pioneering high-grade botanical fabrics for Vietnam's textile industry and enabling local brands to access global sustainable luxury supply chains.",
        },
        {
          title: "Value for the Environment",
          tag: "CIRCULAR ECONOMY",
          desc: "Diverting agricultural residues from landfill burning, slashing water consumption in fiber preparation, and minimizing carbon footprint.",
        },
        {
          title: "Value for People & Farmers",
          tag: "COMMUNITY RESILIENCE",
          desc: "Direct partnerships with farmer co-ops in Can Tho, Hau Giang, and Dong Thap, unlocking new revenue streams and rural green jobs.",
        },
      ],
    },
    materialsSec: {
      eyebrow: "03 / MATERIAL LAB",
      title: "Three Strategic Bio-Fabrics",
      subtitle: "Architected across volume and luxury tiers to cater to both commercial scalability and haute couture fashion collections.",
      exploreBtn: "Explore",
      compareTitle: "Material Matrix & Pricing Tiers",
      compareDesc: "Positioned from durable everyday essentials to limited haute couture silk.",
      orderKitBtn: "Request a Material Sample Kit",
    },
    journeySec: {
      eyebrow: "02 / 7-STAGE JOURNEY",
      title: "From Vietnamese Agriculture to High Fashion",
      subtitle: "Rigorous quality-controlled journey from farm gate collection to finished design pieces.",
    },
    showroom: {
      eyebrow: "05 / LIFESTYLE SHOWROOM",
      title: "Tangible Drape, Form & Texture",
      subtitle: "Finished application garments proving the silhouette retention, drape, and wearability of plant-based textiles.",
      filterAll: "All Pieces",
      filterApparel: "Apparel",
      filterAccessories: "Accessories",
      viewPiece: "View Details",
      savePiece: "Save Piece",
      addToBag: "Add to Experience Bag",
      viewAllBtn: "Explore Full Collection",
    },
    traceSec: {
      eyebrow: "06 / DIGITAL PRODUCT PASSPORT",
      title: "Supply Chain Transparency to Every Batch",
      subtitle: "Trace back every thread from the finished garment to the weaving mill, processing facility, and agricultural harvest.",
      inputPlaceholder: "Enter batch code (e.g. SP-PF-001, SP-SB-001, SP-SS-001)...",
      lookupBtn: "Search Record",
      passportTitle: "Digital Traceability Dossier",
      openSamplePassport: "Open Sample Passport",
    },
    businessSec: {
      eyebrow: "07 / B2B PARTNERSHIPS",
      title: "Supplying Bio-Textiles for Designers & Brands",
      subtitle: "Collaborating with fashion labels, garment manufacturers, and designers with tailored blending ratios and flexible MOQs.",
      sampleKitTitle: "SenPine Material Sample Kit",
      sampleKitDesc: "Includes complete swatches of PineFiber, SenPine Blend, and SenSilk accompanied by technical data sheets and sewing specifications.",
      requestSampleBtn: "Request Sample Kit",
      requestQuoteBtn: "Request Wholesale Quote",
      partnerProposalBtn: "Propose Partnership",
    },
    footer: {
      mission: "SenPine Corporation – Pioneering circular bio-based textiles engineered from lotus fiber and pineapple leaf in Vietnam.",
      exploreTitle: "EXPLORE",
      corpTitle: "CORPORATE",
      legalTitle: "GOVERNANCE & PROJECT",
      newsletterTitle: "RECEIVE ESG & TEXTILE INSIGHTS",
      newsletterPlaceholder: "Corporate email address...",
      newsletterBtn: "Subscribe",
      newsletterSuccess: "Thank you for your interest in SenPine research.",
      disclaimer: "Notice: SenPine is an academic startup and research project affiliated with Industrial University of Ho Chi Minh City (IUH). All images, batch codes, and planned price points simulate digital brand experience and commerce; no financial transactions are processed.",
      copyright: "© 2026–2027 SenPine Corporation. All rights reserved.",
      backToTop: "Back to top ↑",
    },
    common: {
      plannedPrice: "Planned Price",
      disclaimerNotice: "Planned price for SenPine project simulation; not an actual commercial transaction price.",
      demoNotice: "Simulated demonstration data.",
      loading: "Loading data...",
      success: "Success",
      error: "An error occurred",
      themeLight: "Light Theme",
      themeDark: "Dark Theme",
      langVi: "Tiếng Việt",
      langEn: "English",
    },
  },
};
