# SenPine — ảnh minh họa trang chủ

Các ảnh được tạo bằng công cụ image generation tích hợp trong Codex (built-in mode), không dùng ảnh thương mại của thương hiệu khác. Đây là ảnh concept, chưa đại diện cho nguyên liệu, nhà máy, mẫu thử hoặc hàng hóa thực tế của SenPine.

Ảnh gốc được chuyển sang WebP (quality 87) bằng Sharp, giữ nguyên nội dung. Các vùng vật liệu và sản phẩm được hiển thị bằng CSS, không sửa ảnh gốc. Tổng dung lượng năm file WebP khoảng 1,24 MB. Next/Image phục vụ các kích thước phù hợp.

## File trong project

| File | Vai trò |
| --- | --- |
| `public/images/botanical.webp` | Hero, nguyên liệu và hành trình |
| `public/images/origins.webp` | Sen và nguồn gốc |
| `public/images/materials.webp` | Bề mặt ba hướng vật liệu |
| `public/images/fashion.webp` | Fashion editorial concept |
| `public/images/collection.webp` | Sáu sản phẩm trong contact sheet 3 × 2 |

## Prompt generation

### Hero / botanical

Create a wide cinematic premium editorial photograph for SenPine, a Vietnamese plant-based textile brand. Dark forest green atmosphere, botanical still life connecting Vietnamese lotus stems and a pale lotus blossom, long pineapple leaves, fine raw plant fibers and elegantly draped natural ivory textile. Place the visual subjects mainly on the right half, preserve generous dark negative space on the left for the website headline. Low-angle soft morning light, subtle mist above still water, rich tactile natural details, restrained ivory and forest palette. No text, no logo, no watermark, no layout or UI. Photorealistic, immersive luxury textile editorial, wide landscape composition.

### Origins

Wide premium botanical textile editorial still life. Pale lotus flower and broad lotus leaf, slender pineapple leaves, fine plant fibers and natural cream cloth arranged together, dark forest atmosphere and softly reflected water. Subjects weighted to the right with clean dark negative space on the left. Soft cinematic natural light, realistic textile threads, subtle haze, muted ivory, sage and forest green. No text, no logo, no watermark.

### Fashion — final prompt

Use case: photorealistic-natural. Asset type: SenPine fashion editorial homepage portrait. Vertical 4:5 premium magazine fashion photograph of a young adult Vietnamese woman wearing a sophisticated ivory natural woven shirt and flowing long cream skirt, standing in a minimalist warm stone courtyard with a forest green doorway. Medium full body composition, grounded understated pose, looking away from camera, gentle sunlight, organic tactile fabric, elegant muted palette ivory, sage, dark forest. No text, no logo, no watermark, no jewelry brand, no fashion brand emblems. Editorial concept image for botanical textile brand.

### Material — final prompt

Use case: product-mockup. Asset type: SenPine material laboratory homepage visual, wide landscape 3:2. A premium tactile still-life photograph of three botanical textile swatches draped in graceful folds on warm ivory limestone, coarse natural flax-colored plant weave on left, softly woven sage cloth in center, luminous cream silk-like textile on right. Tiny raw pale plant fibers in foreground, no plants or props distracting from weave. Side-lit warm morning sunlight, detailed real threads, subtle film grain, high fashion editorial minimalism, soft shadows. No text, no logo, no labels, no watermark. This is a conceptual material image, not certified product photography.

### Collection — final prompt

Use case: product-mockup. Asset type: homepage catalog sprite image for six SenPine conceptual products. A precisely aligned 3-column by 2-row photographic contact sheet, six separate equally-sized cells, exact grid with no gutters and no dividers, same warm ivory background in every cell. Row 1: left a neatly displayed ivory long-sleeve natural linen-like shirt; center an elegant sage sleeveless midi dress; right a lightweight cream rectangular scarf gently folded. Row 2: left a natural woven fabric tote bag with simple handles; center a sage natural woven bucket hat; right a small flat rectangular ivory woven fabric wallet. Each complete object centered in its own cell with 18 percent negative space around edges, objects never cross cells. Consistent premium ecommerce studio photography, tactile plant fiber weave, soft directional shadows, muted ivory natural sage colors. No plants, no extra objects, no people, no text, no logos, no labels, no watermark. Wide landscape overall 3:2 aspect ratio.

Hai prompt botanical được tóm lược từ hướng dẫn tạo ảnh trong bước chuẩn bị trước; ba prompt final phía trên được giữ nguyên từ lần gọi công cụ cho trang chủ.

## Nội dung báo cáo

Giá dự kiến lấy từ `Final (1) (1).docx`: PineFiber 500.000 ₫/m, SenPine Blend 2.000.000 ₫/m, SenSilk 15.000.000 ₫/m; sáu sản phẩm 760.000 / 1.400.000 / 410.000 / 330.000 / 290.000 / 260.000 ₫. Tỷ lệ Blend 95% lá dứa và 5% tơ sen là đề xuất concept trong requirement, chưa kiểm nghiệm. Các mã SP-PF-001, SP-SB-001, SP-SS-001 là dữ liệu demo.
