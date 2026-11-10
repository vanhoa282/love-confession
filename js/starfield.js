/**
 * ==============================================================================
 * STARFIELD & FLOATING HEARTS CANVAS ENGINE
 * Hiệu ứng bầu trời sao lung linh 60FPS, sao băng lướt qua, trái tim bay
 * và vệt sáng ma thuật theo con trỏ chuột / cử chỉ chạm.
 * ==============================================================================
 */

class Starfield {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.stars = [];
        this.hearts = [];
        this.meteors = [];
        this.particles = [];
        this.mouseTrail = [];

        this.mouseX = 0;
        this.mouseY = 0;
        this.targetMouseX = 0;
        this.targetMouseY = 0;

        this.width = 0;
        this.height = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Mouse & Touch listeners for magical trail
        window.addEventListener('mousemove', (e) => {
            this.targetMouseX = e.clientX;
            this.targetMouseY = e.clientY;
            this.addTrailParticle(e.clientX, e.clientY);
        });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const touch = e.touches[0];
                this.targetMouseX = touch.clientX;
                this.targetMouseY = touch.clientY;
                this.addTrailParticle(touch.clientX, touch.clientY);
            }
        }, { passive: true });

        // Click to spawn floating hearts
        window.addEventListener('click', (e) => {
            // Không kích hoạt nếu bấm vào nút hoặc input
            if (e.target.closest('button, input, textarea, a, .interactive-card')) return;
            this.spawnHeartBurst(e.clientX, e.clientY, 8);
            if (window.soundEngine) window.soundEngine.playHeartPop();
        });

        this.generateStars(220);
        this.animate();
        this.scheduleMeteor();
        this.scheduleFloatingHearts();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);

        if (this.stars.length === 0) {
            this.generateStars(220);
        }
    }

    generateStars(count) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                radius: Math.random() * 1.5 + 0.4,
                alpha: Math.random() * 0.8 + 0.2,
                twinkleSpeed: Math.random() * 0.03 + 0.008,
                twinkleDir: Math.random() > 0.5 ? 1 : -1,
                color: Math.random() > 0.8 ? '#ffd1dc' : (Math.random() > 0.6 ? '#e0c3fc' : '#ffffff'),
                parallaxFactor: Math.random() * 0.02 + 0.005
            });
        }
    }

    addTrailParticle(x, y) {
        if (Math.random() > 0.4) return; // Giữ hiệu năng mượt mà
        this.mouseTrail.push({
            x: x + (Math.random() * 10 - 5),
            y: y + (Math.random() * 10 - 5),
            size: Math.random() * 3 + 1.5,
            alpha: 0.8,
            decay: Math.random() * 0.03 + 0.02,
            isHeart: Math.random() > 0.7,
            vx: (Math.random() - 0.5) * 1.2,
            vy: (Math.random() - 0.5) * 1.2 - 0.5,
            color: Math.random() > 0.5 ? '#ff4d6d' : '#ff758f'
        });
    }

    spawnHeartBurst(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.5);
            const speed = Math.random() * 3 + 1.5;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: Math.random() * 12 + 8,
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015,
                color: `hsl(${340 + Math.random() * 30}, 95%, ${65 + Math.random() * 20}%)`,
                rotation: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.1
            });
        }
    }

    scheduleMeteor() {
        const nextTime = Math.random() * 4000 + 3000;
        setTimeout(() => {
            this.spawnMeteor();
            this.scheduleMeteor();
        }, nextTime);
    }

    spawnMeteor() {
        const startX = Math.random() * (this.width * 0.8);
        const startY = Math.random() * (this.height * 0.4);
        const length = Math.random() * 120 + 80;
        const angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1); // ~45 degrees

        this.meteors.push({
            x: startX,
            y: startY,
            length: length,
            speed: Math.random() * 10 + 12,
            angle: angle,
            alpha: 1,
            decay: 0.018,
            thickness: Math.random() * 2 + 1.2
        });
    }

    scheduleFloatingHearts() {
        setInterval(() => {
            if (this.hearts.length < 25) {
                this.hearts.push({
                    x: Math.random() * this.width,
                    y: this.height + 30,
                    size: Math.random() * 14 + 10,
                    speedY: Math.random() * 0.8 + 0.5,
                    swayAmplitude: Math.random() * 1.5 + 0.5,
                    swayFrequency: Math.random() * 0.02 + 0.01,
                    swayPhase: Math.random() * Math.PI * 2,
                    alpha: Math.random() * 0.5 + 0.3,
                    color: Math.random() > 0.4 ? 'rgba(255, 77, 109, ' : 'rgba(255, 143, 171, '
                });
            }
        }, 600);
    }

    drawHeart(ctx, x, y, size, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.beginPath();
        const topCurveHeight = size * 0.3;
        ctx.moveTo(0, topCurveHeight);
        // Left curve
        ctx.bezierCurveTo(
            -size / 2, -size / 2,
            -size, topCurveHeight / 3,
            0, size
        );
        // Right curve
        ctx.bezierCurveTo(
            size, topCurveHeight / 3,
            size / 2, -size / 2,
            0, topCurveHeight
        );
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Smooth mouse parallax
        this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
        this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

        // Clear canvas with space gradient
        const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.height);
        bgGrad.addColorStop(0, '#0a0814');
        bgGrad.addColorStop(0.5, '#130c25');
        bgGrad.addColorStop(1, '#23112c');
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Ambient romantic nebula glow
        const nebulaGrad = this.ctx.createRadialGradient(
            this.width * 0.5, this.height * 0.4, 20,
            this.width * 0.5, this.height * 0.4, this.width * 0.6
        );
        nebulaGrad.addColorStop(0, 'rgba(255, 77, 109, 0.08)');
        nebulaGrad.addColorStop(0.6, 'rgba(128, 90, 213, 0.05)');
        nebulaGrad.addColorStop(1, 'transparent');
        this.ctx.fillStyle = nebulaGrad;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 1. Draw & Update Stars
        this.stars.forEach(star => {
            star.alpha += star.twinkleSpeed * star.twinkleDir;
            if (star.alpha > 0.95) {
                star.alpha = 0.95;
                star.twinkleDir = -1;
            } else if (star.alpha < 0.2) {
                star.alpha = 0.2;
                star.twinkleDir = 1;
            }

            const parallaxX = (this.mouseX - this.width / 2) * star.parallaxFactor;
            const parallaxY = (this.mouseY - this.height / 2) * star.parallaxFactor;

            this.ctx.beginPath();
            this.ctx.arc(star.x + parallaxX, star.y + parallaxY, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = star.color;
            this.ctx.globalAlpha = star.alpha;
            this.ctx.shadowBlur = star.radius > 1 ? 6 : 0;
            this.ctx.shadowColor = star.color;
            this.ctx.fill();
        });
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;

        // 2. Draw & Update Meteors (Shooting Stars)
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const m = this.meteors[i];
            m.x += Math.cos(m.angle) * m.speed;
            m.y += Math.sin(m.angle) * m.speed;
            m.alpha -= m.decay;

            if (m.alpha <= 0 || m.x > this.width + 100 || m.y > this.height + 100) {
                this.meteors.splice(i, 1);
                continue;
            }

            const tailX = m.x - Math.cos(m.angle) * m.length;
            const tailY = m.y - Math.sin(m.angle) * m.length;

            const grad = this.ctx.createLinearGradient(tailX, tailY, m.x, m.y);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
            grad.addColorStop(1, `rgba(255, 230, 240, ${m.alpha})`);

            this.ctx.beginPath();
            this.ctx.moveTo(tailX, tailY);
            this.ctx.lineTo(m.x, m.y);
            this.ctx.strokeStyle = grad;
            this.ctx.lineWidth = m.thickness;
            this.ctx.lineCap = 'round';
            this.ctx.stroke();

            // Head sparkle
            this.ctx.beginPath();
            this.ctx.arc(m.x, m.y, m.thickness * 1.5, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#ffb3c6';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }

        // 3. Draw & Update Floating Hearts
        for (let i = this.hearts.length - 1; i >= 0; i--) {
            const h = this.hearts[i];
            h.y -= h.speedY;
            h.swayPhase += h.swayFrequency;
            const swayX = h.x + Math.sin(h.swayPhase) * (h.swayAmplitude * 15);

            if (h.y < -30) {
                this.hearts.splice(i, 1);
                continue;
            }

            this.drawHeart(this.ctx, swayX, h.y, h.size, `${h.color}${h.alpha})`);
        }

        // 4. Draw & Update Mouse Trail Particles
        for (let i = this.mouseTrail.length - 1; i >= 0; i--) {
            const p = this.mouseTrail[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.mouseTrail.splice(i, 1);
                continue;
            }

            if (p.isHeart) {
                this.drawHeart(this.ctx, p.x, p.y, p.size * 2, `rgba(255, 117, 143, ${p.alpha})`);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.alpha;
                this.ctx.shadowBlur = 6;
                this.ctx.shadowColor = p.color;
                this.ctx.fill();
            }
        }
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;

        // 5. Click Particle Bursts
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05; // slight gravity
            p.rotation += p.rotSpeed;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate(p.rotation);
            this.drawHeart(this.ctx, 0, 0, p.size, p.color);
            this.ctx.restore();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.starfield = new Starfield('starCanvas');
});
