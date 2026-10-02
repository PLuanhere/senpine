# SenPine

Website SenPine: Next.js App Router, TypeScript, Tailwind CSS, GSAP và Lucide React. Toàn bộ giao diện dùng font không chân Be Vietnam Pro được phục vụ từ project.

## Chạy trên máy

Yêu cầu Node.js 22 trở lên và pnpm 11.

```bash
pnpm install
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Kiểm tra

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Các trang đã triển khai

- Trang chủ với hành trình bảy giai đoạn, Material Lab, bộ sưu tập và tương tác xem nhanh.
- `/story`: câu chuyện nguyên liệu và quy trình dự kiến.
- `/materials` và `/materials/[slug]`: ba dòng vật liệu cùng trang chi tiết.
- `/collection` và `/products/[slug]`: sáu thiết kế concept, bộ lọc, xem chi tiết, lưu yêu thích và thêm vào giỏ demo.
- `/trace` và `/trace/[code]`: tra cứu ba hồ sơ mẫu SP-PF-001, SP-SB-001, SP-SS-001.
- `/business`, `/business/request-sample`, `/business/request-quote`: định hướng B2B và biểu mẫu minh họa.
- `/sustainability`, `/about`, `/contact`: định hướng bền vững, thông tin đề án và liên hệ demo.
- `/saved`, `/experience/checkout`: danh sách yêu thích và giỏ trải nghiệm. Danh sách và giỏ được lưu trên trình duyệt bằng localStorage.

Giá, thành phần đề xuất, hình ảnh và hồ sơ truy xuất được ghi rõ là kế hoạch hoặc concept. Website chưa tạo đơn hàng, xử lý thanh toán, gửi biểu mẫu hoặc xác nhận đặc tính vật liệu.

Nội dung dùng chung ở `src/lib/content.ts`; trang chủ ở `src/components/home-page.tsx`; các trang khác nằm trong `src/app/(site)`. Style ở `src/app/globals.css` và `src/app/pages.css`. Ảnh minh họa AI, prompt và nguồn được ghi tại [docs/assets.md](docs/assets.md).

## Kiểm tra trình duyệt

Sau khi chạy `pnpm dev`, mở terminal khác:

```bash
pnpm check:home
pnpm check:site
```

Script dùng Chrome trên Windows tại đường dẫn mặc định; có thể chỉ định biến `CHROME_PATH` nếu cần. Ảnh chụp được lưu trong `.artifacts/` (không đưa vào Git). Kiểm tra 25 tuyến trang, desktop, màn hình 360/390/768/1024px, các tương tác chính và chế độ giảm chuyển động.
