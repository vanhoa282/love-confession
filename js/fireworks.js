/**
 * ==============================================================================
 * FIREWORKS & CELEBRATION ENGINE
 * Pháo hoa hình trái tim, pháo hoa chùm lung linh và mưa kim tuyến (confetti)
 * khi người ấy nhấn nút "Đồng ý"!
 * ==============================================================================
 */

class FireworksEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.rockets = [];
        this.particles = [];
        this.confetti = [];
        this.isRunning = false;
        this.autoLaunchInterval = null;

        this.width = 0;
        this.height = 0;
        this.dpr = Math.min(window.devicePixelRatio || 1, 2);

        this.colors = [
            '#ff4d6d', '#ff758f', '#ff8fa3', '#ffd166',
            '#06d6a0', '#118ab2', '#a0c4ff', '#ffc6ff', '#e0aaff'
        ];

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width * this.dpr;
        this.canvas.height = this.height * this.dpr;
        this.ctx.scale(this.dpr, this.dpr);
    }

    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.canvas.style.display = 'block';

        // Khởi tạo mưa confetti
        this.spawnInitialConfetti(80);

        // Bắn ngay chùm pháo hoa chào mừng
        this.launchHeartFirework(this.width * 0.5, this.height * 0.35);
        setTimeout(() => this.launchNormalFirework(this.width * 0.3, this.height * 0.38), 300);
        setTimeout(() => this.launchNormalFirework(this.width * 0.7, this.height * 0.38), 600);

        // Chu kỳ tự động bắn pháo hoa
        this.autoLaunchInterval = setInterval(() => {
            if (!this.isRunning) return;
            const x = Math.random() * (this.width * 0.7) + (this.width * 0.15);
            const y = Math.random() * (this.height * 0.4) + (this.height * 0.15);
            
            if (Math.random() > 0.4) {
                this.launchHeartFirework(x, y);
            } else {
                this.launchNormalFirework(x, y);
            }
        }, 1200);

        this.animate();
    }

    stop() {
        this.isRunning = false;
        if (this.autoLaunchInterval) {
            clearInterval(this.autoLaunchInterval);
            this.autoLaunchInterval = null;
        }
        this.rockets = [];
        this.particles = [];
        this.confetti = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.canvas.style.display = 'none';
    }

    launchNormalFirework(targetX, targetY) {
        const startX = targetX + (Math.random() * 80 - 40);
        const startY = this.height;
        const color = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.rockets.push({
            x: startX,
            y: startY,
            targetX: targetX,
            targetY: targetY,
            color: color,
            speed: Math.random() * 4 + 14,
            isHeart: false
        });
    }

    launchHeartFirework(targetX, targetY) {
        const startX = targetX;
        const startY = this.height;

        this.rockets.push({
            x: startX,
            y: startY,
            targetX: targetX,
            targetY: targetY,
            color: '#ff4d6d',
            speed: 16,
            isHeart: true
        });
    }

    explodeNormal(x, y, baseColor) {
        const particleCount = 70;
        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: Math.random() > 0.3 ? baseColor : '#ffffff',
                alpha: 1,
                decay: Math.random() * 0.02 + 0.015,
                size: Math.random() * 2.5 + 1.5,
                sparkle: Math.random() > 0.5
            });
        }
    }

    explodeHeart(centerX, centerY) {
        const points = 65;
        for (let i = 0; i < points; i++) {
            const t = (Math.PI * 2 / points) * i;
            // Heart curve parametric formula
            const hx = 16 * Math.pow(Math.sin(t), 3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

            const scale = 0.28 + Math.random() * 0.05;
            this.particles.push({
                x: centerX,
                y: centerY,
                vx: hx * scale,
                vy: hy * scale,
                color: Math.random() > 0.25 ? '#ff4d6d' : '#ffccd5',
                alpha: 1,
                decay: 0.012,
                size: 3,
                sparkle: true
            });
        }
    }

    spawnInitialConfetti(count) {
        for (let i = 0; i < count; i++) {
            this.confetti.push({
                x: Math.random() * this.width,
                y: Math.random() * -this.height,
                size: Math.random() * 10 + 6,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 3 + 2,
                rot: Math.random() * 360,
                rotSpeed: Math.random() * 6 - 3,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                shape: Math.random() > 0.5 ? 'rect' : 'circle'
            });
        }
    }

    animate() {
        if (!this.isRunning) return;
        requestAnimationFrame(() => this.animate());

        // Mờ dần vết pháo hoa (trail effect)
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.globalCompositeOperation = 'lighter';

        // 1. Update & Draw Rockets
        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const r = this.rockets[i];
            const dx = r.targetX - r.x;
            const dy = r.targetY - r.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < r.speed) {
                // Rocket reached target -> EXPLODE!
                if (r.isHeart) {
                    this.explodeHeart(r.targetX, r.targetY);
                } else {
                    this.explodeNormal(r.targetX, r.targetY, r.color);
                }
                this.rockets.splice(i, 1);
                continue;
            }

            const angle = Math.atan2(dy, dx);
            r.x += Math.cos(angle) * r.speed;
            r.y += Math.sin(angle) * r.speed;

            this.ctx.beginPath();
            this.ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2);
            this.ctx.fillStyle = r.color;
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = r.color;
            this.ctx.fill();
        }

        // 2. Update & Draw Explosion Particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.96; // air resistance
            p.vy *= 0.96;
            p.vy += 0.08; // gravity
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha * (p.sparkle && Math.random() > 0.3 ? 0.4 : 1);
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;
        this.ctx.globalAlpha = 1;

        // 3. Update & Draw Falling Confetti
        this.ctx.globalCompositeOperation = 'source-over';
        for (let i = 0; i < this.confetti.length; i++) {
            const c = this.confetti[i];
            c.y += c.vy;
            c.x += c.vx + Math.sin(c.y * 0.02) * 0.8;
            c.rot += c.rotSpeed;

            if (c.y > this.height + 20) {
                c.y = -20;
                c.x = Math.random() * this.width;
            }

            this.ctx.save();
            this.ctx.translate(c.x, c.y);
            this.ctx.rotate(c.rot * Math.PI / 180);
            this.ctx.fillStyle = c.color;
            if (c.shape === 'rect') {
                this.ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
            } else {
                this.ctx.beginPath();
                this.ctx.arc(0, 0, c.size / 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.restore();
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.fireworks = new FireworksEngine('fireworksCanvas');
});
