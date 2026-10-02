type ContactChannel = {
  id: "facebook" | "zalo" | "email";
  name: { vi: string; en: string };
  purpose: { vi: string; en: string };
  description: { vi: string; en: string };
  action: { vi: string; en: string };
  value: string | null;
  href: string | null;
  placeholder: string;
};

// Replace value and href with confirmed details when available. Placeholders are display-only.
export const contactChannels: readonly ContactChannel[] = [
  {
    id: "facebook", name: { vi: "Facebook", en: "Facebook" },
    purpose: { vi: "Câu chuyện & cộng đồng", en: "Stories & community" },
    description: { vi: "Theo dõi câu chuyện chất liệu, cảm hứng thiết kế và những bước phát triển của SenPine.", en: "Follow material stories, design inspiration and the next chapters of SenPine." },
    action: { vi: "Ghé trang Facebook", en: "Visit Facebook" },
    value: null, href: null, placeholder: "facebook.com/[ten-fanpage]",
  },
  {
    id: "zalo", name: { vi: "Zalo / SĐT", en: "Zalo / Phone" },
    purpose: { vi: "Trao đổi & kết nối", en: "Chats & connections" },
    description: { vi: "Một hướng kết nối cho những câu hỏi về chất liệu, bộ mẫu và ý tưởng hợp tác của bạn.", en: "A way to connect over questions about materials, swatches and your partnership ideas." },
    action: { vi: "Kết nối qua Zalo", en: "Connect on Zalo" },
    value: null, href: null, placeholder: "09x xxxx xxxx",
  },
  {
    id: "email", name: { vi: "Email", en: "Email" },
    purpose: { vi: "Brief & hợp tác", en: "Briefs & partnerships" },
    description: { vi: "Dành cho brief thiết kế, đề xuất hợp tác, nội dung nghiên cứu và các trao đổi chi tiết.", en: "For design briefs, partnership proposals, research and conversations that need a little more detail." },
    action: { vi: "Gửi email", en: "Send an email" },
    value: null, href: null, placeholder: "hello@senpine.example",
  },
];

export const contactTopics = [
  {
    id: "materials",
    label: { vi: "Vật liệu & bộ mẫu", en: "Materials & swatches" },
    description: { vi: "Chạm gần hơn vào tơ sen, sợi lá dứa và khả năng ứng dụng của từng chất liệu.", en: "Get closer to lotus silk, pineapple leaf fibres and the possibilities of each material." },
    audience: { vi: "Nhà thiết kế · Nghiên cứu vật liệu", en: "Designers · Material researchers" },
    heading: { vi: "Bắt đầu từ chất liệu.", en: "Start with the material." },
    guidance: { vi: "Cho biết chất liệu bạn quan tâm và điều bạn muốn tìm hiểu. Một ứng dụng cụ thể sẽ giúp lời nhắn rõ hơn.", en: "Tell us which material interests you and what you would like to explore. A specific application makes your brief more useful." },
    checklist: { vi: ["Chất liệu hoặc dòng sợi quan tâm", "Ứng dụng: may mặc, phụ kiện, thử nghiệm…", "Đặc tính cần tìm hiểu và nhu cầu bộ mẫu"], en: ["Material or fibre of interest", "Application: apparel, accessories, testing…", "Properties to explore and swatch requirements"] },
    placeholder: { vi: "Tôi quan tâm đến PineFiber để phát triển một dòng túi vải. Tôi muốn tìm hiểu cấu trúc dệt, cảm giác bề mặt và nội dung bộ mẫu…", en: "I am interested in PineFiber for a fabric bag range. I would like to explore the weave, surface feel and swatch kit contents…" },
    link: "/business/request-sample",
    linkLabel: { vi: "Khám phá bộ mẫu", en: "Explore the swatch kit" },
  },
  {
    id: "business",
    label: { vi: "Hợp tác & phát triển", en: "Partnerships & development" },
    description: { vi: "Từ một brief thiết kế đến hướng phát triển vật liệu và câu chuyện thương hiệu cùng nhau.", en: "From a design brief to developing materials and telling a brand story together." },
    audience: { vi: "Thương hiệu · Đối tác B2B", en: "Brands · B2B partners" },
    heading: { vi: "Cùng mở một hướng mới.", en: "Find a new direction together." },
    guidance: { vi: "Phác thảo mục tiêu, sản phẩm và giai đoạn hiện tại của dự án. Bạn có thể bổ sung quy mô, ngân sách dự kiến hoặc thời gian nếu đã có.", en: "Outline your goal, product and current project stage. Include estimated volume, budget or timing if you already have them." },
    checklist: { vi: ["Thương hiệu và mục tiêu hợp tác", "Sản phẩm, chất liệu và quy mô dự kiến", "Tiến độ, yêu cầu kỹ thuật hoặc câu hỏi cụ thể"], en: ["Brand and partnership goals", "Product, material and estimated volume", "Timeline, technical requirements or specific questions"] },
    placeholder: { vi: "Chúng tôi đang phát triển một bộ sưu tập phụ kiện từ sợi thực vật. Mong muốn trao đổi về hướng chất liệu, quy mô thử nghiệm và khả năng cùng phát triển…", en: "We are developing a plant-fibre accessories collection. We would like to discuss material direction, a trial volume and opportunities for joint development…" },
    link: "/business/request-quote",
    linkLabel: { vi: "Chuẩn bị brief hợp tác", en: "Prepare a partnership brief" },
  },
  {
    id: "collection",
    label: { vi: "Thiết kế & bộ sưu tập", en: "Designs & collection" },
    description: { vi: "Tìm hiểu một thiết kế concept, cách sử dụng chất liệu và trải nghiệm thời trang SenPine.", en: "Explore a concept design, its materials and the SenPine approach to everyday fashion." },
    audience: { vi: "Người yêu thiết kế · Cộng đồng", en: "Design enthusiasts · Community" },
    heading: { vi: "Kể tiếp câu chuyện thiết kế.", en: "Continue the design story." },
    guidance: { vi: "Nhắc tên thiết kế bạn quan tâm và điều bạn muốn biết. Bộ sưu tập hiện được trình bày dưới dạng concept trong đề án.", en: "Name the design that interests you and what you would like to know. The collection is currently presented as project concepts." },
    checklist: { vi: ["Tên thiết kế hoặc nhóm sản phẩm", "Câu hỏi về chất liệu, phom dáng, chăm sóc", "Ý tưởng, cảm nhận hoặc góp ý của bạn"], en: ["Design name or product category", "Questions about fabric, silhouette or care", "Your ideas, impressions or feedback"] },
    placeholder: { vi: "Tôi quan tâm đến thiết kế khăn choàng trong bộ sưu tập. Tôi muốn biết thêm về cảm giác chất liệu, cách phối và hướng chăm sóc sản phẩm…", en: "I am interested in the scarf concept. I would like to learn about its material feel, styling and proposed care guidance…" },
    link: "/collection",
    linkLabel: { vi: "Ghé bộ sưu tập", en: "Visit the collection" },
  },
  {
    id: "other",
    label: { vi: "Câu chuyện & kết nối", en: "Stories & connections" },
    description: { vi: "Trao đổi về đề án, nghiên cứu, nội dung truyền thông hoặc chia sẻ một ý tưởng với SenPine.", en: "Discuss the project, research, editorial content or share an idea with SenPine." },
    audience: { vi: "Học thuật · Truyền thông · Bạn", en: "Academia · Media · You" },
    heading: { vi: "Mỗi góc nhìn đều có giá trị.", en: "Every perspective matters." },
    guidance: { vi: "Giới thiệu ngắn về bạn, chủ đề muốn trao đổi và mục đích sử dụng thông tin. Không gian này dành cho cả những ý tưởng đang hình thành.", en: "Briefly introduce yourself, the subject you want to discuss and how you plan to use the information. There is room here for ideas still taking shape." },
    checklist: { vi: ["Bạn là ai và chủ đề quan tâm", "Mục đích nghiên cứu, nội dung hoặc kết nối", "Thông tin mong muốn tìm hiểu thêm"], en: ["Who you are and your area of interest", "Research, editorial or connection goals", "Information you would like to explore"] },
    placeholder: { vi: "Tôi đang tìm hiểu về hướng ứng dụng sợi thực vật trong thời trang Việt Nam. Tôi muốn trao đổi thêm về câu chuyện SenPine và nội dung đề án…", en: "I am exploring the use of plant fibres in Vietnamese fashion. I would like to learn more about the SenPine story and the project…" },
    link: "/about",
    linkLabel: { vi: "Tìm hiểu về SenPine", en: "Get to know SenPine" },
  },
] as const;

export type ContactTopicId = typeof contactTopics[number]["id"];

export const contactQuestions = [
  {
    question: { vi: "Tôi nên bắt đầu từ vật liệu nào?", en: "Which material should I start with?" },
    answer: { vi: "Đề án giới thiệu ba hướng: PineFiber từ sợi lá dứa, SenSilk từ tơ sen và SenPine Blend kết hợp hai nguồn sợi. Bạn có thể khám phá từng hồ sơ vật liệu, rồi chuẩn bị lời nhắn nêu ứng dụng và đặc tính mong muốn. Các tính năng trong đề án cần được kiểm chứng qua mẫu và thử nghiệm thực tế.", en: "The project explores three directions: pineapple leaf-based PineFiber, lotus-based SenSilk and SenPine Blend combining both fibres. Explore their profiles, then describe your application and desired properties. Proposed properties require validation through physical samples and testing." },
    href: "/materials",
    link: { vi: "So sánh ba chất liệu", en: "Compare the three materials" },
  },
  {
    question: { vi: "Có thể nhận bộ mẫu hoặc đặt mua ngay không?", en: "Can I receive swatches or buy a product now?" },
    answer: { vi: "Website hiện là trải nghiệm minh họa của đề án. Bộ mẫu và sản phẩm được giới thiệu để khám phá ý tưởng, chưa xác nhận tồn kho, giá bán, phí vận chuyển hay lịch giao hàng thực tế. Biểu mẫu bộ mẫu giúp bạn thử cách mô tả nhu cầu; thao tác trên website không tạo đơn hàng hoặc yêu cầu giao mẫu.", en: "This website is a demonstration of the project. Swatches and products are presented to explore the ideas; actual availability, prices, shipping fees and delivery schedules are not confirmed. The swatch form lets you practise describing your needs. Website interactions do not place orders or arrange sample delivery." },
    href: "/business/request-sample",
    link: { vi: "Xem trải nghiệm bộ mẫu", en: "View the swatch experience" },
  },
  {
    question: { vi: "Một brief hợp tác nên có những gì?", en: "What should a partnership brief include?" },
    answer: { vi: "Hãy nêu thương hiệu hoặc tổ chức, nhóm sản phẩm, mục tiêu chất liệu, quy mô dự kiến và thời gian mong muốn. Nếu đang ở giai đoạn ý tưởng, chỉ cần mô tả điều bạn muốn khám phá. Yêu cầu về giá, số lượng tối thiểu và tiêu chuẩn kỹ thuật cần được trao đổi và xác nhận khi có kênh tiếp nhận chính thức.", en: "Include your brand or organisation, product category, material goals, estimated volume and desired timing. If you are at the idea stage, simply describe what you want to explore. Pricing, minimum quantities and technical standards need discussion and confirmation once an official contact channel is available." },
    href: "/business/request-quote",
    link: { vi: "Khám phá hướng hợp tác", en: "Explore partnership directions" },
  },
  {
    question: { vi: "Lời nhắn của tôi có được gửi đi không?", en: "Will my message be sent?" },
    answer: { vi: "Chưa. Biểu mẫu hiện kiểm tra thông tin và tạo bản xem lại ngay trong trình duyệt. Nội dung không được gửi đến SenPine và không được lưu vào cơ sở dữ liệu hoặc bộ nhớ lưu trữ của trình duyệt. Khi tải lại hoặc rời trang, bản nháp sẽ mất. Vì chưa có kênh tiếp nhận chính thức, website cũng không cam kết thời gian phản hồi.", en: "Not yet. The form validates your details and creates a review in your browser. Your message is not sent to SenPine or stored in a database or browser storage. Reloading or leaving the page clears the draft. With no official receiving channel confirmed, the website does not promise a response time." },
  },
  {
    question: { vi: "Tôi có thể tìm hiểu hoặc trích dẫn đề án ở đâu?", en: "Where can I learn about or reference the project?" },
    answer: { vi: "Trang Về SenPine tập hợp câu chuyện thương hiệu, định hướng doanh nghiệp, mô hình B2B2C và lộ trình phát triển đề xuất. Đây là đề án nghiên cứu và khởi nghiệp của Nhóm 4, lớp DHTMDT20C, Khoa Quản trị Kinh doanh, Trường Đại học Công nghiệp Thành phố Hồ Chí Minh (IUH). Khi trích dẫn, cần phân biệt nội dung kế hoạch với kết quả đã được kiểm chứng.", en: "About SenPine brings together the brand story, business direction, B2B2C model and proposed development roadmap. This is a research and entrepreneurship project by Group 4, class DHTMDT20C, Faculty of Business Administration, Industrial University of Ho Chi Minh City (IUH). When referencing it, distinguish proposed plans from verified results." },
    href: "/about",
    link: { vi: "Đọc hồ sơ dự án", en: "Read the project profile" },
  },
] as const;
