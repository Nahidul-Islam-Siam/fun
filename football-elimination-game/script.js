/**
 * Football Stars Arena - 360° Dynamic Physics Elimination Engine
 * Vanilla JavaScript + HTML5 Canvas 2D Rigid-Body Physics
 */

// --- 1. PLAYERS DATABASE ---
const PLAYERS_MASTER = [
    { id: 1, name: "Lionel Messi", team: "Inter Miami", country: "Argentina", flag: "🇦🇷", jersey: 10, color: "#75aadb", avatarUrl: "assets/players/player1.jpg", wins: 0 },
    { id: 2, name: "Cristiano Ronaldo", team: "Al Nassr", country: "Portugal", flag: "🇵🇹", jersey: 7, color: "#e42518", avatarUrl: "assets/players/player2.jpg", wins: 0 },
    { id: 3, name: "Kylian Mbappé", team: "Real Madrid", country: "France", flag: "🇫🇷", jersey: 10, color: "#002395", avatarUrl: "assets/players/player3.jpg", wins: 0 },
    { id: 4, name: "Erling Haaland", team: "Man City", country: "Norway", flag: "🇳🇴", jersey: 9, color: "#6cabdd", avatarUrl: "assets/players/player4.jpg", wins: 0 },
    { id: 5, name: "Vinícius Jr", team: "Real Madrid", country: "Brazil", flag: "🇧🇷", jersey: 7, color: "#009739", avatarUrl: "assets/players/player5.jpg", wins: 0 },
    { id: 6, name: "Jude Bellingham", team: "Real Madrid", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", jersey: 5, color: "#ffffff", avatarUrl: "assets/players/player6.jpg", wins: 0 },
    { id: 7, name: "Kevin De Bruyne", team: "Man City", country: "Belgium", flag: "🇧🇪", jersey: 17, color: "#fdda24", avatarUrl: "assets/players/player7.jpg", wins: 0 },
    { id: 8, name: "Mohamed Salah", team: "Liverpool", country: "Egypt", flag: "🇪🇬", jersey: 11, color: "#c8102e", avatarUrl: "assets/players/player8.jpg", wins: 0 },
    { id: 9, name: "Luka Modrić", team: "Real Madrid", country: "Croatia", flag: "🇭🇷", jersey: 10, color: "#ff0000", avatarUrl: "assets/players/player9.jpg", wins: 0 },
    { id: 10, name: "Robert Lewandowski", team: "Barcelona", country: "Poland", flag: "🇵🇱", jersey: 9, color: "#dc143c", avatarUrl: "assets/players/player10.jpg", wins: 0 },
    { id: 11, name: "Harry Kane", team: "Bayern Munich", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", jersey: 9, color: "#dd0000", avatarUrl: "assets/players/player11.jpg", wins: 0 },
    { id: 12, name: "Lamine Yamal", team: "Barcelona", country: "Spain", flag: "🇪🇸", jersey: 19, color: "#aa151b", avatarUrl: "assets/players/player12.jpg", wins: 0 },
    { id: 13, name: "Bukayo Saka", team: "Arsenal", country: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", jersey: 7, color: "#ef0107", avatarUrl: "assets/players/player13.jpg", wins: 0 },
    { id: 14, name: "Antoine Griezmann", team: "Atletico Madrid", country: "France", flag: "🇫🇷", jersey: 7, color: "#cb3524", avatarUrl: "assets/players/player14.jpg", wins: 0 },
    { id: 15, name: "Thibaut Courtois", team: "Real Madrid", country: "Belgium", flag: "🇧🇪", jersey: 1, color: "#f1c40f", avatarUrl: "assets/players/player15.jpg", wins: 0 },
    { id: 16, name: "Virgil van Dijk", team: "Liverpool", country: "Netherlands", flag: "🇳🇱", jersey: 4, color: "#ff4500", avatarUrl: "assets/players/player16.jpg", wins: 0 }
];

// --- 2. AUDIO SYNTHESIZER & SOUND FX ENGINE ---
class AudioEngine {
    constructor() {
        this.ctx = null;
        this.musicEnabled = true;
        this.sfxEnabled = true;
        this.bgAudio = document.getElementById("bgAudio");
        this.synthBgmInterval = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playBounce(velocity) {
        if (!this.sfxEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            const pitch = 120 + Math.min(velocity * 18, 400);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);

            gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.08);
        } catch (e) {}
    }

    playEscape() {
        if (!this.sfxEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            // Whoosh & blast sound
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.4);

            gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start();
            osc.stop(this.ctx.currentTime + 0.4);
        } catch (e) {}
    }

    playVictory() {
        if (!this.sfxEnabled) return;
        this.init();
        if (!this.ctx) return;

        try {
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.12);

                gain.gain.setValueAtTime(0.4, this.ctx.currentTime + idx * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.12 + 0.6);

                osc.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(this.ctx.currentTime + idx * 0.12);
                osc.stop(this.ctx.currentTime + idx * 0.12 + 0.6);
            });
        } catch (e) {}
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            if (this.bgAudio) {
                this.bgAudio.play().catch(() => this.startSynthBgm());
            } else {
                this.startSynthBgm();
            }
        } else {
            if (this.bgAudio) this.bgAudio.pause();
            this.stopSynthBgm();
        }
        return this.musicEnabled;
    }

    startSynthBgm() {
        if (this.synthBgmInterval) return;
        this.init();
        let step = 0;
        const bassNotes = [110, 110, 130, 98];
        this.synthBgmInterval = setInterval(() => {
            if (!this.musicEnabled || !this.ctx) return;
            try {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(bassNotes[step % bassNotes.length], this.ctx.currentTime);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.2);
                step++;
            } catch (e) {}
        }, 400);
    }

    stopSynthBgm() {
        if (this.synthBgmInterval) {
            clearInterval(this.synthBgmInterval);
            this.synthBgmInterval = null;
        }
    }
}

// --- 3. CONFETTI SYSTEM FOR WINNER CELEBRATION ---
class ConfettiEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.running = false;
    }

    resize() {
        this.canvas.width = this.canvas.parentElement.clientWidth;
        this.canvas.height = this.canvas.parentElement.clientHeight;
    }

    start() {
        this.resize();
        this.particles = [];
        const colors = ['#ffc107', '#00d2ff', '#ff3366', '#00ff88', '#ffffff'];
        for (let i = 0; i < 120; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height - this.canvas.height,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 4 + 2,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 10
            });
        }
        this.running = true;
        this.animate();
    }

    stop() {
        this.running = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    animate() {
        if (!this.running) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;

            if (p.y > this.canvas.height) {
                p.y = -10;
                p.x = Math.random() * this.canvas.width;
            }

            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.fillStyle = p.color;
            this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            this.ctx.restore();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// --- 4. MAIN GAME & PHYSICS CONTROLLER ---
class FootballArenaGame {
    constructor() {
        this.canvas = document.getElementById("gameCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.audio = new AudioEngine();
        this.confetti = new ConfettiEngine(document.getElementById("confettiCanvas"));

        // Game Settings & State
        this.maxPlayerCount = 16;
        this.currentRound = 1;
        this.speedMultiplier = 1.0;
        this.isRunning = false;
        this.isPaused = false;
        this.autoStartNext = true;

        this.qualifiedPlayers = [];
        this.activePlayers = [];
        this.eliminatedPlayers = [];

        this.particles = [];

        // Arena Geometry & Physics Params
        this.arenaRadius = 240;
        this.gapAngle = 0; // Rotates continuously
        this.gapAngularSpeed = 0.082; // Super high-speed rotating hole (~4.7 deg/frame)
        this.gapSizeAngle = Math.PI / 2.5; // ~72-degree wide opening for 5-6s completion

        this.matchTimeMs = 0;
        this.timerInterval = null;
        this.animFrameId = null;

        // Image Cache
        this.imageCache = {};
        this.preloadImages();

        this.bindEvents();
        this.initTournament();
    }

    preloadImages() {
        PLAYERS_MASTER.forEach(p => {
            const img = new Image();
            img.src = p.avatarUrl;
            img.onload = () => { this.imageCache[p.id] = img; };
            img.onerror = () => {
                // Fallback SVG data URL image
                const canvas = document.createElement("canvas");
                canvas.width = 100;
                canvas.height = 100;
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = p.color;
                ctx.fillRect(0, 0, 100, 100);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 40px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(p.name.charAt(0), 50, 50);
                
                const fallbackImg = new Image();
                fallbackImg.src = canvas.toDataURL();
                this.imageCache[p.id] = fallbackImg;
            };
        });
    }

    bindEvents() {
        document.getElementById("btnStart").addEventListener("click", () => this.startRound());
        document.getElementById("btnPause").addEventListener("click", () => this.togglePause());
        document.getElementById("btnReset").addEventListener("click", () => this.resetTournament());

        document.getElementById("btnMusicToggle").addEventListener("click", (e) => {
            const isPlaying = this.audio.toggleMusic();
            e.currentTarget.classList.toggle("btn-cyan", isPlaying);
            e.currentTarget.classList.toggle("btn-outline-cyan", !isPlaying);
        });

        document.getElementById("btnSfxToggle").addEventListener("click", (e) => {
            this.audio.sfxEnabled = !this.audio.sfxEnabled;
            e.currentTarget.classList.toggle("btn-warning", this.audio.sfxEnabled);
            e.currentTarget.classList.toggle("btn-outline-warning", !this.audio.sfxEnabled);
        });

        const playerSlider = document.getElementById("playerCountSlider");
        playerSlider.addEventListener("input", (e) => {
            this.maxPlayerCount = parseInt(e.target.value);
            document.getElementById("playerCountVal").innerText = `${this.maxPlayerCount} Players`;
            if (!this.isRunning) this.setupRound();
        });

        const speedSlider = document.getElementById("speedSlider");
        speedSlider.addEventListener("input", (e) => {
            const val = parseInt(e.target.value);
            const labels = ["5-6s (Normal)", "3-4s (Ultra Fast)", "1-2s (BLITZ!)"];
            this.speedMultiplier = val === 1 ? 1.0 : val === 2 ? 1.5 : 2.4;
            document.getElementById("bouncingSpeedVal").innerText = labels[val - 1];
        });

        document.getElementById("switchAutoNext").addEventListener("change", (e) => {
            this.autoStartNext = e.target.checked;
        });

        document.getElementById("btnNextRoundModal").addEventListener("click", () => {
            if (this.autoNextTimeout) clearTimeout(this.autoNextTimeout);
            $("#winnerModal").modal("hide");
            this.confetti.stop();
            this.currentRound++;
            this.setupRound();
            this.startRound();
        });

        document.getElementById("btnRestartModal").addEventListener("click", () => {
            if (this.autoNextTimeout) clearTimeout(this.autoNextTimeout);
            this.confetti.stop();
            this.resetTournament();
        });

        window.addEventListener("resize", () => this.resizeCanvas());
    }

    resizeCanvas() {
        const wrapper = this.canvas.parentElement;
        const size = Math.min(wrapper.clientWidth, 600);
        this.canvas.width = size * window.devicePixelRatio;
        this.canvas.height = size * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.arenaRadius = (size / 2) * 0.82;
    }

    generateRandomWinRates() {
        PLAYERS_MASTER.forEach(p => {
            p.rawWinWeight = Math.floor(Math.random() * 85) + 15;
        });
        this.recalculateWinRates();
    }

    recalculateWinRates() {
        const activeSet = PLAYERS_MASTER.slice(0, this.maxPlayerCount);
        const totalWeight = activeSet.reduce((sum, p) => sum + (p.rawWinWeight || 50), 0);

        activeSet.forEach(p => {
            p.winPct = parseFloat((((p.rawWinWeight || 50) / totalWeight) * 100).toFixed(1));
        });
    }

    initTournament() {
        this.resizeCanvas();
        this.qualifiedPlayers = [];
        this.currentRound = 1;
        this.generateRandomWinRates();
        this.setupRound();
    }

    setupRound() {
        this.isRunning = false;
        this.isPaused = false;
        this.matchTimeMs = 0;
        clearInterval(this.timerInterval);

        if (this.autoNextTimeout) {
            clearTimeout(this.autoNextTimeout);
            this.autoNextTimeout = null;
        }

        document.getElementById("roundBadge").innerText = `ROUND ${this.currentRound}`;
        document.getElementById("matchTimer").innerHTML = `<i class="fa-regular fa-clock mr-1"></i>0.0s`;
        document.getElementById("btnStart").disabled = false;
        document.getElementById("btnPause").disabled = true;
        document.getElementById("btnPause").innerHTML = `<i class="fa-solid fa-pause mr-1"></i>Pause`;

        // Select available non-qualified players
        const pool = PLAYERS_MASTER.filter(p => !this.qualifiedPlayers.some(q => q.id === p.id));
        const selected = pool.slice(0, this.maxPlayerCount);

        const center = this.canvas.width / (2 * window.devicePixelRatio);
        const radius = this.arenaRadius * 0.55;

        // Position player discs evenly around inside the arena with high initial velocity
        this.activePlayers = selected.map((playerData, i) => {
            const angle = (i / selected.length) * Math.PI * 2;
            const dist = radius * (0.35 + Math.random() * 0.5);
            return {
                ...playerData,
                x: center + Math.cos(angle) * dist,
                y: center + Math.sin(angle) * dist,
                vx: (Math.random() - 0.5) * 14.0,
                vy: (Math.random() - 0.5) * 14.0,
                radius: 22,
                mass: 1.0,
                isEliminated: false
            };
        });

        this.eliminatedPlayers = [];
        this.particles = [];

        this.updateUI();
        this.logFeed(`Round ${this.currentRound} setup ready. ${this.activePlayers.length} players enter the arena!`);
        this.render();
    }

    startRound() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.isPaused = false;

        document.getElementById("btnStart").disabled = true;
        document.getElementById("btnPause").disabled = false;

        this.audio.init();

        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.matchTimeMs += 100;
                const secs = (this.matchTimeMs / 1000).toFixed(1);
                document.getElementById("matchTimer").innerHTML = `<i class="fa-regular fa-clock mr-1"></i>${secs}s`;
            }
        }, 100);

        this.logFeed(`🚀 ROUND ${this.currentRound} STARTED! Lightning 5-6s elimination active!`);
        this.loop();
    }

    togglePause() {
        if (!this.isRunning) return;
        this.isPaused = !this.isPaused;
        const btn = document.getElementById("btnPause");
        btn.innerHTML = this.isPaused ? 
            `<i class="fa-solid fa-play mr-1"></i>Resume` : 
            `<i class="fa-solid fa-pause mr-1"></i>Pause`;

        if (!this.isPaused) this.loop();
    }

    resetTournament() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        if (this.autoNextTimeout) {
            clearTimeout(this.autoNextTimeout);
            this.autoNextTimeout = null;
        }

        this.initTournament();
        this.logFeed(`🔄 Tournament reset! All stats cleared.`);
    }

    // --- PHYSICS ENGINE LOOP ---
    updatePhysics() {
        const center = this.canvas.width / (2 * window.devicePixelRatio);
        
        // 1. Rotate Boundary Gap
        this.gapAngle += this.gapAngularSpeed * this.speedMultiplier;
        if (this.gapAngle > Math.PI * 2) this.gapAngle -= Math.PI * 2;

        const activeCount = this.activePlayers.filter(p => !p.isEliminated).length;

        this.activePlayers.forEach(p => {
            if (p.isEliminated) return;

            // Apply speed multiplier & active outward centrifugal push
            p.x += p.vx * this.speedMultiplier;
            p.y += p.vy * this.speedMultiplier;

            const dx = p.x - center;
            const dy = p.y - center;
            const distFromCenter = Math.hypot(dx, dy) || 1;

            // Outward pressure + energetic jitter
            p.vx += (dx / distFromCenter) * 0.38 + (Math.random() - 0.5) * 0.6;
            p.vy += (dy / distFromCenter) * 0.38 + (Math.random() - 0.5) * 0.6;

            // Limit max speed
            const speed = Math.hypot(p.vx, p.vy);
            if (speed > 19.5) {
                p.vx = (p.vx / speed) * 19.5;
                p.vy = (p.vy / speed) * 19.5;
            }

            // Check Arena Boundary Collision & Rotating Gap Escape
            const playerAngle = Math.atan2(dy, dx);

            // Angle difference with gap center
            let angleDiff = Math.abs(playerAngle - this.gapAngle);
            while (angleDiff > Math.PI) angleDiff = Math.abs(angleDiff - Math.PI * 2);

            // Check if inside the rotating gap opening angle
            const isTargetInGap = angleDiff < (this.gapSizeAngle / 2);

            if (distFromCenter + p.radius >= this.arenaRadius) {
                if (isTargetInGap) {
                    // Pushed through the gap! Check if fully escaped past boundary
                    if (distFromCenter > this.arenaRadius + p.radius) {
                        this.eliminatePlayer(p);
                    }
                } else {
                    // Elastic wall bounce reflection
                    const nx = dx / distFromCenter;
                    const ny = dy / distFromCenter;

                    const dot = p.vx * nx + p.vy * ny;
                    p.vx = (p.vx - 2 * dot * nx) * 0.95;
                    p.vy = (p.vy - 2 * dot * ny) * 0.95;

                    // Reposition disc to stay inside circular wall
                    p.x = center + nx * (this.arenaRadius - p.radius);
                    p.y = center + ny * (this.arenaRadius - p.radius);

                    this.audio.playBounce(Math.hypot(p.vx, p.vy));
                }
            }
        });

        // 2. Disc-to-Disc Elastic Collisions
        for (let i = 0; i < this.activePlayers.length; i++) {
            for (let j = i + 1; j < this.activePlayers.length; j++) {
                const p1 = this.activePlayers[i];
                const p2 = this.activePlayers[j];

                if (p1.isEliminated || p2.isEliminated) continue;

                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.hypot(dx, dy);
                const minDist = p1.radius + p2.radius;

                if (dist < minDist && dist > 0) {
                    // Separate overlapping discs
                    const overlap = 0.5 * (minDist - dist);
                    const nx = dx / dist;
                    const ny = dy / dist;

                    p1.x -= nx * overlap;
                    p1.y -= ny * overlap;
                    p2.x += nx * overlap;
                    p2.y += ny * overlap;

                    // Calculate elastic momentum transfer
                    const kx = p1.vx - p2.vx;
                    const ky = p1.vy - p2.vy;
                    const p = 2 * (nx * kx + ny * ky) / (p1.mass + p2.mass);

                    p1.vx -= p * p2.mass * nx * 0.96;
                    p1.vy -= p * p2.mass * ny * 0.96;
                    p2.vx += p * p1.mass * nx * 0.96;
                    p2.vy += p * p1.mass * ny * 0.96;

                    this.audio.playBounce(Math.hypot(p1.vx, p1.vy));
                }
            }
        }

        // 3. Update Particles
        this.particles.forEach(pt => {
            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.alpha -= 0.02;
        });
        this.particles = this.particles.filter(pt => pt.alpha > 0);
    }

    eliminatePlayer(player) {
        player.isEliminated = true;
        this.eliminatedPlayers.unshift(player);

        // Spawn explosion particles
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 6 + 2;
            this.particles.push({
                x: player.x,
                y: player.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: player.color || "#ff3366",
                size: Math.random() * 6 + 3,
                alpha: 1.0
            });
        }

        this.audio.playEscape();
        this.logFeed(`⚡ ELIMINATED! ${player.flag} <strong>${player.name}</strong> was pushed through the gap!`);

        this.updateUI();

        // Check if only 1 player remains -> Round Winner!
        const remaining = this.activePlayers.filter(p => !p.isEliminated);
        if (remaining.length === 1) {
            this.handleRoundWinner(remaining[0]);
        }
    }

    handleRoundWinner(winner) {
        this.isRunning = false;
        clearInterval(this.timerInterval);

        const masterPlayer = PLAYERS_MASTER.find(p => p.id === winner.id);
        if (masterPlayer) {
            masterPlayer.wins = (masterPlayer.wins || 0) + 1;
            masterPlayer.rawWinWeight = (masterPlayer.rawWinWeight || 50) + 30;
        }
        PLAYERS_MASTER.forEach(p => {
            p.rawWinWeight = Math.max(10, (p.rawWinWeight || 50) + (Math.random() - 0.45) * 12);
        });
        this.recalculateWinRates();

        this.qualifiedPlayers.push(winner);
        this.audio.playVictory();

        // Populate Winner Modal
        document.getElementById("winnerHeaderTitle").innerText = `ROUND ${this.currentRound} QUALIFIER`;
        document.getElementById("winnerMainTitle").innerText = `${winner.name} QUALIFIED!`;
        document.getElementById("winnerName").innerText = winner.name;
        document.getElementById("winnerTeam").innerHTML = `${winner.flag} ${winner.team} • ${winner.country}`;
        document.getElementById("winnerJerseyTag").innerText = `#${winner.jersey}`;
        
        const avatarImg = document.getElementById("winnerAvatarImg");
        if (this.imageCache[winner.id]) {
            avatarImg.src = this.imageCache[winner.id].src;
        } else {
            avatarImg.src = winner.avatarUrl;
        }

        const secs = (this.matchTimeMs / 1000).toFixed(1);
        document.getElementById("winnerTime").innerText = `${secs}s`;
        document.getElementById("winnerStatus").innerText = `QUALIFIED FOR FINAL (#${this.qualifiedPlayers.length})`;

        this.updateUI();
        this.logFeed(`🏆 <strong>${winner.name}</strong> wins Round ${this.currentRound} and qualifies for the Final!`);

        // Show Modal & Trigger Confetti
        $("#winnerModal").modal("show");
        this.confetti.start();

        // Auto-start next round if enabled
        if (this.autoStartNext) {
            if (this.autoNextTimeout) clearTimeout(this.autoNextTimeout);
            this.autoNextTimeout = setTimeout(() => {
                $("#winnerModal").modal("hide");
                this.confetti.stop();
                this.currentRound++;
                this.setupRound();
                this.startRound();
            }, 2800); // 2.8 second victory display before auto-starting
        }
    }

    loop() {
        if (!this.isRunning || this.isPaused) return;

        this.updatePhysics();
        this.render();

        this.animFrameId = requestAnimationFrame(() => this.loop());
    }

    // --- CANVAS RENDERER ---
    render() {
        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;
        const center = width / 2;

        this.ctx.clearRect(0, 0, width, height);

        // 1. Draw Field Turf Background
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(center, center, this.arenaRadius, 0, Math.PI * 2);
        this.ctx.fillStyle = "#0c1838";
        this.ctx.fill();

        // Turf Field Markings
        this.ctx.strokeStyle = "rgba(0, 210, 255, 0.15)";
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Center Pitch Circle
        this.ctx.beginPath();
        this.ctx.arc(center, center, 45, 0, Math.PI * 2);
        this.ctx.stroke();

        this.ctx.restore();

        // 2. Draw Rotating Arena Wall with Glowing Gap
        this.ctx.save();
        this.ctx.lineWidth = 10;

        // Solid Circular Wall Arc
        const startWallAngle = this.gapAngle + this.gapSizeAngle / 2;
        const endWallAngle = this.gapAngle - this.gapSizeAngle / 2 + Math.PI * 2;

        this.ctx.beginPath();
        this.ctx.arc(center, center, this.arenaRadius, startWallAngle, endWallAngle);
        this.ctx.strokeStyle = "#00d2ff";
        this.ctx.shadowColor = "#00d2ff";
        this.ctx.shadowBlur = 15;
        this.ctx.stroke();

        // Gap Edge Warning Nodes (Red Glowing Caps)
        const gapEdge1X = center + Math.cos(startWallAngle) * this.arenaRadius;
        const gapEdge1Y = center + Math.sin(startWallAngle) * this.arenaRadius;
        const gapEdge2X = center + Math.cos(endWallAngle) * this.arenaRadius;
        const gapEdge2Y = center + Math.sin(endWallAngle) * this.arenaRadius;

        this.ctx.fillStyle = "#ff3366";
        this.ctx.shadowColor = "#ff3366";
        this.ctx.shadowBlur = 20;

        this.ctx.beginPath();
        this.ctx.arc(gapEdge1X, gapEdge1Y, 8, 0, Math.PI * 2);
        this.ctx.arc(gapEdge2X, gapEdge2Y, 8, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();

        // 3. Draw Particles
        this.particles.forEach(pt => {
            this.ctx.save();
            this.ctx.globalAlpha = pt.alpha;
            this.ctx.fillStyle = pt.color;
            this.ctx.beginPath();
            this.ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });

        // 4. Draw Active Players (Bouncing Discs)
        this.activePlayers.forEach(p => {
            if (p.isEliminated) return;

            this.ctx.save();
            this.ctx.translate(p.x, p.y);

            // Disc Outer Glow & Border Ring
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color || "#00d2ff";
            this.ctx.shadowColor = p.color || "#00d2ff";
            this.ctx.shadowBlur = 10;
            this.ctx.fill();

            // Avatar Image Clipping
            this.ctx.beginPath();
            this.ctx.arc(0, 0, p.radius - 3, 0, Math.PI * 2);
            this.ctx.clip();

            const img = this.imageCache[p.id];
            if (img && img.complete) {
                this.ctx.drawImage(img, -p.radius, -p.radius, p.radius * 2, p.radius * 2);
            } else {
                // Fallback initial
                this.ctx.fillStyle = "#1e293b";
                this.ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
                this.ctx.fillStyle = "#ffffff";
                this.ctx.font = "bold 14px Montserrat";
                this.ctx.textAlign = "center";
                this.ctx.textBaseline = "middle";
                this.ctx.fillText(p.name.charAt(0), 0, 0);
            }

            this.ctx.restore();

            // Flag & Jersey Number Tag Below Disc
            this.ctx.save();
            this.ctx.font = "bold 11px Montserrat";
            this.ctx.fillStyle = "#ffffff";
            this.ctx.textAlign = "center";
            this.ctx.shadowColor = "#000000";
            this.ctx.shadowBlur = 4;
            this.ctx.fillText(`${p.flag} #${p.jersey}`, p.x, p.y + p.radius + 12);
            this.ctx.restore();
        });
    }

    // --- UI UPDATER ---
    updateUI() {
        const remaining = this.activePlayers.filter(p => !p.isEliminated);
        const total = this.activePlayers.length;

        // Counter & Progress Bar
        document.getElementById("remainingCountText").innerText = `${remaining.length} / ${total}`;
        const pct = (remaining.length / total) * 100;
        document.getElementById("remainingProgressBar").style.width = `${pct}%`;

        // Player Win Rate (%) Sidebar - Dynamic & Randomized
        const wList = document.getElementById("winRateList");
        const wCountBadge = document.getElementById("winRatePlayerCount");
        if (wCountBadge) wCountBadge.innerText = `${total} Players`;

        if (wList) {
            this.recalculateWinRates();
            const sortedPlayers = PLAYERS_MASTER.slice(0, this.maxPlayerCount)
                .sort((a, b) => (b.winPct || 0) - (a.winPct || 0));

            wList.innerHTML = sortedPlayers.map((p) => `
                <div class="winrate-item">
                    <div class="winrate-header">
                        <div class="d-flex align-items-center overflow-hidden mr-2">
                            <img src="${this.imageCache[p.id] ? this.imageCache[p.id].src : p.avatarUrl}" class="winrate-avatar" alt="${p.name}">
                            <span class="winrate-name">${p.flag} ${p.name}</span>
                        </div>
                        <div class="winrate-pct-text">${p.winPct}%</div>
                    </div>
                    <div class="winrate-progress-track">
                        <div class="winrate-progress-fill" style="width: ${Math.max(p.winPct, 4)}%;"></div>
                    </div>
                </div>`).join('');
        }

        // Eliminated Grid Sidebar
        const eGrid = document.getElementById("eliminatedGrid");
        document.getElementById("eliminatedCount").innerText = this.eliminatedPlayers.length;
        if (this.eliminatedPlayers.length === 0) {
            eGrid.innerHTML = `
                <div class="empty-state text-center text-muted py-3">
                    <p class="small m-0">No players eliminated yet.<br>Watch the rotating gap!</p>
                </div>`;
        } else {
            eGrid.innerHTML = this.eliminatedPlayers.map((e, idx) => `
                <div class="eliminated-card">
                    <img src="${this.imageCache[e.id] ? this.imageCache[e.id].src : e.avatarUrl}" class="eliminated-avatar" alt="${e.name}">
                    <span class="eliminated-name">${e.flag} ${e.name}</span>
                    <span class="eliminated-rank-badge">#${total - idx}</span>
                </div>`).join('');
        }
    }

    logFeed(htmlMessage) {
        const feed = document.getElementById("matchFeed");
        if (!feed) return;
        const item = document.createElement("div");
        item.className = "feed-item py-1 px-2 border-bottom border-secondary small text-light";
        item.innerHTML = htmlMessage;
        feed.prepend(item);

        // Keep last 15 entries
        while (feed.children.length > 15) {
            feed.removeChild(feed.lastChild);
        }
    }
}

// --- 5. INITIALIZE ON DOM READY ---
document.addEventListener("DOMContentLoaded", () => {
    window.gameEngine = new FootballArenaGame();
});
