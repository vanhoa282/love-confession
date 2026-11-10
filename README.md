# 💖 Trang Web Tỏ Tình Lãng Mạn (Romantic Love Confession)

Một trang web tỏ tình được thiết kế chỉn chu, tinh tế và lãng mạn nhất với phong cách **Glassmorphism Cyber-Romantic**, hiệu ứng sao băng lung linh, phong thư 3D mở nắp, nhạc piano lofi du dương tự động và pháo hoa rực rỡ khi người ấy đồng ý.

---

## ✨ Điểm Nổi Bật & Tính Năng Độc Đáo

1. **💌 Màn Mở Đầu - Phong Thư Bí Mật 3D:**
   - Phong thư cổ điển sang trọng với con dấu sáp niêm phong phát sáng.
   - Khi chạm vào, phong thư mở nắp với hiệu ứng âm thanh mở giấy và giải phóng chùm tim ma thuật.
   - Tự động kích hoạt giai điệu âm nhạc êm dịu mà không bị trình duyệt chặn phát tự động.

2. **🌌 Bầu Trời Sao & Trái Tim Bay (Canvas 60FPS):**
   - Hơn 200 ngôi sao lấp lánh phản hồi chuyển động con trỏ chuột (hiệu ứng Parallax).
   - Sao băng (meteors) thỉnh thoảng xé ngang bầu trời đêm.
   - Vệt sáng bụi tiên (fairy dust) và trái tim lung linh đi theo cử chỉ rê chuột hoặc vuốt chạm trên điện thoại.

3. **🎹 Bộ Phát Nhạc Lofi Piano Độc Quyền (Web Audio API):**
   - Tự động phối hợp âm piano ấm áp (Cmaj9 - Am9 - Fmaj7 - G) và chuông gió trong trẻo.
   - **Hoạt động 100% offline**, không sợ bị lỗi 404 hay link nhạc ngoài bị die.
   - Đĩa than vinyl xoay tròn ở góc phải với sóng nhạc visualizer. Có thể tùy chọn đổi sang link nhạc MP3 yêu thích.

4. **📜 Bức Thư Tình Đánh Máy Chân Thực:**
   - Từng câu chữ hiện ra với nhịp gõ đánh máy sâu lắng, ngắt nghỉ cảm xúc.
   - Có nút "Đọc nhanh ⚡" nếu không muốn chờ.

5. **🏃‍♂️ Nút "Từ Chối" Né Tránh Siêu Lầy Lội & Dễ Thương:**
   - Khi di chuột hoặc chạm vào nút "Từ chối", nút sẽ lập tức bay né sang chỗ khác kèm âm thanh boing vui nhộn.
   - Câu chữ trên nút thay đổi liên tục các câu trêu ghẹo đáng yêu (*"Ơ đừng bấm nút này mừ 🥺"*, *"Bấm nhầm nút rùi kìa 👉"*,...).
   - Mỗi lần né tránh, nút **"Đồng ý"** lại to dần lên và phát sáng rực rỡ hơn!

6. **🎉 Đại Tiệc Pháo Hoa & Giấy Chứng Nhận Tình Yêu (Khi bấm Đồng ý):**
   - Pháo hoa hình trái tim và chùm sáng nổ rực rỡ toàn màn hình.
   - Mưa kim tuyến (confetti) rơi ngập tràn.
   - **Đồng hồ đếm thời gian bên nhau (Love Timer)** đếm từng giây kể từ khoảnh khắc người ấy gật đầu.
   - **Giấy Chứng Nhận Tình Yêu** sang trọng với dấu mộc chính thức, ngày tháng và tên của hai bạn, có thể nhấn in hoặc lưu làm kỷ niệm!

7. **⚙️ Bảng Tùy Biến Trực Tiếp (Không cần biết code):**
   - Nút bánh răng ⚙️ ở góc dưới bên trái giúp bạn đổi tên người ấy, tên của bạn, nội dung thư tình và link bài hát chỉ trong 3 giây.

---

## 🚀 Cách Mở & Xem Trang Web

### Cách 1: Mở trực tiếp
Chỉ cần nhấp đúp vào file `index.html` trong bất kỳ trình duyệt nào (Chrome, Safari, Edge, Cốc Cốc, Firefox) trên máy tính hoặc điện thoại.

### Cách 2: Chạy Server Cục Bộ (Khuyên dùng)
Mở terminal trong thư mục này và chạy:

```bash
# Bằng Python:
python3 -m http.server 8080

# Hoặc bằng Node.js / npx:
npx serve .
```

Sau đó mở trình duyệt truy cập: `http://localhost:8080`

---

## 🎨 Cách Tùy Chỉnh Nội Dung

### Cách 1: Tùy chỉnh ngay trên giao diện web
- Bấm vào biểu tượng bánh răng **⚙️** ở góc dưới bên trái màn hình.
- Điền tên của bạn, tên crush, lời nhắn và link nhạc MP3 (nếu có).
- Bấm **"Lưu & Áp dụng ngay ✨"**.

### Cách 2: Tùy chỉnh qua file `js/config.js`
Mở file `js/config.js` bằng bất kỳ trình soạn thảo văn bản nào và sửa các thông tin:
```javascript
const LoveConfig = {
    crushName: "Phương Anh",         // Tên người bạn muốn tỏ tình
    senderName: "Hoàng Nam",         // Tên của bạn
    // ...
};
```

---

## 🌐 Hướng Dẫn Đưa Lên Mạng Miễn Phí (Để gửi link cho crush)

### Cách 1: GitHub Pages (Cực nhanh và miễn phí mãi mãi)
1. Tạo một repository mới trên GitHub (ví dụ: `my-love`).
2. Tải toàn bộ các file trong thư mục này lên repository.
3. Vào **Settings** -> **Pages** -> chọn nhánh `main` và bấm **Save**.
4. Sau 1 phút, bạn sẽ có đường link như: `https://username.github.io/my-love/` để gửi ngay cho crush!

### Cách 2: Netlify hoặc Vercel
1. Truy cập [Netlify Drop](https://app.netlify.com/drop).
2. Kéo thả nguyên thư mục `love-confession` vào trình duyệt.
3. Nhận ngay đường link web cực đẹp chỉ sau 5 giây!

---

*Chúc bạn tỏ tình thành công và có được cái gật đầu thật ngọt ngào từ người ấy nhé! 💕*
