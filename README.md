# SenPine

Website SenPine: Next.js App Router, TypeScript, Tailwind CSS, GSAP và Lucide React. Toàn bộ giao diện dùng font không chân Be Vietnam Pro được phục vụ từ project.

## Chạy trên máy

Yêu cầu Node.js 22 trở lên và pnpm 11.

```bash
pnpm install
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Trợ lý AI Gemini

Khung **Hỏi SenPine** ở góc phải dưới xuất hiện trên mọi trang. Bot dùng Gemini thật, có ngữ cảnh từ dữ liệu vật liệu, bộ sưu tập, truy xuất, tuyển dụng và liên hệ. Có gửi bằng Enter, xuống dòng bằng Shift + Enter, dừng câu trả lời, thử lại và bắt đầu hội thoại mới. Đóng khung chat hoặc chuyển trang bằng liên kết nội bộ vẫn giữ hội thoại; tải lại trang sẽ xóa hội thoại trên trình duyệt.

Quy tắc tại `src/lib/chat-policy.ts` giới hạn bot vào thông tin được cung cấp từ website SenPine, được áp dụng qua system instruction ở mọi lượt gửi. Bot từ chối câu hỏi ngoài phạm vi, cả khi câu hỏi có nhắc tên SenPine hoặc yêu cầu bỏ qua quy tắc. Với tin nhắn có nhiều chủ đề, bot chỉ giải đáp phần thuộc website; thông tin chưa có trên website được trả lời là chưa có dữ liệu. Quy tắc này cũng áp dụng khi tiếp tục hội thoại cũ hoặc thử lại.

1. Tạo key trong [Google AI Studio](https://aistudio.google.com/apikey).
2. Điền vào file `.env` ở thư mục gốc (đã tạo sẵn; `.env.example` là mẫu):

   ```dotenv
   GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   GEMINI_MODEL=gemini-3.8-flash
   ```

3. Khởi động lại `pnpm dev`, mở website và bấm **Hỏi SenPine**. Nếu có `.env.local` chứa cùng tên biến, Next.js ưu tiên giá trị trong `.env.local`.

Model có thể đổi qua `GEMINI_MODEL`, dùng model Gemini hỗ trợ trả lời văn bản và API `generateContent`. Mặc định lấy theo [danh sách model chính thức](https://ai.google.dev/gemini-api/docs/models). Backend gọi REST `streamGenerateContent` và truyền từng đoạn trả lời tới trình duyệt. Tham khảo [hướng dẫn API của Google](https://ai.google.dev/gemini-api/docs/migrate-to-interactions), trong đó `generateContent` vẫn được hỗ trợ.

Key chỉ được đọc phía máy chủ ở `/api/chat`; không đặt tên biến có tiền tố `NEXT_PUBLIC_` và không đưa `.env` vào Git. Website không ghi hội thoại vào cơ sở dữ liệu hay localStorage; nội dung gửi và lịch sử tối đa 10 lượt hoàn tất được gửi tới Gemini để tạo câu trả lời. Chi phí và hạn mức phụ thuộc tài khoản Google; kiểm tra chúng trong AI Studio. Bot không đặt hàng, nộp CV hay gửi biểu mẫu demo.

API có giới hạn kích thước tin nhắn, thời gian chờ 55 giây, 12 yêu cầu/phút cho mỗi địa chỉ do máy chủ nhận được và tối đa 8 lượt đang xử lý trong một tiến trình. Khi triển khai công khai với nhiều máy chủ, cần limiter dùng chung và cấu hình proxy tin cậy cho `x-forwarded-for`; limiter hiện tại dành cho demo, không thay thế kiểm soát hạn mức trong tài khoản Google. Ngữ cảnh nằm ở `src/lib/chat-context.ts`, được lấy từ các dữ liệu nội dung đang dùng trên website.

Kiểm tra sau khi chạy dev:

```bash
pnpm check:chatbot
```

Kiểm tra dùng phản hồi Gemini giả lập để xác minh giao thức streaming, xử lý lỗi và giao diện mà không tiêu thụ key. Kết nối Gemini thực tế cần thử sau khi điền key.

Nếu chat báo **máy chủ bị chặn kết nối tới Gemini**, tiến trình Next.js đang thiếu quyền truy cập mạng (ví dụ chạy trong sandbox). Chạy `pnpm dev` từ terminal trên máy có kết nối Internet hoặc khởi động máy chủ với quyền mạng được cấp. Sửa key không giải quyết được lỗi này. API phân biệt lỗi quyền mạng, DNS, chứng chỉ TLS và hết thời gian chờ; không gửi lỗi thô hoặc key tới trình duyệt. Không tắt kiểm tra chứng chỉ TLS để xử lý lỗi kết nối.

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
