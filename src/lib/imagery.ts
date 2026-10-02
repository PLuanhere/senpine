// Images extracted from Details.docx; captions describe references, not verified SenPine production.
export const detailsImages = {
  "logo": {
    "src": "/images/details/senpine-logo.webp",
    "width": 1254,
    "height": 1254,
    "alt": "Logo SenPine trong đề án"
  },
  "mekong": {
    "src": "/images/details/mekong-delta.webp",
    "width": 565,
    "height": 353,
    "alt": "Cảnh quan Đồng bằng sông Cửu Long trong đề án"
  },
  "pinefiber": {
    "src": "/images/details/pinefiber-fabric.webp",
    "width": 780,
    "height": 472,
    "alt": "Ảnh vải tham khảo cho PineFiber trong đề án"
  },
  "blend": {
    "src": "/images/details/blend-fibers.webp",
    "width": 1024,
    "height": 741,
    "alt": "Hình rút tơ sen và sợi dứa tham khảo cho SenPine Blend"
  },
  "sensilk": {
    "src": "/images/details/lotus-embroidery.webp",
    "width": 850,
    "height": 650,
    "alt": "Hình vải thêu hoa sen tham khảo cho SenSilk"
  },
  "shirt": {
    "src": "/images/details/shirt-reference.webp",
    "width": 200,
    "height": 300,
    "alt": "Ảnh trang phục tham khảo cho nhóm áo SenPine"
  },
  "dress": {
    "src": "/images/details/dress-reference.webp",
    "width": 640,
    "height": 452,
    "alt": "Ảnh bộ trang phục tham khảo cho nhóm váy và đầm SenPine"
  },
  "scarf": {
    "src": "/images/details/scarf-reference.webp",
    "width": 759,
    "height": 570,
    "alt": "Ảnh khăn và sợi dứa tham khảo trong đề án"
  },
  "bag": {
    "src": "/images/details/bag-reference.webp",
    "width": 883,
    "height": 662,
    "alt": "Ảnh túi và sợi thực vật tham khảo trong đề án"
  },
  "hat": {
    "src": "/images/details/hat-reference.webp",
    "width": 781,
    "height": 439,
    "alt": "Ảnh nón dệt tham khảo trong đề án"
  },
  "wallet": {
    "src": "/images/details/wallet-reference.webp",
    "width": 800,
    "height": 600,
    "alt": "Ảnh ví và phụ kiện tham khảo trong đề án"
  },
  "roadmap": {
    "src": "/images/details/project-roadmap.webp",
    "width": 1357,
    "height": 764,
    "alt": "Sơ đồ sáu giai đoạn trong kế hoạch 42 tháng của SenPine"
  },
  "customerRoadmap": {
    "src": "/images/details/customer-roadmap.webp",
    "width": 1255,
    "height": 707,
    "alt": "Sơ đồ lộ trình phát triển khách hàng trong đề án SenPine"
  },
  "rawFiber": {
    "src": "/images/details/raw-fibers.webp",
    "width": 800,
    "height": 600,
    "alt": "Các bó sợi thực vật được treo và kiểm tra thủ công"
  },
  "exhibition": {
    "src": "/images/details/fiber-exhibition.webp",
    "width": 977,
    "height": 731,
    "alt": "Ảnh giới thiệu sợi và vải của Tập đoàn Thiên Phước trong tài liệu tham khảo"
  },
  "harvest": {
    "src": "/images/details/pineapple-harvest.webp",
    "width": 800,
    "height": 450,
    "alt": "Người nông dân thu hoạch lá dứa cạnh kênh nước"
  },
  "values": {
    "src": "/images/details/brand-values.webp",
    "width": 1291,
    "height": 726,
    "alt": "Sơ đồ giá trị cốt lõi ưu tiên của SenPine trong đề án"
  },
  "extraction": {
    "src": "/images/details/fiber-extraction.webp",
    "width": 1121,
    "height": 747,
    "alt": "Người làm nghề xử lý lá dứa bằng máy tách xơ"
  },
  "lotusSorting": {
    "src": "/images/details/lotus-sorting.webp",
    "width": 1600,
    "height": 1128,
    "alt": "Người làm nghề phân loại các bó cuống sen"
  },
  "productionProcess": {
    "src": "/images/details/production-process.webp",
    "width": 1255,
    "height": 706,
    "alt": "Sơ đồ quy trình sản xuất vải trong đề án SenPine"
  },
  "drying": {
    "src": "/images/details/fiber-drying.webp",
    "width": 1600,
    "height": 1067,
    "alt": "Các hàng sợi dứa được treo phơi trong nhà xưởng"
  },
  "fashionExhibition": {
    "src": "/images/details/fashion-exhibition.webp",
    "width": 1600,
    "height": 900,
    "alt": "Ảnh thời trang từ triển lãm Mặc Thơm được dẫn trong đề án"
  },
  "runway": {
    "src": "/images/details/runway-reference.webp",
    "width": 740,
    "height": 900,
    "alt": "Châu Bùi trong thiết kế của Vũ Việt Hà được dẫn trong đề án"
  },
  "decorticator": {
    "src": "/images/details/fiber-machine.webp",
    "width": 800,
    "height": 800,
    "alt": "Ảnh máy xử lý sợi lá dứa tham khảo trong đề án"
  },
  "loom": {
    "src": "/images/details/weaving-machine.webp",
    "width": 550,
    "height": 550,
    "alt": "Ảnh máy dệt tham khảo trong đề án"
  },
  "spinning": {
    "src": "/images/details/spinning-machine.webp",
    "width": 1000,
    "height": 1000,
    "alt": "Ảnh máy kéo sợi tham khảo trong đề án"
  }
} as const;

export type DocumentImage = (typeof detailsImages)[keyof typeof detailsImages];

export const materialImages = [detailsImages.pinefiber, detailsImages.blend, detailsImages.sensilk] as const;
export const productImages = [detailsImages.shirt, detailsImages.dress, detailsImages.scarf, detailsImages.bag, detailsImages.hat, detailsImages.wallet] as const;
