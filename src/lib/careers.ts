export type CareerLanguage = "vi" | "en";
type Copy = { vi: string; en: string };
export const careerDepartments = [
  { id: "research", vi: "R&D – Công nghệ", en: "R&D & Technology" },
  { id: "production", vi: "Sản xuất – QC", en: "Production & Quality" },
  { id: "commercial", vi: "Kinh doanh", en: "Sales" },
  { id: "marketing", vi: "Marketing", en: "Marketing" },
  { id: "design", vi: "Thiết kế sản phẩm", en: "Product Design" },
  { id: "finance", vi: "Tài chính – Kế toán", en: "Finance & Accounting" },
  { id: "logistics", vi: "Kho – Logistics", en: "Warehouse & Logistics" },
] as const;

export interface CareerJob {
  slug: string;
  code: string;
  department: typeof careerDepartments[number]["id"];
  salary: number;
  title: Copy;
  summary: Copy;
  experience: Copy;
  duties: { vi: string[]; en: string[] };
  requirements: { vi: string[]; en: string[] };
  portfolio: Copy;
}

// Department budgets come from section 2.7.1 of the project report.
// These job descriptions are proposed roles, not confirmed active vacancies.
export const careerJobs: CareerJob[] = [
  {
    slug: "chuyen-vien-rd-vat-lieu", code: "SP-RD-01", department: "research", salary: 14500000,
    title: { vi: "Chuyên viên R&D vật liệu", en: "Textile R&D Specialist" },
    summary: { vi: "Từ xơ dứa và tơ sen đến một mẫu vải mới. Nghiên cứu nguồn sợi, thử nghiệm phối trộn và chuẩn hóa dữ liệu vật liệu.", en: "Turn pineapple and lotus fibres into new textile samples through research, blend trials and documented material data." },
    experience: { vi: "Ưu tiên có kinh nghiệm nghiên cứu", en: "Research experience preferred" },
    duties: { vi: ["Nghiên cứu đặc tính xơ dứa, tơ sen và phương án xử lý nguyên liệu.", "Thiết kế thử nghiệm phối trộn; ghi nhận kết quả, so sánh chất lượng mẫu sợi và vải.", "Phối hợp với sản xuất và QC để đánh giá khả năng ứng dụng, giảm hao hụt và cải tiến quy trình.", "Lập hồ sơ thử nghiệm, quản lý mẫu và báo cáo tiến độ nghiên cứu."], en: ["Study pineapple and lotus fibre properties and processing approaches.", "Plan blend trials and document yarn and fabric sample quality.", "Collaborate with production and QC on feasibility, waste reduction and process improvements.", "Maintain test records, samples and research progress reports."] },
    requirements: { vi: ["Nền tảng công nghệ dệt may, vật liệu, hóa học hoặc lĩnh vực liên quan.", "Có khả năng đọc tài liệu kỹ thuật, thiết kế thử nghiệm và phân tích dữ liệu.", "Cẩn thận trong ghi chép, tuân thủ an toàn và làm việc theo phương pháp.", "Quan tâm đến vật liệu thực vật và chủ động phối hợp giữa các bộ phận."], en: ["Background in textile technology, materials, chemistry or a related field.", "Ability to read technical documents, plan experiments and analyse data.", "Careful documentation, safe practice and a methodical approach.", "Interest in botanical materials and cross-functional collaboration."] },
    portfolio: { vi: "CV và tóm tắt một đề tài, thí nghiệm hoặc dự án vật liệu từng tham gia.", en: "CV and a summary of a research, experiment or materials project." },
  },
  {
    slug: "nhan-vien-san-xuat-qc", code: "SP-QC-02", department: "production", salary: 8000000,
    title: { vi: "Nhân viên sản xuất & QC", en: "Production & QC Associate" },
    summary: { vi: "Theo sát từng công đoạn, kiểm soát chất lượng sợi và vải, cùng xây dựng một quy trình sản xuất có trách nhiệm.", en: "Follow each production stage, inspect fibre and fabric quality and help build a responsible process." },
    experience: { vi: "Có thể đào tạo theo công việc", en: "Role-based training considered" },
    duties: { vi: ["Thực hiện sơ chế, xử lý xơ và các công đoạn được phân công theo hướng dẫn vận hành.", "Kiểm tra nguyên liệu, bán thành phẩm và thành phẩm theo tiêu chí chất lượng.", "Ghi nhận lỗi, hao hụt, sản lượng và báo cáo bất thường cho người phụ trách.", "Giữ gìn thiết bị, khu vực làm việc và tuân thủ quy trình an toàn."], en: ["Carry out assigned fibre preparation and processing tasks following operating instructions.", "Inspect raw materials, work in progress and finished products against quality criteria.", "Record defects, waste and output, and report deviations.", "Maintain equipment and the workspace and follow safety procedures."] },
    requirements: { vi: ["Cẩn thận, có tinh thần trách nhiệm và khả năng làm việc theo quy trình.", "Có thể đọc, ghi nhận thông số và sử dụng biểu mẫu kiểm tra.", "Ưu tiên nền tảng dệt may, vận hành máy hoặc kiểm tra chất lượng.", "Sẵn sàng học thao tác thiết bị và phối hợp trong nhóm sản xuất."], en: ["A careful, responsible approach and ability to follow procedures.", "Ability to read specifications and complete inspection records.", "Textile, machine operation or quality inspection experience is a plus.", "Willingness to learn equipment operation and work in a production team."] },
    portfolio: { vi: "CV mô tả kinh nghiệm vận hành, sản xuất hoặc kiểm tra chất lượng nếu có.", en: "CV describing any production, equipment or quality inspection experience." },
  },
  {
    slug: "chuyen-vien-kinh-doanh-b2b", code: "SP-BD-03", department: "commercial", salary: 11000000,
    title: { vi: "Chuyên viên kinh doanh B2B", en: "B2B Sales Specialist" },
    summary: { vi: "Kết nối chất liệu với nhà thiết kế và thương hiệu. Tìm hiểu nhu cầu, giới thiệu mẫu và phát triển quan hệ khách hàng.", en: "Connect materials with designers and brands through customer discovery, sample introductions and account development." },
    experience: { vi: "Ưu tiên kinh nghiệm bán hàng B2B", en: "B2B sales experience preferred" },
    duties: { vi: ["Tìm kiếm và tiếp cận khách hàng trong lĩnh vực thời trang, dệt may và thiết kế.", "Tổng hợp nhu cầu vật liệu, phối hợp giới thiệu mẫu và chuẩn bị phương án báo giá.", "Theo dõi quá trình trao đổi, đơn hàng, giao nhận và công nợ cùng các bộ phận liên quan.", "Duy trì hồ sơ khách hàng, phản hồi và báo cáo kết quả kinh doanh."], en: ["Research and approach fashion, textile and design customers.", "Collect material requirements and coordinate samples and quotation proposals.", "Follow discussions, orders, deliveries and receivables with relevant teams.", "Maintain customer records, feedback and sales reports."] },
    requirements: { vi: ["Giao tiếp rõ ràng, biết lắng nghe và trình bày giải pháp theo nhu cầu khách hàng.", "Có kỹ năng quản lý thông tin, theo dõi công việc và sử dụng công cụ văn phòng.", "Ưu tiên kinh nghiệm kinh doanh vật liệu, dệt may hoặc thời trang.", "Trung thực trong tư vấn và chủ động học đặc tính sản phẩm."], en: ["Clear communication, active listening and needs-based presentation skills.", "Organised records, reliable follow-up and proficiency with office tools.", "Experience in textile, fashion or materials sales is a plus.", "Honest advice and willingness to learn product properties."] },
    portfolio: { vi: "CV và ví dụ về một dự án bán hàng hoặc phát triển khách hàng đã thực hiện.", en: "CV and an example of a sales or customer development project." },
  },
  {
    slug: "chuyen-vien-noi-dung-marketing", code: "SP-MK-04", department: "marketing", salary: 9500000,
    title: { vi: "Chuyên viên nội dung & Marketing", en: "Content & Marketing Specialist" },
    summary: { vi: "Kể câu chuyện vật liệu bằng nội dung có cơ sở. Xây dựng nhận diện và đưa SenPine đến gần cộng đồng.", en: "Tell evidence-based material stories, shape the brand and bring SenPine closer to its community." },
    experience: { vi: "Ưu tiên có portfolio nội dung", en: "Content portfolio preferred" },
    duties: { vi: ["Lên kế hoạch và sản xuất nội dung cho website, mạng xã hội và tài liệu thương hiệu.", "Phối hợp với R&D để kiểm chứng thông tin vật liệu trước khi truyền thông.", "Hỗ trợ chiến dịch giới thiệu mẫu, sự kiện và hoạt động tiếp cận khách hàng.", "Theo dõi hiệu quả nội dung, tổng hợp phản hồi và đề xuất cải tiến."], en: ["Plan and produce website, social and brand content.", "Verify material claims with R&D before publication.", "Support sample launches, events and customer outreach.", "Track content results, collect feedback and recommend improvements."] },
    requirements: { vi: ["Viết tiếng Việt rõ ràng, có khả năng biên tập và tổ chức câu chuyện.", "Biết sử dụng công cụ thiết kế, quản lý nội dung hoặc phân tích cơ bản.", "Có tư duy kiểm chứng thông tin, tránh truyền thông vượt quá dữ liệu thực tế.", "Quan tâm tới thời trang, thiết kế và phát triển bền vững."], en: ["Strong writing, editing and storytelling skills.", "Familiarity with design, content management or basic analytics tools.", "An evidence-first approach to communication.", "Interest in fashion, design and sustainability."] },
    portfolio: { vi: "CV và đường dẫn portfolio gồm bài viết, chiến dịch hoặc sản phẩm truyền thông.", en: "CV and a portfolio of writing, campaigns or communication work." },
  },
  {
    slug: "nhan-vien-thiet-ke-san-pham", code: "SP-DS-05", department: "design", salary: 9500000,
    title: { vi: "Nhân viên thiết kế sản phẩm", en: "Product Designer" },
    summary: { vi: "Đưa chất liệu thực vật vào áo, váy và phụ kiện. Phát triển phom dáng, chi tiết và mẫu thử cho đời sống thường ngày.", en: "Bring botanical textiles into apparel and accessories through silhouettes, considered details and prototypes." },
    experience: { vi: "Ưu tiên có portfolio thiết kế", en: "Design portfolio preferred" },
    duties: { vi: ["Nghiên cứu ứng dụng của từng dòng vật liệu và phát triển ý tưởng thiết kế.", "Chuẩn bị bản vẽ, bảng thông số, lựa chọn chi tiết và hồ sơ mẫu.", "Phối hợp làm mẫu, thử phom và điều chỉnh thiết kế theo phản hồi.", "Theo dõi tính khả thi sản xuất và giữ sự nhất quán với nhận diện SenPine."], en: ["Research material applications and develop design concepts.", "Prepare drawings, specifications, details and sample documentation.", "Coordinate prototypes, fittings and revisions.", "Assess production feasibility and maintain the SenPine design identity."] },
    requirements: { vi: ["Nền tảng thiết kế thời trang, sản phẩm hoặc lĩnh vực liên quan.", "Hiểu cơ bản về phom, cấu trúc may và đặc tính vải.", "Có khả năng trình bày ý tưởng bằng bản vẽ hoặc công cụ thiết kế.", "Portfolio thể hiện quá trình từ ý tưởng đến mẫu hoặc sản phẩm hoàn thiện."], en: ["Background in fashion, product design or a related field.", "Understanding of silhouettes, garment construction and fabric properties.", "Ability to communicate concepts through drawings or design tools.", "A portfolio showing the journey from concept to prototype or finished work."] },
    portfolio: { vi: "CV và portfolio thiết kế; ưu tiên có bản vẽ kỹ thuật hoặc hình ảnh mẫu thử.", en: "CV and design portfolio, ideally including technical drawings or prototypes." },
  },
  {
    slug: "nhan-vien-tai-chinh-ke-toan", code: "SP-FN-06", department: "finance", salary: 9500000,
    title: { vi: "Nhân viên tài chính – kế toán", en: "Finance & Accounting Associate" },
    summary: { vi: "Giữ dữ liệu tài chính rõ ràng, theo dõi chi phí và hỗ trợ xây dựng nền tảng vận hành cho doanh nghiệp.", en: "Maintain clear financial records, track costs and support the business operating foundation." },
    experience: { vi: "Ưu tiên kinh nghiệm kế toán", en: "Accounting experience preferred" },
    duties: { vi: ["Kiểm tra và ghi nhận chứng từ thu chi, doanh thu, chi phí và công nợ.", "Đối chiếu dữ liệu với kinh doanh, kho và sản xuất.", "Hỗ trợ lập ngân sách, tính chi phí và báo cáo theo kỳ.", "Lưu trữ hồ sơ, giữ bảo mật dữ liệu và phối hợp xử lý sai lệch."], en: ["Review and record receipts, payments, revenue, costs and receivables.", "Reconcile records with sales, warehouse and production teams.", "Support budgeting, costing and periodic reports.", "Maintain documents, protect data and resolve discrepancies."] },
    requirements: { vi: ["Nền tảng kế toán, tài chính hoặc chuyên ngành liên quan.", "Sử dụng tốt bảng tính và có khả năng đối chiếu dữ liệu.", "Cẩn thận, trung thực và bảo mật thông tin.", "Ưu tiên hiểu chi phí sản xuất, tồn kho và nghiệp vụ doanh nghiệp."], en: ["Background in accounting, finance or a related discipline.", "Strong spreadsheet and data reconciliation skills.", "Accuracy, integrity and confidentiality.", "Understanding of production costing, stock and business accounting is a plus."] },
    portfolio: { vi: "CV mô tả nghiệp vụ, công cụ kế toán và kinh nghiệm liên quan.", en: "CV detailing relevant accounting tasks, tools and experience." },
  },
  {
    slug: "nhan-vien-kho-logistics", code: "SP-LG-07", department: "logistics", salary: 9000000,
    title: { vi: "Nhân viên kho & Logistics", en: "Warehouse & Logistics Associate" },
    summary: { vi: "Theo dõi dòng nguyên liệu và thành phẩm. Quản lý tồn kho, bảo quản sợi vải và phối hợp giao nhận.", en: "Track raw materials and finished goods through stock control, textile storage and delivery coordination." },
    experience: { vi: "Ưu tiên kinh nghiệm kho vận", en: "Warehouse experience preferred" },
    duties: { vi: ["Tiếp nhận, kiểm đếm và cập nhật hồ sơ nhập – xuất – tồn.", "Sắp xếp và bảo quản nguyên liệu, mẫu và thành phẩm theo yêu cầu.", "Chuẩn bị đóng gói, chứng từ và phối hợp lịch giao nhận.", "Đối chiếu tồn kho, phát hiện sai lệch và hỗ trợ truy xuất lô hàng."], en: ["Receive and count goods and maintain stock movement records.", "Organise and store materials, samples and finished goods appropriately.", "Prepare packaging and documents and coordinate deliveries.", "Reconcile stock, identify discrepancies and support batch traceability."] },
    requirements: { vi: ["Có khả năng kiểm đếm, ghi chép và làm việc theo quy trình.", "Biết sử dụng bảng tính hoặc công cụ quản lý kho.", "Cẩn thận trong bảo quản hàng hóa và phối hợp giao nhận.", "Ưu tiên kinh nghiệm kho nguyên liệu, dệt may hoặc logistics."], en: ["Reliable counting, record keeping and process-following skills.", "Familiarity with spreadsheets or warehouse tools.", "Careful storage practice and delivery coordination.", "Raw material, textile warehouse or logistics experience is a plus."] },
    portfolio: { vi: "CV mô tả công việc kho, giao nhận hoặc quản lý tồn kho đã thực hiện.", en: "CV describing warehouse, delivery or inventory experience." },
  },
];

export const careerLocation = { vi: "Cần Thơ · địa điểm dự kiến", en: "Can Tho · planned location" };
export function careerSalary(amount: number, lang: CareerLanguage) {
  return new Intl.NumberFormat(lang === "vi" ? "vi-VN" : "en-US").format(amount) + " ₫";
}
export function normalizeCareerSearch(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().trim();
}
