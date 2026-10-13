# Daily Secret Mission
## Product Requirements Document (PRD) v1.0

- **Trạng thái:** Bản yêu cầu sản phẩm cho MVP
- **Ngôn ngữ:** Tiếng Việt
- **Phiên bản:** 1.0
- **Đối tượng triển khai ban đầu:** Một người phát triển, người sáng lập tự sử dụng và kiểm thử trước
- **Phạm vi tài liệu:** Mục tiêu, trải nghiệm, yêu cầu chức năng, quy tắc nghiệp vụ, tiêu chí nghiệm thu, quyền riêng tư và giới hạn MVP
- **Ngoài phạm vi tài liệu:** Kiến trúc hệ thống, lựa chọn công nghệ và thiết kế hạ tầng

---

## 1. Tóm tắt sản phẩm

**Daily Secret Mission** là ứng dụng học từ vựng tiếng Anh bằng cách chủ động sử dụng từ trong các tình huống của cuộc sống hằng ngày. Mỗi ngày, người dùng nhận một nhiệm vụ gồm các từ vựng mục tiêu, tự chọn tình huống phù hợp với trải nghiệm của mình, ghi âm bài nói và có thể viết nhật ký bổ sung. AI đánh giá cách sử dụng từ, giải thích lỗi, đề xuất cách diễn đạt tự nhiên hơn và theo dõi những từ người dùng cần luyện thêm.

Ứng dụng kết hợp ba trụ cột:

1. **Real-life learning:** học từ thông qua việc sử dụng từ trong ngữ cảnh cá nhân có ý nghĩa.
2. **Personal AI coach:** phản hồi chi tiết, theo dõi điểm yếu và cá nhân hóa nhiệm vụ theo dữ liệu học tập.
3. **Gamification:** XP, streak và cột mốc để hỗ trợ thói quen học đều đặn mà không đánh đồng điểm thưởng với năng lực thực tế.

### Tuyên bố giá trị

> Biến từ vựng thụ động thành khả năng sử dụng tiếng Anh trong cuộc sống hằng ngày, từng nhiệm vụ nhỏ một.

---

## 2. Vấn đề và cơ hội

Người học thường nhận biết từ khi đọc hoặc nghe nhưng khó chủ động nhớ và sử dụng từ khi nói. Việc học qua danh sách từ hoặc flashcard đơn thuần không phải lúc nào cũng tạo được cầu nối giữa kiến thức và giao tiếp thực tế.

Daily Secret Mission giải quyết vấn đề này bằng cách yêu cầu người dùng thử sử dụng từ trong ngữ cảnh của chính họ, nhận phản hồi cụ thể và gặp lại từ ở những lần luyện sau.

### Giả thuyết sản phẩm cần kiểm chứng

- Người dùng có thể duy trì một nhiệm vụ ngắn mỗi ngày.
- Việc tự tạo ngữ cảnh cá nhân giúp người dùng chủ động sử dụng từ tốt hơn.
- Phản hồi AI cụ thể giúp người dùng hiểu và sửa lỗi.
- Ôn tập dựa trên lịch sử sử dụng từ giúp cải thiện khả năng nhớ và vận dụng từ theo thời gian.
- XP và streak hỗ trợ duy trì thói quen mà không khuyến khích làm bài qua loa.

---

## 3. Mục tiêu và chỉ số thành công

### 3.1. Mục tiêu

1. Giúp người dùng sử dụng đúng và tự nhiên hơn các từ mục tiêu trong ngữ cảnh.
2. Tạo thói quen luyện tiếng Anh thường xuyên với khối lượng linh hoạt.
3. Phát hiện và ưu tiên những từ người dùng hay quên hoặc dùng sai.
4. Cung cấp phản hồi hữu ích, có giải thích và có thể hành động theo.
5. Đảm bảo người dùng kiểm soát được bài làm và dữ liệu cá nhân của mình.

### 3.2. Chỉ số cần theo dõi

- **Mission completion rate:** tỷ lệ nhiệm vụ được hoàn thành theo quy tắc.
- **Weekly active learning days:** số ngày có hoạt động học trong tuần.
- **Correct usage rate:** tỷ lệ lượt sử dụng từ được đánh giá là phù hợp.
- **Delayed retention:** khả năng sử dụng từ đúng ở một lần luyện sau khoảng thời gian trì hoãn.
- **Correction success rate:** tỷ lệ lỗi được cải thiện sau bước sửa.
- **Time to complete:** thời gian thực tế để hoàn thành nhiệm vụ.
- **AI feedback usefulness:** phản hồi của người dùng về tính hữu ích và độ chính xác của nhận xét AI.

Không coi tổng XP, số audio đã gửi hoặc streak đơn lẻ là bằng chứng đủ để kết luận năng lực từ vựng đã tăng.

Với giai đoạn tự thử nghiệm, người dùng có thể theo dõi các chỉ số này bằng một bảng thống kê đơn giản. Chưa đặt mục tiêu số học cứng cho đến khi có dữ liệu nền.

---

## 4. Người dùng mục tiêu và thiết lập ban đầu

### 4.1. Đối tượng MVP

Ban đầu, sản phẩm phục vụ người sáng lập tự sử dụng và kiểm thử. Sản phẩm cần đủ tổng quát để có thể mở rộng cho người học tiếng Anh khác sau này, nhưng không cần tính năng cộng đồng hoặc nhiều người dùng phức tạp trong MVP.

### 4.2. Thiết lập trình độ

- Người dùng tự chọn trình độ ban đầu hoặc mục tiêu học.
- Có bài đánh giá ngắn tùy chọn; hệ thống có thể khuyến nghị thực hiện nhưng không bắt buộc.
- Kết quả đánh giá ban đầu chỉ là ước lượng, không phải nhãn cố định.
- Hệ thống điều chỉnh lựa chọn từ theo kết quả luyện tập thực tế.
- Người dùng có thể thay đổi mục tiêu hoặc mức độ khó.
- Khi bằng chứng chưa đủ, hệ thống không tự tin khẳng định trình độ chính xác.

Các mức khởi đầu có thể dùng nhãn dễ hiểu như **Cơ bản, Trung cấp, Nâng cao**. Nếu sau này sử dụng CEFR, phải giải thích rằng mức đánh giá trong ứng dụng là ước lượng và không thay thế chứng chỉ chính thức.

---

## 5. Nguyên tắc sản phẩm

1. **Thực hành quan trọng hơn ghi nhớ thụ động.**
2. **Nỗ lực không đồng nghĩa với thành thạo.**
3. **Một lần dùng đúng không đủ để kết luận đã thành thạo từ.**
4. **AI phải thể hiện sự không chắc chắn khi thiếu bằng chứng.**
5. **Người dùng tự chọn ngữ cảnh và có quyền kiểm soát việc học.**
6. **Nhiệm vụ phải ngắn gọn, có thể hoàn thành trong đời sống bận rộn.**
7. **Phần thưởng không được khuyến khích spam hoặc lặp bài máy móc.**
8. **Dữ liệu cá nhân và nội dung ghi âm phải được bảo vệ, có chính sách rõ ràng.**

---

## 6. Phạm vi MVP

### 6.1. Bao gồm (Must-have)

- Thiết lập trình độ và mục tiêu học ban đầu.
- Chọn số từ mục tiêu mỗi ngày.
- Chọn chế độ thời lượng: Quick Mission, Daily Mission, Deep Practice.
- Nhận nhiệm vụ gồm từ mới, từ cần ôn và từ cá nhân phù hợp.
- Xem nghĩa, phát âm, ví dụ, collocation và cấu trúc dùng từ.
- Thêm từ/cụm từ cá nhân, chỉnh sửa và xóa từ đó.
- Tự chọn tình huống thực tế để luyện từ.
- Ghi âm, nghe lại, gửi bài và lưu bản nháp.
- Viết nhật ký bổ sung tùy chọn.
- Nhận phản hồi AI về cách dùng từ và lỗi chính.
- Sửa câu hoặc thực hiện bài luyện ngắn với từ chưa đạt.
- Theo dõi trạng thái từng từ và lịch sử luyện.
- Lịch ôn tập cơ bản.
- XP, streak, cột mốc và lịch sử nhiệm vụ.
- Xem và xóa bài làm/dữ liệu theo chính sách đã công bố.
- Hiển thị rõ khi AI chưa đủ dữ liệu để đánh giá.

### 6.2. Để sau MVP

- Thú cưng ảo, cửa hàng vật phẩm và nền kinh tế game.
- Bảng xếp hạng, thi đấu và tính năng xã hội.
- Chia sẻ bài nói công khai hoặc cộng đồng.
- Hội thoại giọng nói trực tiếp nhiều lượt với AI.
- Trích xuất từ tự động từ phim, video, trang web hoặc sách.
- Kế hoạch học dài hạn phức tạp do AI tự quản lý.
- Tạo và quản lý bộ từ vựng cộng đồng.
- Đánh giá phát âm ở mức chuyên sâu nếu chưa có phương pháp đáng tin cậy.
- Gói trả phí, quảng cáo hoặc cơ chế kiếm tiền.
- Đồng bộ đa thiết bị nâng cao và tính năng ngoại tuyến đầy đủ.

---

## 7. Luồng người dùng chính

### 7.1. Luồng bắt đầu

1. Người dùng mở ứng dụng.
2. Chọn trình độ tự đánh giá và mục tiêu.
3. Có thể làm bài đánh giá ngắn tùy chọn.
4. Chọn số từ mỗi ngày và thời lượng mong muốn.
5. Xem nhiệm vụ đầu tiên và hướng dẫn cách hoàn thành.

### 7.2. Luồng nhiệm vụ hằng ngày

1. Hệ thống chọn từ dựa trên lịch ôn, trạng thái từ, mục tiêu và sở thích.
2. Người dùng xem từ và thông tin cần thiết.
3. Người dùng tự chọn một tình huống từ cuộc sống hoặc chọn gợi ý.
4. Người dùng ghi âm bài nói; nhật ký văn bản là tùy chọn.
5. Người dùng nghe lại, lưu bản nháp hoặc gửi bài.
6. AI phân tích nội dung và đánh giá từng từ mục tiêu.
7. Với từ chưa đạt, người dùng xem giải thích và thực hiện bước sửa/luyện.
8. Hệ thống xác định nhiệm vụ đã hoàn thành theo quy tắc, cập nhật XP/streak và trạng thái từ.
9. Người dùng xem tóm tắt kết quả và các từ cần luyện lại.

### 7.3. Luồng thêm từ cá nhân

1. Người dùng nhập từ hoặc cụm từ.
2. Hệ thống tìm mục từ tương ứng trong kho hiện có.
3. Nếu từ đa nghĩa hoặc thiếu ngữ cảnh, yêu cầu người dùng chọn nghĩa mong muốn hoặc xác nhận thông tin.
4. Hệ thống hiển thị thông tin từ và cho phép người dùng chỉnh sửa.
5. Từ được thêm vào danh sách cá nhân.
6. Hệ thống đưa từ vào nhiệm vụ khi phù hợp; không bắt buộc dùng ngay trong ngày thêm.

### 7.4. Luồng ôn tập

1. Hệ thống xác định từ đến hạn, từ yếu và từ cần xác minh.
2. Ưu tiên các từ có nhu cầu ôn cao nhưng tránh tạo nhiệm vụ quá tải.
3. Người dùng sử dụng lại từ trong ngữ cảnh mới hoặc làm bài luyện ngắn.
4. Kết quả cập nhật lịch ôn và mức độ thành thạo.

---

## 8. Yêu cầu chức năng

### FR-01 — Hồ sơ học tập

Hệ thống phải cho phép người dùng thiết lập và chỉnh sửa trình độ tự đánh giá, mục tiêu, số từ/ngày, thời lượng mong muốn và múi giờ.

### FR-02 — Tạo nhiệm vụ

Hệ thống phải tạo nhiệm vụ theo số lượng từ người dùng chọn. Nhiệm vụ có thể bao gồm từ mới, từ cần ôn và từ cá nhân. Hệ thống phải tránh giao trùng cùng một mục từ trong cùng nhiệm vụ, trừ khi có chủ đích luyện các nghĩa khác nhau.

### FR-03 — Thông tin từ vựng

Mỗi từ cần có dữ liệu phù hợp gồm từ/cụm từ, nghĩa, từ loại, phát âm khi có, ví dụ, cấu trúc/collocation, chủ đề và mức độ khó. Không hiển thị thông tin chưa được xác minh như thể chắc chắn.

### FR-04 — Thực hành bằng audio

Người dùng phải có thể ghi âm, nghe lại, gửi bài và lưu bản nháp. Nếu ghi âm hoặc nhận diện lời nói gặp lỗi, người dùng phải được thông báo và có thể thử lại hoặc dùng phương thức nhập văn bản được hỗ trợ.

### FR-05 — Nhật ký tùy chọn

Người dùng có thể thêm văn bản bổ sung vào bài thực hành. Không được bắt buộc nhật ký để hoàn thành nhiệm vụ nếu bài audio đã đáp ứng điều kiện.

### FR-06 — Phản hồi AI

Với từng từ mục tiêu, hệ thống cần thể hiện một trong các trạng thái: dùng phù hợp, cần cải thiện, chưa sử dụng, hoặc chưa đủ bằng chứng. Phản hồi nên nêu bằng chứng/câu liên quan, giải thích ngắn gọn, đề xuất cách sửa và bước tiếp theo.

### FR-07 — Sửa và luyện lại

Người dùng phải có cách thử diễn đạt lại hoặc hoàn thành bài luyện có hướng dẫn đối với từ chưa đạt. Hệ thống không được bắt buộc người dùng đạt hoàn hảo sau số lần thử cố định để duy trì động lực; tuy nhiên, trạng thái từ phải phản ánh kết quả thực tế.

### FR-08 — Trạng thái từ vựng

Mỗi từ phải có trạng thái học tập riêng, độc lập với trạng thái nhiệm vụ. Các trạng thái đề xuất:
- New
- Learning
- Needs practice
- Proficient

Trạng thái có thể thay đổi theo bằng chứng mới; từ từng được đánh giá tốt vẫn có thể quay lại Needs practice.

### FR-09 — Ôn tập

Hệ thống phải lập lịch ôn và ưu tiên từ đến hạn hoặc thường dùng sai. Lịch khởi đầu đề xuất: 1, 3, 7 và 14 ngày, được điều chỉnh dựa trên kết quả. Đây là giá trị khởi tạo có thể cấu hình, không phải quy tắc học tập bất biến.

### FR-10 — Gamification

Hệ thống phải ghi nhận XP, streak và cột mốc. XP không được dùng thay cho trạng thái thành thạo. Việc gửi lại cùng một bài không được cấp lại phần thưởng hoàn thành.

### FR-11 — Lịch sử và tiến bộ

Người dùng phải xem được lịch sử nhiệm vụ, kết quả từng từ, từ cần luyện, tiến trình ôn tập và chuỗi ngày học.

### FR-12 — Quyền kiểm soát dữ liệu

Người dùng phải có khả năng xem và yêu cầu xóa bài làm, nhật ký, audio và dữ liệu học tập liên quan theo chính sách đã công bố.

---

## 9. Quy tắc nghiệp vụ

### BR-01 — Cấu hình số từ và thời lượng

- Các lựa chọn mặc định về số từ: 3 hoặc 5; có thể cho phép số lượng tùy chỉnh trong giới hạn sản phẩm.
- Thời lượng:
  - **Quick Mission:** 3–5 phút.
  - **Daily Mission:** khoảng 10 phút, là mặc định.
  - **Deep Practice:** 15–20 phút.
- Thời lượng là mục tiêu, không phải giới hạn cứng.
- Chế độ ngắn không được âm thầm bỏ qua từ mục tiêu. Hệ thống có thể chia nội dung thành câu ngắn hoặc bài luyện ngắn.

### BR-02 — Tỷ lệ nguồn từ

Tỷ lệ khởi đầu đề xuất:
- 60% từ mới.
- 30% từ cần ôn.
- 10% từ cá nhân.

Đây là tỷ lệ linh hoạt. Từ đến hạn ôn hoặc từ yếu có thể được ưu tiên hơn tỷ lệ mặc định. Nếu không có từ cá nhân phù hợp, vị trí đó có thể dành cho từ mới hoặc từ ôn.

### BR-03 — Tiêu chí một từ đã được thử

Một từ được coi là đã thử khi người dùng gửi nội dung hợp lệ thể hiện nỗ lực sử dụng từ trong ngữ cảnh. Chỉ đọc riêng từ, chèn từ vô nghĩa hoặc gửi nội dung không liên quan không được tính là nỗ lực hợp lệ.

### BR-04 — Đánh giá từ

- Dùng đúng trong ngữ cảnh: ghi nhận kết quả tốt của lần luyện.
- Dùng sai: giải thích lỗi và đưa ra bước luyện tiếp.
- Không sử dụng: đánh dấu chưa luyện.
- Audio/transcript không rõ: yêu cầu làm rõ hoặc ghi lại; không kết luận đúng/sai.
- AI không chắc chắn: hiển thị chưa đủ bằng chứng.
- Một lần sử dụng đúng không tự động khiến từ thành Proficient.

### BR-05 — Hoàn thành nhiệm vụ

Nhiệm vụ được hoàn thành khi:
1. Người dùng đã thử sử dụng tất cả từ mục tiêu trong nội dung hợp lệ.
2. AI đã đánh giá các từ có đủ bằng chứng.
3. Với từ chưa đạt, người dùng đã thực hiện ít nhất một bước luyện tập có hướng dẫn như sửa câu, diễn đạt lại hoặc hoàn thành bài luyện ngắn.
4. Những từ chưa đạt sau bước luyện được lưu để tiếp tục ôn; không yêu cầu thành thạo tất cả từ trong ngày.

Nếu có lỗi hệ thống khiến một từ không thể được đánh giá, nhiệm vụ không được đánh dấu thất bại do lỗi đó. Người dùng có thể thử lại hoặc dùng phương thức nhập khác.

### BR-06 — XP

Cấu hình khởi đầu đề xuất:
- +10 XP khi hoàn thành quy trình nhiệm vụ.
- +2 XP cho mỗi từ được luyện xong trong ngày.
- +2 XP cho mỗi lỗi được sửa thành công, với giới hạn thưởng cho cùng một lỗi.

Các mức trên là thông số thử nghiệm. Không cấp lại XP hoàn thành khi gửi lại cùng một bài. Không giới hạn việc luyện chỉ vì người dùng đã hết lượt nhận thưởng. XP không phải điểm đánh giá năng lực.

### BR-07 — Streak

- Streak tăng tối đa một lần trong mỗi ngày theo múi giờ tài khoản khi nhiệm vụ đáp ứng BR-05.
- Nhiều nhiệm vụ cùng ngày không làm streak tăng nhiều lần.
- Sửa bài sau khi đã hoàn thành không làm mất streak.
- Bỏ lỡ ngày không xóa lịch sử hoặc trạng thái từ.
- MVP chưa có cơ chế mua hoặc dùng vật phẩm bảo vệ streak.

### BR-08 — Nhiệm vụ qua ngày

- Bản nháp và nhiệm vụ dở dang được giữ lại theo chính sách lưu trữ.
- Người dùng có thể tiếp tục nhiệm vụ cũ.
- Khi qua ngày mới, từ chưa luyện xong được đưa vào hàng đợi ôn tập.
- Không tự động cấp streak cho ngày cũ nếu người dùng chỉ hoàn thành vào ngày khác, trừ khi có quy tắc sản phẩm được công bố rõ ràng.

### BR-09 — Mức độ thành thạo

Trạng thái Proficient cần dựa trên nhiều bằng chứng qua thời gian, tốt nhất gồm nhiều ngày và ngữ cảnh. Một điểm AI hoặc một lần dùng đúng không đủ. Hệ thống cần có khả năng hạ trạng thái nếu các lần sau cho thấy người dùng quên hoặc dùng sai.

### BR-10 — Gợi ý tình huống

Người dùng tự chọn tình huống. AI có thể đưa ra câu hỏi gợi mở hoặc ví dụ khi người dùng bí ý tưởng nhưng không nên mặc định cung cấp toàn bộ đoạn văn để người dùng chỉ đọc lại như bài của mình.

### BR-11 — Từ cá nhân

- Người dùng có thể thêm, sửa và xóa từ/cụm từ.
- Hệ thống tìm mục từ trùng trước khi tạo mục mới.
- Với từ đa nghĩa, cần giữ nghĩa/ngữ cảnh người dùng muốn học.
- Từ thiếu dữ liệu tin cậy phải được xác minh trước khi đưa vào nhiệm vụ chính.
- Từ cá nhân tuân theo cùng quy tắc đánh giá và ôn tập.

### BR-12 — Đánh giá giọng nói

Đánh giá cách dùng từ, ngữ pháp và độ tự nhiên phải được tách khỏi đánh giá phát âm. Transcript không đủ để kết luận chính xác về phát âm. Nếu chưa có bằng chứng âm thanh đáng tin cậy, hệ thống không được tuyên bố đã đánh giá phát âm chính xác.

---

## 10. Tiêu chí nghiệm thu (Acceptance Criteria)

### AC-01 — Thiết lập

**Given** người dùng lần đầu mở ứng dụng,  
**When** họ chọn trình độ và cấu hình số từ/thời lượng,  
**Then** hệ thống lưu lựa chọn và tạo nhiệm vụ phù hợp mà không bắt buộc làm bài kiểm tra đầu vào.

### AC-02 — Tạo nhiệm vụ

**Given** người dùng chọn 5 từ,  
**When** nhiệm vụ được tạo,  
**Then** nhiệm vụ có 5 mục từ mục tiêu hợp lệ, không trùng lặp ngoài chủ đích, và thể hiện rõ từ mới/từ ôn/từ cá nhân khi thích hợp.

### AC-03 — Thiếu từ cá nhân phù hợp

**Given** hệ thống không có từ cá nhân phù hợp cho nhiệm vụ,  
**When** tạo nhiệm vụ,  
**Then** hệ thống thay thế bằng từ mới hoặc từ cần ôn, không tạo từ không phù hợp chỉ để đủ tỷ lệ.

### AC-04 — Bỏ sót từ

**Given** nhiệm vụ có 5 từ nhưng bài làm chỉ thử 3 từ,  
**When** AI đánh giá bài,  
**Then** hai từ chưa dùng được đánh dấu chưa luyện và nhiệm vụ chưa hoàn thành.

### AC-05 — Dùng sai từ

**Given** người dùng đã thử dùng một từ nhưng dùng sai cấu trúc,  
**When** AI phản hồi,  
**Then** phản hồi xác định lỗi, đưa ra cách sửa và một bước luyện có hướng dẫn; từ đó không được tự động đánh dấu Proficient.

### AC-06 — Sửa lỗi thành công

**Given** người dùng diễn đạt lại và sửa đúng lỗi,  
**When** hệ thống đánh giá lần sửa,  
**Then** ghi nhận kết quả sửa và có thể cấp XP sửa lỗi nếu đủ điều kiện; không cấp lại XP hoàn thành nhiệm vụ.

### AC-07 — Chưa thành thạo

**Given** người dùng đã thực hiện bước luyện có hướng dẫn cho mọi từ nhưng một từ vẫn chưa đạt,  
**When** nhiệm vụ được tổng kết,  
**Then** nhiệm vụ có thể hoàn thành, từ đó vẫn ở trạng thái cần luyện và được lên lịch ôn lại.

### AC-08 — Không đủ bằng chứng

**Given** audio không rõ hoặc AI không thể xác định cách dùng từ đáng tin cậy,  
**When** tạo kết quả đánh giá,  
**Then** hệ thống hiển thị chưa đủ bằng chứng và cho phép ghi âm lại hoặc dùng phương thức thay thế; không tự động đánh dấu đúng/sai.

### AC-09 — XP chống lặp

**Given** một nhiệm vụ đã được thưởng XP hoàn thành,  
**When** người dùng gửi lại cùng bài hoặc thử gửi lặp,  
**Then** hệ thống không cấp lại XP hoàn thành cho cùng nhiệm vụ.

### AC-10 — Streak

**Given** người dùng hoàn thành một nhiệm vụ hợp lệ trong ngày theo múi giờ tài khoản,  
**When** nhiệm vụ được xác nhận hoàn thành,  
**Then** streak tăng tối đa một lần cho ngày đó, bất kể số nhiệm vụ hoàn thành.

### AC-11 — Nhiệm vụ qua ngày

**Given** người dùng bỏ dở nhiệm vụ và sang ngày mới,  
**When** họ mở ứng dụng,  
**Then** có thể tiếp tục bản nháp; từ chưa luyện được giữ lại trong hàng đợi ôn tập và không bị xóa.

### AC-12 — Từ cá nhân đa nghĩa

**Given** người dùng thêm một từ có nhiều nghĩa,  
**When** ngữ cảnh chưa đủ để xác định nghĩa,  
**Then** hệ thống hỏi người dùng chọn nghĩa hoặc xác nhận trước khi sử dụng từ trong nhiệm vụ.

### AC-13 — Trạng thái thành thạo

**Given** người dùng sử dụng một từ đúng một lần,  
**When** hệ thống cập nhật tiến trình,  
**Then** ghi nhận lần sử dụng tốt nhưng không tự động kết luận từ đã thành thạo.

### AC-14 — Xóa dữ liệu

**Given** người dùng yêu cầu xóa một bài làm,  
**When** thao tác xóa hoàn tất,  
**Then** bài làm và dữ liệu liên quan được xử lý theo chính sách xóa đã công bố; giao diện không tiếp tục hiển thị dữ liệu như thể vẫn còn nguyên.

---

## 11. Quyền riêng tư và quản lý dữ liệu

### 11.1. Dữ liệu có thể được xử lý

- Hồ sơ học tập và mục tiêu.
- Từ vựng cá nhân và trạng thái học.
- Audio, transcript và nhật ký do người dùng gửi.
- Phản hồi AI, kết quả từng từ và lịch sử nhiệm vụ.
- XP, streak và tiến trình.

### 11.2. Nguyên tắc

1. Nội dung audio, transcript và nhật ký mặc định là riêng tư.
2. Chỉ thu thập và giữ dữ liệu cần thiết để cung cấp chức năng đã công bố.
3. Trước khi triển khai, phải công bố rõ audio được lưu bao lâu, transcript có được lưu không, nhà cung cấp AI nào có thể xử lý dữ liệu và mục đích xử lý.
4. Không mặc định sử dụng nội dung cá nhân để huấn luyện hoặc cải thiện mô hình ngoài mục đích cung cấp dịch vụ. Nếu có mục đích sử dụng bổ sung, phải có thông báo và cơ chế lựa chọn phù hợp.
5. Cho phép người dùng xem và xóa nội dung bài làm, nhật ký, audio và dữ liệu học tập liên quan theo phạm vi được công bố.
6. Không đưa nội dung riêng tư lên hồ sơ công khai hoặc chia sẻ với người dùng khác trong MVP.
7. Tránh đưa thông tin nhận dạng cá nhân không cần thiết vào lời nhắc gửi cho AI.
8. Khi dữ liệu được xử lý bởi dịch vụ bên ngoài, phải công bố điều đó và áp dụng các biện pháp bảo vệ phù hợp.
9. Chính sách lưu trữ, xóa, sao lưu và xử lý dữ liệu của nhà cung cấp phải được xem xét trước khi phát hành.

### 11.3. Các quyết định quyền riêng tư cần hoàn tất trước khi phát hành

- Thời hạn lưu audio gốc.
- Có giữ transcript sau khi đánh giá hay không.
- Thời hạn lưu nhật ký và phản hồi AI.
- Quy trình xóa dữ liệu và xử lý bản sao lưu.
- Phạm vi dữ liệu được gửi đến nhà cung cấp AI.
- Cơ chế xin phép nếu muốn dùng dữ liệu cho mục đích ngoài cung cấp dịch vụ.

Không coi các quyết định này là mặc định đã được hoàn thành chỉ vì chúng xuất hiện trong PRD.

---

## 12. Ngoài phạm vi

MVP không nhằm mục tiêu:

- Thay thế khóa học tiếng Anh toàn diện hoặc chứng chỉ đánh giá chuẩn hóa.
- Đảm bảo người dùng thành thạo một từ sau số lần luyện cố định.
- Tự động chứng minh mọi tình huống ghi âm đều xảy ra ngoài đời thực.
- Cung cấp đánh giá phát âm chuyên gia nếu chưa có phương pháp đáng tin cậy.
- Xây dựng mạng xã hội, thi đấu hoặc chia sẻ công khai.
- Có nền kinh tế game phức tạp hoặc vật phẩm trả phí.
- Tự động phân tích mọi nguồn nội dung trên Internet.
- Thay thế người hướng dẫn hoặc giáo viên trong các tình huống cần đánh giá chuyên môn.

---

## 13. Rủi ro sản phẩm và cách giảm thiểu

| Rủi ro | Hướng xử lý |
|---|---|
| AI đánh giá sai | Hiển thị bằng chứng, hỗ trợ sửa/đánh giá lại và trạng thái chưa đủ bằng chứng |
| Người dùng đọc câu mẫu thay vì chủ động dùng từ | Gợi ý bằng câu hỏi, không cung cấp sẵn toàn bộ bài như cách duy nhất để hoàn thành |
| Nhiệm vụ quá dài | Chế độ linh hoạt, lưu bản nháp và cho phép chia nhỏ bài luyện |
| XP bị lạm dụng | Chống thưởng lặp, giới hạn thưởng theo hành động và không dùng XP làm thước đo thành thạo |
| Từ mới quá khó hoặc không hữu ích | Dùng kho từ có cấu trúc, mức độ khó và phản hồi của người học |
| Từ cá nhân có nghĩa sai | Xác minh nghĩa/ngữ cảnh và cho người dùng chỉnh sửa |
| Quá tải từ ôn tập | Ưu tiên từ quan trọng, giới hạn khối lượng mỗi ngày và giữ hàng đợi quá hạn |
| Lộ dữ liệu riêng tư | Giảm thiểu dữ liệu, công bố chính sách, kiểm soát truy cập và hỗ trợ xóa |

---

## 14. Các giả định và thông số có thể điều chỉnh

Những giá trị sau là điểm khởi đầu, không phải cam kết bất biến:

- Thời lượng mặc định khoảng 10 phút.
- Quick Mission 3–5 phút; Deep Practice 15–20 phút.
- Tỷ lệ nguồn từ ban đầu 60% mới, 30% ôn, 10% cá nhân.
- Lịch ôn khởi đầu 1, 3, 7 và 14 ngày.
- XP hoàn thành nhiệm vụ +10; luyện xong mỗi từ +2; sửa lỗi thành công +2 với giới hạn thưởng.
- Ngưỡng và quy tắc xác định Proficient.
- Mức độ chi tiết của phản hồi AI và số bước sửa được đề xuất.

Mọi thay đổi cần dựa trên dữ liệu sử dụng, chất lượng học tập và phản hồi của người dùng; không nên tối ưu chỉ để tăng thời gian dùng ứng dụng hoặc số lần mở ứng dụng.

---

## 15. Tiêu chí sẵn sàng chuyển sang thiết kế kiến trúc

Có thể bắt đầu thảo luận kiến trúc sau khi nhóm phát triển chấp nhận rằng:

1. Phạm vi MVP và tính năng ngoài phạm vi đã rõ.
2. Quy tắc hoàn thành nhiệm vụ, XP và streak đã được định nghĩa.
3. Trạng thái nhiệm vụ được tách khỏi trạng thái thành thạo từ.
4. Cách chọn từ và ôn tập có quy tắc khởi đầu rõ ràng.
5. Phản hồi AI có trạng thái chưa đủ bằng chứng và hỗ trợ sửa lỗi.
6. Các quyết định về audio, transcript, nhật ký và xóa dữ liệu được hoàn tất trước khi phát hành.
7. Các tiêu chí nghiệm thu trong tài liệu có thể chuyển thành test case.

---

## 16. Tóm tắt quyết định v1.0

- **Định vị:** Học từ vựng bằng cách sử dụng trong cuộc sống thật, có AI cá nhân hóa và gamification.
- **Người dùng ban đầu:** Người sáng lập tự sử dụng và kiểm thử.
- **Tình huống luyện:** Người dùng tự chọn; AI có thể gợi ý.
- **Phương thức chính:** Ghi âm; nhật ký là tùy chọn.
- **Nguồn từ:** Kho từ vựng có cấu trúc + AI cá nhân hóa + từ do người dùng thêm.
- **Trình độ:** Người dùng tự chọn; đánh giá ngắn tùy chọn; điều chỉnh theo dữ liệu thực tế.
- **Thời lượng:** Linh hoạt; mặc định khoảng 10 phút.
- **Hoàn thành:** Thử tất cả từ và thực hiện bước luyện có hướng dẫn với từ chưa đạt; không yêu cầu thành thạo tất cả từ.
- **XP/streak:** Thưởng cho quy trình học và tiến bộ; streak dựa trên ngày hoàn thành nhiệm vụ.
- **Ôn tập:** Lịch ban đầu 1, 3, 7, 14 ngày, điều chỉnh theo kết quả.
- **Quyền riêng tư:** Nội dung riêng tư, dữ liệu được công bố minh bạch, có quyền xem và xóa.
- **Chưa quyết định:** Kiến trúc hệ thống, tech stack, chính sách lưu audio chi tiết và một số ngưỡng cá nhân hóa cần thử nghiệm.

**Kết luận:** Daily Secret Mission MVP nên tập trung chứng minh một vòng lặp có giá trị: nhận từ → sử dụng trong ngữ cảnh cá nhân → nhận phản hồi → sửa/luyện → gặp lại từ sau một khoảng thời gian. Những tính năng game nâng cao chỉ nên được bổ sung khi vòng lặp học tập cốt lõi hoạt động tốt.
