/**
 * ==============================================================================
 * LOVE CONFESSION APP CONTROLLER
 * Quản lý các giai đoạn (Stages), hiệu ứng nút Từ chối né tránh đỉnh cao,
 * đồng hồ đếm thời gian yêu nhau và giao diện tùy chỉnh.
 * ==============================================================================
 */

class LoveApp {
    constructor() {
        this.currentStage = 0;
        this.dodgeCount = 0;
        this.yesScale = 1.0;
        this.loveStartTime = null;
        this.timerInterval = null;
        this.typewriter = null;

        this.init();
    }

    init() {
        this.hydrateContent();
        this.setupEnvelope();
        this.setupCardsTilt();
        this.setupProposalActions();
        this.setupMusicWidget();
        this.setupSettingsModal();
        this.setupCelebrationActions();
    }

    // Điền dữ liệu từ LoveConfig vào HTML
    hydrateContent() {
        const replaceVars = (str) => {
            return str
                .replace(/{crushName}/g, LoveConfig.crushName)
                .replace(/{senderName}/g, LoveConfig.senderName);
        };

        // Text ở các vị trí có data-bind
        document.querySelectorAll('[data-bind]').forEach(el => {
            const key = el.getAttribute('data-bind');
            if (key === 'crushName') el.textContent = LoveConfig.crushName;
            if (key === 'senderName') el.textContent = LoveConfig.senderName;
            if (key === 'envelopeBadge') el.textContent = LoveConfig.envelope.badge;
            if (key === 'stampText') el.textContent = LoveConfig.envelope.stampText;
            if (key === 'envelopePrompt') el.textContent = LoveConfig.envelope.clickPrompt;
            if (key === 'letterTitle') el.textContent = replaceVars(LoveConfig.letter.title);
            if (key === 'letterSignature') el.textContent = replaceVars(LoveConfig.letter.signature);
            if (key === 'question') el.textContent = replaceVars(LoveConfig.proposal.question);
            if (key === 'subQuestion') el.textContent = replaceVars(LoveConfig.proposal.subQuestion);
            if (key === 'btnYes') el.textContent = LoveConfig.proposal.btnYes;
            if (key === 'btnNo') el.textContent = LoveConfig.proposal.btnNo;
            if (key === 'celebrationBadge') el.textContent = LoveConfig.celebration.badge;
            if (key === 'celebrationTitle') el.textContent = replaceVars(LoveConfig.celebration.title);
            if (key === 'celebrationMessage') el.textContent = replaceVars(LoveConfig.celebration.message);
            if (key === 'certificateTitle') el.textContent = LoveConfig.celebration.certificateTitle;
            if (key === 'contractText') el.textContent = replaceVars(LoveConfig.celebration.contractText);
            if (key === 'timerLabel') el.textContent = LoveConfig.celebration.timerLabel;
        });

        // Tạo danh sách thẻ lý do (Reasons)
        const reasonsContainer = document.getElementById('reasonsContainer');
        if (reasonsContainer) {
            reasonsContainer.innerHTML = '';
            LoveConfig.reasons.forEach((r, idx) => {
                const card = document.createElement('div');
                card.className = 'glass-card reason-card';
                card.innerHTML = `
                    <div class="card-badge">${r.badge || `Khoảnh khắc 0${idx + 1}`}</div>
                    <div class="card-icon-wrapper">
                        <span class="card-icon">${r.icon}</span>
                    </div>
                    <h3 class="card-title">${replaceVars(r.title)}</h3>
                    <p class="card-desc">${replaceVars(r.desc)}</p>
                    <div class="card-glow"></div>
                `;
                reasonsContainer.appendChild(card);
            });
        }
    }

    // 1. Màn mở đầu: Phong thư bí mật
    setupEnvelope() {
        const envelope = document.getElementById('secretEnvelope');
        const openBtn = document.getElementById('openEnvelopeBtn');
        const introSection = document.getElementById('introSection');
        const mainContent = document.getElementById('mainContent');

        const triggerOpen = () => {
            if (envelope.classList.contains('opened')) return;

            // Âm thanh mở phong thư
            if (window.soundEngine) {
                window.soundEngine.playEnvelopeOpen();
                window.soundEngine.startMusic();
            }

            envelope.classList.add('opened');

            // Hiệu ứng pháo hoa trái tim nhỏ bay lên từ phong thư
            const rect = envelope.getBoundingClientRect();
            if (window.starfield) {
                window.starfield.spawnHeartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
            }

            setTimeout(() => {
                introSection.classList.add('fade-out');
                setTimeout(() => {
                    introSection.style.display = 'none';
                    mainContent.classList.remove('hidden');
                    mainContent.classList.add('fade-in');
                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    // Bắt đầu gõ thư tình
                    this.startLetterTyping();
                }, 700);
            }, 1200);
        };

        if (envelope) envelope.addEventListener('click', triggerOpen);
        if (openBtn) openBtn.addEventListener('click', triggerOpen);
    }

    // Hiệu ứng nghiêng 3D (Tilt) cho các thẻ bài
    setupCardsTilt() {
        document.addEventListener('mousemove', (e) => {
            const cards = document.querySelectorAll('.reason-card');
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;
                    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
                } else {
                    card.style.transform = '';
                }
            });
        });
    }

    // 2. Đánh máy thư tình
    startLetterTyping() {
        this.typewriter = new Typewriter('letterBody', {
            speed: 38,
            variation: 20
        });

        const skipBtn = document.getElementById('skipTypewriterBtn');
        if (skipBtn) {
            skipBtn.addEventListener('click', () => {
                this.typewriter.skip(LoveConfig.letter.paragraphs);
                skipBtn.style.display = 'none';
                if (window.soundEngine) window.soundEngine.playChime();
            });
        }

        this.typewriter.typeText(LoveConfig.letter.paragraphs, () => {
            if (skipBtn) skipBtn.style.display = 'none';
            const signature = document.getElementById('letterSignatureWrap');
            if (signature) signature.classList.add('visible');
        });
    }

    // 3. Xử lý câu hỏi tỏ tình & Nút Từ chối né tránh thông minh
    setupProposalActions() {
        const btnYes = document.getElementById('btnYes');
        const btnNo = document.getElementById('btnNo');

        if (!btnYes || !btnNo) return;

        // Xử lý nút "Đồng ý" (YES)
        btnYes.addEventListener('click', () => {
            this.handleProposalAccepted();
        });

        let isDodging = false;

        // Xử lý né tránh của nút "Từ chối" (NO)
        const dodgeButton = (e) => {
            if (e) e.preventDefault();
            if (isDodging) return;
            isDodging = true;
            setTimeout(() => { isDodging = false; }, 180);

            this.dodgeCount++;

            // Phát âm thanh vui nhộn
            if (window.soundEngine) {
                window.soundEngine.playDodgeBoing();
            }

            // Thay đổi chữ nút Từ chối sang câu trêu ghẹo đáng yêu
            const dodges = LoveConfig.proposal.dodges;
            const randomDodgeText = dodges[(this.dodgeCount - 1) % dodges.length];
            btnNo.textContent = randomDodgeText;

            // Nút "Đồng ý" to lên và phát sáng mạnh hơn!
            this.yesScale += 0.08;
            btnYes.style.transform = `scale(${this.yesScale})`;
            btnYes.style.boxShadow = `0 0 ${20 + this.dodgeCount * 6}px rgba(255, 77, 109, ${Math.min(0.95, 0.5 + this.dodgeCount * 0.06)})`;

            // Tính toán vị trí bay ngẫu nhiên an toàn trên màn hình
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const btnWidth = btnNo.offsetWidth || 140;
            const btnHeight = btnNo.offsetHeight || 50;
            const margin = 25;

            const safeX = Math.random() * (vw - btnWidth - margin * 2) + margin;
            const safeY = Math.random() * (vh - btnHeight - margin * 2) + margin;

            btnNo.style.position = 'fixed';
            btnNo.style.zIndex = '999';
            btnNo.style.left = `${safeX}px`;
            btnNo.style.top = `${safeY}px`;
            btnNo.style.transform = `scale(${Math.max(0.75, 1 - this.dodgeCount * 0.03)})`;
            btnNo.style.transition = 'all 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)';

            // Hiển thị bong bóng trêu chọc tại chỗ cũ
            this.showFloatingHint(btnNo, "Hì hì hụt rùi 😜");
        };

        // Kích hoạt né tránh khi chuột rê vào hoặc chạm trên điện thoại
        btnNo.addEventListener('mouseenter', dodgeButton);
        btnNo.addEventListener('touchstart', dodgeButton, { passive: false });
        btnNo.addEventListener('click', dodgeButton);
    }

    showFloatingHint(anchorEl, text) {
        const hint = document.createElement('div');
        hint.className = 'floating-dodge-hint';
        hint.textContent = text;
        const rect = anchorEl.getBoundingClientRect();
        hint.style.left = `${rect.left + rect.width / 2}px`;
        hint.style.top = `${rect.top}px`;
        document.body.appendChild(hint);

        setTimeout(() => hint.remove(), 1200);
    }

    // Khi người ấy bấm "ĐỒNG Ý"
    handleProposalAccepted() {
        // Lưu mốc thời gian bắt đầu yêu
        this.loveStartTime = new Date();
        localStorage.setItem('love_confession_start_date', this.loveStartTime.toISOString());

        // Hiệu ứng âm thanh đại thắng
        if (window.soundEngine) {
            window.soundEngine.playCelebrationFanfare();
        }

        // Bắt đầu pháo hoa & mưa kim tuyến rực rỡ
        if (window.fireworks) {
            window.fireworks.start();
        }

        // Hiển thị màn hình chúc mừng
        const celebrationModal = document.getElementById('celebrationModal');
        if (celebrationModal) {
            celebrationModal.classList.add('active');
            celebrationModal.scrollTop = 0;
        }

        // Bắt đầu đồng hồ đếm thời gian bên nhau
        this.startLoveTimer();

        // Cập nhật ngày tháng trên Giấy chứng nhận tình yêu
        const certDate = document.getElementById('certDate');
        if (certDate) {
            const today = new Date();
            const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;
            certDate.textContent = dateStr;
        }
    }

    // Đồng hồ đếm thời gian yêu nhau
    startLoveTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        const updateTimer = () => {
            const now = new Date();
            const start = this.loveStartTime || new Date();
            const diffMs = Math.max(0, now - start);

            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diffMs / (1000 * 60)) % 60);
            const seconds = Math.floor((diffMs / 1000) % 60);

            const daysEl = document.getElementById('timerDays');
            const hoursEl = document.getElementById('timerHours');
            const minsEl = document.getElementById('timerMins');
            const secsEl = document.getElementById('timerSecs');

            if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
            if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
            if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
            if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');
        };

        updateTimer();
        this.timerInterval = setInterval(updateTimer, 1000);
    }

    // Widget đĩa than phát nhạc
    setupMusicWidget() {
        const vinylDisc = document.getElementById('vinylDisc');
        const widget = document.querySelector('.floating-music-widget');
        const musicBtn = document.getElementById('musicControlBtn');

        const toggle = () => {
            if (window.soundEngine) {
                window.soundEngine.toggleMusic();
            }
        };

        if (vinylDisc) vinylDisc.addEventListener('click', toggle);
        if (widget) widget.addEventListener('click', toggle);
        if (musicBtn) musicBtn.addEventListener('click', toggle);
    }

    // Các nút hành động trong màn hình Chúc mừng
    setupCelebrationActions() {
        const fireworkBtn = document.getElementById('moreFireworksBtn');
        if (fireworkBtn) {
            fireworkBtn.addEventListener('click', () => {
                if (window.fireworks) {
                    const cx = window.innerWidth / 2;
                    const cy = window.innerHeight * 0.35;
                    window.fireworks.launchHeartFirework(cx, cy);
                    setTimeout(() => window.fireworks.launchNormalFirework(cx - 150, cy + 50), 200);
                    setTimeout(() => window.fireworks.launchNormalFirework(cx + 150, cy + 50), 400);
                }
                if (window.soundEngine) window.soundEngine.playCelebrationFanfare();
            });
        }

        const heartsBtn = document.getElementById('moreHeartsBtn');
        if (heartsBtn) {
            heartsBtn.addEventListener('click', (e) => {
                const rect = heartsBtn.getBoundingClientRect();
                if (window.starfield) {
                    window.starfield.spawnHeartBurst(rect.left + rect.width / 2, rect.top, 25);
                }
                if (window.soundEngine) window.soundEngine.playHeartPop();
            });
        }

        const printBtn = document.getElementById('saveCertBtn');
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                window.print();
            });
        }

        const closeCertBtn = document.getElementById('closeCertBtn');
        if (closeCertBtn) {
            closeCertBtn.addEventListener('click', () => {
                const celebrationModal = document.getElementById('celebrationModal');
                if (celebrationModal) celebrationModal.classList.remove('active');
            });
        }
    }

    // 4. Modal cài đặt nhanh thông tin người yêu & nhạc
    setupSettingsModal() {
        const settingsBtn = document.getElementById('openSettingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeBtn = document.getElementById('closeSettingsBtn');
        const saveBtn = document.getElementById('saveSettingsBtn');
        const resetBtn = document.getElementById('resetSettingsBtn');

        const crushInput = document.getElementById('inputCrushName');
        const senderInput = document.getElementById('inputSenderName');
        const letterInput = document.getElementById('inputLetterContent');
        const musicInput = document.getElementById('inputMusicUrl');

        if (settingsBtn && settingsModal) {
            settingsBtn.addEventListener('click', () => {
                if (crushInput) crushInput.value = LoveConfig.crushName;
                if (senderInput) senderInput.value = LoveConfig.senderName;
                if (letterInput) letterInput.value = LoveConfig.letter.paragraphs.join('\n\n');
                if (musicInput) musicInput.value = LoveConfig.music.customUrl || '';
                settingsModal.classList.add('active');
            });
        }

        if (closeBtn && settingsModal) {
            closeBtn.addEventListener('click', () => {
                settingsModal.classList.remove('active');
            });
        }

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                const newCrush = crushInput ? crushInput.value.trim() : '';
                const newSender = senderInput ? senderInput.value.trim() : '';
                const newLetter = letterInput ? letterInput.value.trim() : '';
                const newMusic = musicInput ? musicInput.value.trim() : '';

                if (newCrush) LoveConfig.crushName = newCrush;
                if (newSender) LoveConfig.senderName = newSender;
                if (newLetter) LoveConfig.letter.paragraphs = newLetter.split('\n\n').filter(p => p.trim());
                if (newMusic !== undefined) LoveConfig.music.customUrl = newMusic;

                // Lưu vào LocalStorage
                localStorage.setItem('love_confession_settings', JSON.stringify({
                    crushName: LoveConfig.crushName,
                    senderName: LoveConfig.senderName,
                    customLetter: newLetter,
                    customMusicUrl: newMusic
                }));

                this.hydrateContent();
                settingsModal.classList.remove('active');
                if (window.soundEngine) window.soundEngine.playChime();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                localStorage.removeItem('love_confession_settings');
                localStorage.removeItem('love_confession_start_date');
                location.reload();
            });
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.loveApp = new LoveApp();
});
