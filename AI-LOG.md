# AI-LOG.md — PA#1 (CSC13114)

## 2026-10-22 — chọn đề tài (PA#1)
- Tool: ChatGPT.
- Asked for: gợi ý đề tài web có tính năng LLM, dữ liệu dễ lấy trên mạng; sau đó gợi ý đề tài gắn với đời sống hơn.
- Kept:
    - Dùng các thông báo thật ở TP.HCM làm dữ liệu đầu vào mẫu (thi công Metro số 2 trên Cách Mạng Tháng Tám, diễn tập chữa cháy ở Saigon Centre, phân luồng ngã tư Bảy Hiền).
    - Chia vai trò: LLM chỉ đọc và cấu trúc hóa thông báo; routing engine tính đường; admin duyệt trước khi quy tắc có hiệu lực.
    - Mỗi quy tắc lưu đoạn đường giữa hai giao lộ, chiều, loại xe, thời gian hiệu lực, ngoại lệ và URL nguồn, không chỉ tên đường.
    - Đánh giá trên 30–50 thông báo đã duyệt tay; các lỗi cần kiểm thử: đảo ngược chiều cấm, hiểu nhầm lệnh chỉ cấm ô tô thành cấm cả xe máy.
- Changed: chưa có.
- Rejected:
    - 5 đề tài về dev (DevTrace, CourseMap, ScholarshipCheck, IssuePilot, LocalLens): muốn đề tài gắn với đời sống.
    - 6 đề tài đời sống (ScamShield, FoodWise, LabelLens, RentCheck, LifeDocs, BillWise): không chọn, tự đưa ra ý tưởng khác.
    - Cổng thông tin Giao thông TP.HCM, cả vai trò nguồn dữ liệu lẫn đối thủ: trang đã lâu không cập nhật.
- By hand: ý tưởng RoadWise. Bản đồ hiển thị cấm đường và phân luồng, LLM đọc thông báo, người dùng hỏi đường A→B, admin duyệt và gỡ chỉ dẫn. Lý do: Google Maps cập nhật chậm, còn báo chí chỉ đăng ảnh graphic, không tìm đường được.

## 2026-10-22 — chọn routing (PA#1)
- Tool: ChatGPT.
- Asked for: có dùng được routing có sẵn hoặc của Google Maps không.
- Kept:
    - Không dùng Google Maps Routes API làm routing chính vì không truyền được danh sách đoạn cấm tùy ý.
    - Dùng OpenStreetMap + Leaflet + GraphHopper; làm PoC ngay checkpoint 1 để kiểm tra cấm theo chiều, loại xe và khung giờ.
    - Quy tắc nào engine chưa áp dụng được thì báo là chưa xác minh, không hiển thị như tuyến an toàn; nếu PoC thất bại thì thu hẹp khu vực hoặc loại quy tắc.
- Changed: chưa có.
- Rejected: chưa có.
- By hand: chưa có.

## 2026-10-22 — viết proposal (PA#1)
- Tool: ChatGPT.
- Asked for: viết proposal chính thức theo sườn rubric PA#1.
- Kept: toàn bộ bản tiếng Anh trong Project_PA/proposal.md (6 mục và success criteria); Gemini API làm model; React/TS, Node.js, PostgreSQL/PostGIS; 2 rủi ro; 6 checkpoint từ 26/10 đến 20/12, mỗi checkpoint có người phụ trách chính.
- Changed: bản đầu chia cứng (A làm LLM, B làm routing, C chỉ tích hợp). Đã yêu cầu viết lại để cả ba làm song song, mỗi người phụ trách chính một mảng và đổi mảng theo từng checkpoint.
- Rejected: chưa có.
- By hand: chưa có.

## 2026-10-22 — kế hoạch theo lịch môn (PA#1)
- Tool: Claude Code.
- Asked for: đối chiếu kế hoạch với syllabus và slide, tìm hạn project cuối.
- Kept:
    - 6 checkpoint là PA#1–PA#6 theo syllabus (22/10, 13/11, 27/11, 4/12, 11/12, oral), thay cho 6 giai đoạn tự đặt; mỗi mốc có một lead và việc của từng người.
    - Thêm phần môn yêu cầu mà plan cũ thiếu: CI chặn merge ở PA#2, observability và post-mortem ở PA#5.
    - Phân mảng tạm do AI chọn ngẫu nhiên: Quốc làm LLM và eval, Toàn làm bản đồ và routing, Tuấn làm backend, admin, CI, deploy (sẽ sửa lại sau).
- Changed: chưa có.
- Rejected: AI đề xuất bỏ hạn 20/12 vì không có trong tài liệu môn; giữ 20/12 làm hạn PA#5 (build cuối), vấn đáp PA#6 ngày 24/12.
- By hand: phân mảng (Quốc làm BE/LLM, Toàn làm FE/CI, Tuấn làm map/routing) thay cho bản chia ngẫu nhiên của AI.

## 2026-10-22 — tính năng LLM và cái giá khi sai (PA#1)
- Tool: Claude Code.
- Asked for: sửa mục 2 và 3 theo rubric và syllabus.
- Kept:
    - Bỏ natural-language query (là tính năng LLM thứ hai), đưa vào out-of-scope.
    - Cái giá khi sai theo 3 mức: đảo chiều (bị phạt, không hoàn tác), nhầm loại xe (đi vòng, hoàn tác được), sai thời gian hiệu lực.
    - Human gate chỉ ở bước kích hoạt rule, kèm lý do không đặt ở các bước khác; guardrail: JSON schema, trường bị gắn cờ thì không duyệt được, route checker.
    - Mục tiêu eval: 40 thông báo, chiều và loại xe đúng ≥ 95%, mọi thông báo mơ hồ được gắn cờ, 0 lộ trình đi qua rule đang hoạt động.
    - Câu nêu dữ liệu gửi ra ngoài: chỉ nội dung thông báo công khai.
- Changed: chưa có.
- Rejected: chưa có.
- By hand: kiểm tra mức phạt xe máy đi ngược chiều 4–6 triệu theo NĐ 168/2024.

## 2026-10-22 — người dùng, phạm vi và công nghệ (PA#1)
- Tool: Claude Code.
- Asked for: sửa mục 1, 3, 5, 6 và tra giá Gemini API hiện tại.
- Kept:
    - Người dùng cụ thể (Minh, đi xe máy từ Thủ Đức vào trung tâm lúc 7h) và cách họ xoay xở hiện nay.
    - Khu vực các phường thuộc Q.1, Q.3, Q.10 cũ; 4 nguồn (Công an TP.HCM, Trung tâm Báo chí TP.HCM, VnExpress, Tuổi Trẻ); thêm admin login và deploy vào scope.
    - Biện pháp rủi ro làm được ngay tuần này: gán nhãn 20 thông báo, PoC GraphHopper chặn một chiều CMT8 cho ô tô.
    - Model gemini-3.8-flash: free tier khi phát triển, eval trên paid tier ($0.75 / $3.75 mỗi 1M token tới 31/12/2026), ước tính khoảng $5; dự phòng gemini-3.5-flash-lite.
- Changed: chưa có.
- Rejected: chưa có.
- By hand: chưa có.
