/**
 * ==============================================================================
 * TYPEWRITER ENGINE
 * Hiệu ứng đánh máy chân thực, hỗ trợ ngắt câu cảm xúc, nhịp gõ tự nhiên
 * và tự động thay thế biến {crushName}, {senderName}.
 * ==============================================================================
 */

class Typewriter {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = Object.assign({
            speed: 40,
            variation: 25,
            onComplete: null,
            onParagraphComplete: null
        }, options);

        this.isTyping = false;
        this.isSkipped = false;
        this.timeoutId = null;
    }

    typeText(paragraphs, onComplete) {
        if (!this.container) return;
        this.container.innerHTML = '';
        this.isTyping = true;
        this.isSkipped = false;

        let pIndex = 0;

        const typeNextParagraph = () => {
            if (this.isSkipped) return;
            if (pIndex >= paragraphs.length) {
                this.isTyping = false;
                if (onComplete) onComplete();
                return;
            }

            const pText = paragraphs[pIndex]
                .replace(/{crushName}/g, LoveConfig.crushName)
                .replace(/{senderName}/g, LoveConfig.senderName);

            const pElem = document.createElement('p');
            pElem.className = 'letter-paragraph active-typing';
            this.container.appendChild(pElem);

            let charIndex = 0;

            const typeChar = () => {
                if (this.isSkipped) return;

                if (charIndex < pText.length) {
                    pElem.textContent += pText[charIndex];
                    charIndex++;

                    // Âm thanh gõ phím nhẹ hoặc ngắt nhịp khi gặp dấu phẩy, dấu chấm
                    const char = pText[charIndex - 1];
                    let delay = this.options.speed + (Math.random() * this.options.variation);
                    if (char === ',' || char === '—') delay += 180;
                    if (char === '.' || char === '!' || char === '?') delay += 350;

                    this.timeoutId = setTimeout(typeChar, delay);
                } else {
                    pElem.classList.remove('active-typing');
                    pIndex++;
                    this.timeoutId = setTimeout(typeNextParagraph, 450);
                }
            };

            typeChar();
        };

        typeNextParagraph();
    }

    skip(paragraphs, onComplete) {
        this.isSkipped = true;
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.isTyping = false;

        this.container.innerHTML = '';
        paragraphs.forEach(p => {
            const formatted = p
                .replace(/{crushName}/g, LoveConfig.crushName)
                .replace(/{senderName}/g, LoveConfig.senderName);
            const pElem = document.createElement('p');
            pElem.className = 'letter-paragraph';
            pElem.textContent = formatted;
            this.container.appendChild(pElem);
        });

        if (onComplete) onComplete();
    }
}

window.Typewriter = Typewriter;
