/**
 * ==============================================================================
 * CẤU HÌNH TRANG WEB TỎ TÌNH (LOVE CONFESSION CONFIG)
 * Bạn có thể dễ dàng thay đổi thông tin tại đây hoặc qua nút "Cài đặt ⚙️" trên web!
 * ==============================================================================
 */

const LoveConfig = {
    // Thông tin người nhận & người gửi
    crushName: "Bé Yêu",             // Tên người ấy (VD: "Phương Anh", "Bé Yêu", "Crush")
    senderName: "Anh nè",           // Tên của bạn (VD: "Hoàng Nam", "Anh nè", "Tớ nè")
    
    // Màn mở đầu (Bao thư bí mật)
    envelope: {
        badge: "Thư Mật Dành Riêng Cho Cậu",
        stampText: "FOR YOU",
        clickPrompt: "Chạm vào phong thư để mở món quà đặc biệt ✨",
        hint: "Bật loa hoặc đeo tai nghe để có trải nghiệm tuyệt nhất nhé 🎧"
    },

    // Lý do rung động (Timeline / Kỷ niệm)
    reasons: [
        {
            icon: "✨",
            title: "Nụ cười tỏa nắng",
            desc: "Khoảnh khắc cậu cười, cả thế giới xung quanh tớ dường như bừng sáng và dịu dàng hơn bao giờ hết.",
            badge: "Khoảnh khắc 01"
        },
        {
            icon: "🌸",
            title: "Sự dịu dàng ấm áp",
            desc: "Cách cậu nói chuyện, quan tâm đến những điều nhỏ bé khiến trái tim tớ luôn cảm thấy bình yên.",
            badge: "Khoảnh khắc 02"
        },
        {
            icon: "💫",
            title: "Từng mẩu chuyện nhỏ",
            desc: "Dù chỉ là vài câu vu vơ thường ngày, nhưng mỗi khi được trò chuyện cùng cậu, ngày hôm đó luôn là ngày đặc biệt.",
            badge: "Khoảnh khắc 03"
        },
        {
            icon: "🌙",
            title: "Điều ước dưới những vì sao",
            desc: "Nếu mỗi vì sao trên trời là một điều ước, tớ sẽ ước tất cả các vì sao đều mang lại hạnh phúc cho cậu.",
            badge: "Khoảnh khắc 04"
        }
    ],

    // Bức thư tình (Typewriter letter)
    letter: {
        title: "Gửi đến người tớ thương...",
        paragraphs: [
            "Chào {crushName}, người đã làm trái tim tớ loạn nhịp suốt bấy lâu nay...",
            "Có những cảm xúc thật kỳ lạ, đến một cách rất tự nhiên nhưng lại đọng lại thật sâu sắc. Từ lần đầu tiên ánh mắt chạm nhau, tớ nhận ra cuộc sống của mình đã có thêm một màu sắc thật rực rỡ mang tên cậu.",
            "Tớ không dám hứa sẽ mang lại cả dải ngân hà rộng lớn, nhưng tớ hứa sẽ luôn ở bên cạnh, lắng nghe từng niềm vui nỗi buồn, che ô cho cậu những ngày mưa và cùng cậu mỉm cười dưới ánh nắng.",
            "Đã giữ kín trong lòng thật lâu rồi, hôm nay tớ lấy hết can đảm dưới bầu trời đầy sao này để gửi đến cậu một lời thật lòng..."
        ],
        signature: "Mãi hướng về cậu,"
    },

    // Câu hỏi tỏ tình lớn
    proposal: {
        question: "{crushName} ơi, cậu có đồng ý làm người yêu của {senderName} không? 💕",
        subQuestion: "Được nắm tay cậu đi qua mọi mùa trong năm là điều tuyệt vời nhất trần đời...",
        btnYes: "Tớ đồng ý! ❤️",
        btnNo: "Không thèm đâu 😝",
        dodges: [
            "Ơ đừng bấm nút này mà 🥺",
            "Nút này bị kẹt rùi á! 😜",
            "Bấm nhầm nút rùi kìa, bên cạnh cơ 👉",
            "Thử bắt tớ xem nào! 🏃‍♂️💨",
            "Trái tim tớ chỉ có 1 cửa 'Đồng ý' thui! 💖",
            "Không cho bấm nút này đâuuu!",
            "Cậu nỡ từ chối một người đáng yêu thế này sao? 🥺",
            "Đồng ý đi mà, năn nỉ luôn đó ✨"
        ]
    },

    // Màn chúc mừng chiến thắng (YES)
    celebration: {
        badge: "CHÍNH THỨC HẸN HÒ 💖",
        title: "YAYYY! CẢM ƠN CẬU ĐÃ ĐỒNG Ý! 🎉",
        message: "Từ giây phút này, tớ chính thức là người may mắn và hạnh phúc nhất vũ trụ! Hứa sẽ luôn yêu thương, nhường nhịn và chăm sóc cậu thật tốt mỗi ngày.",
        certificateTitle: "CHỨNG NHẬN TÌNH YÊU",
        contractText: "Chứng nhận rằng hai trái tim đã chính thức thuộc về nhau. Kể từ hôm nay, mọi giận hờn sẽ được dỗ dành bằng trà sữa và những cái ôm thật chặt!",
        timerLabel: "Chúng mình đã bên nhau được:"
    },

    // Nhạc nền (mặc định sử dụng Web Audio synth du dương, có thể thêm URL mp3)
    music: {
        title: "Romantic Lofi Dream - Piano Melody",
        customUrl: "", // Nhập link mp3 trực tiếp tại đây nếu muốn (ví dụ: "https://...mp3")
        autoPlayMelody: true
    }
};

// Đọc cài đặt đã lưu từ localStorage nếu có
(function loadCustomSettings() {
    try {
        const saved = localStorage.getItem('love_confession_settings');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.crushName) LoveConfig.crushName = parsed.crushName;
            if (parsed.senderName) LoveConfig.senderName = parsed.senderName;
            if (parsed.customLetter) LoveConfig.letter.paragraphs = parsed.customLetter.split('\n\n').filter(p => p.trim());
            if (parsed.customMusicUrl) LoveConfig.music.customUrl = parsed.customMusicUrl;
        }
    } catch (e) {
        console.warn("Could not read local storage settings", e);
    }
})();
