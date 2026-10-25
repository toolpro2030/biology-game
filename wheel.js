/**
 * High-Performance Canvas Wheel Engine
 * Features: Realistic physics, peg collision & flapper animation,
 * high-DPI retina rendering, customizable spin power, and confetti celebration.
 */

class SpinnerWheel {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.options = options;

    // Segment definitions matching the reference image
    this.segments = [
      {
        id: 'quickQuiz',
        titleEn: 'Quick Quiz',
        titleAr: 'اختبار سريع',
        icon: '💡',
        color: '#FF6584',      // Vibrant Rose Pink
        textColor: '#FFFFFF',
        accentColor: '#FF3366'
      },
      {
        id: 'mysteryClue',
        titleEn: 'Mystery Clue',
        titleAr: 'اللغز الغامض',
        icon: '🔍',
        color: '#FFCA3A',      // Sunny Gold Yellow
        textColor: '#4A3400',
        accentColor: '#E6AD00'
      },
      {
        id: 'fixMistake',
        titleEn: 'Fix the Mistake',
        titleAr: 'صحّح الخطأ',
        icon: '❌',
        color: '#BA8DFF',      // Soft Lavender Mauve
        textColor: '#FFFFFF',
        accentColor: '#9D65F0'
      },
      {
        id: 'actItOut',
        titleEn: 'Act It Out',
        titleAr: 'مثّلها بدون كلام',
        icon: '🎭',
        color: '#4CC9F0',      // Aqua Sky Blue
        textColor: '#0B3B60',
        accentColor: '#17A2B8'
      },
      {
        id: 'explainItFast',
        titleEn: 'Explain It Fast',
        titleAr: 'اشرحها بسرعة',
        icon: '⏱️',
        color: '#8AC926',      // Fresh Lime Green
        textColor: '#FFFFFF',
        accentColor: '#6FA41A'
      },
      {
        id: 'luckyBug',
        titleEn: 'Lucky Bug',
        titleAr: 'حشرة الحظ',
        icon: '⭐',
        color: '#8E7DBE',      // Periwinkle Violet
        textColor: '#FFFFFF',
        accentColor: '#705CA6'
      }
    ];

    this.numSegments = this.segments.length;
    this.segmentArc = (2 * Math.PI) / this.numSegments;

    // Wheel state
    this.rotation = 0;
    this.angularVelocity = 0;
    this.isSpinning = false;
    this.lastTimestamp = 0;

    // Pointer & Peg collision
    this.flapperAngle = 0;       // Deflection angle of top flapper in radians
    this.flapperVelocity = 0;
    this.totalPegs = 12;         // 6 dividers + 6 midpoints for rhythmic ticks
    this.pegArc = (2 * Math.PI) / this.totalPegs;
    this.lastPegCrossed = -1;

    // Particles & Confetti
    this.confettiParticles = [];

    // Callbacks
    this.onSpinStart = options.onSpinStart || null;
    this.onSpinEnd = options.onSpinEnd || null;
    this.onPegTick = options.onPegTick || null;

    // Initialize dimensions and render loop
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Drag-to-spin interaction support
    this.initInteraction();

    // Start render loop
    this.render = this.render.bind(this);
    requestAnimationFrame(this.render);
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 560;
    this.height = rect.height || 560;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);

    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
    this.radius = Math.min(this.width, this.height) / 2 - 16;
  }

  // Calculate segment index currently at 12 o'clock pointer
  getCurrentSegmentIndex() {
    // Pointer is at top: 3*pi/2 (or -pi/2).
    // Segment 0 center is at 3*pi/2 when rotation = 0.
    // Segment 0 range: [3*pi/2 - segmentArc/2, 3*pi/2 + segmentArc/2]
    // In local wheel coords: localAngle = (-pi/2 - rotation) mod 2pi
    const pointerAngle = -Math.PI / 2;
    let localAngle = (pointerAngle - this.rotation) % (2 * Math.PI);
    if (localAngle < 0) localAngle += 2 * Math.PI;

    // Segment 0 starts at (pointerAngle - segmentArc/2) = -pi/2 - pi/6 = 4*pi/3 in [0, 2pi)
    let start0 = (pointerAngle - this.segmentArc / 2) % (2 * Math.PI);
    if (start0 < 0) start0 += 2 * Math.PI;

    let relativeAngle = (localAngle - start0) % (2 * Math.PI);
    if (relativeAngle < 0) relativeAngle += 2 * Math.PI;

    const index = Math.floor(relativeAngle / this.segmentArc) % this.numSegments;
    return index;
  }

  getCurrentSegment() {
    const idx = this.getCurrentSegmentIndex();
    return this.segments[idx];
  }

  // Spin the wheel with organic randomized physics
  spin(forceMultiplier = 1) {
    if (this.isSpinning) return false;

    // Check if external conditions allow spinning (e.g., player joined, not blocked, not frozen)
    if (this.options.beforeSpin && typeof this.options.beforeSpin === 'function') {
      if (!this.options.beforeSpin()) {
        return false;
      }
    }

    this.isSpinning = true;
    if (this.onSpinStart) this.onSpinStart();

    // Initial angular velocity: between 18 and 30 rad/sec with extra randomization
    const baseForce = 22 + Math.random() * 10;
    this.angularVelocity = baseForce * forceMultiplier;
    this.friction = 0.985 + Math.random() * 0.005; // Smooth exponential deceleration

    return true;
  }

  // Spin to a specific activity index (for presentations/controlled demos if needed)
  spinToSegment(targetIndex) {
    if (this.isSpinning) return;
    this.targetSegment = targetIndex;
    this.spin(1.1);
  }

  // Touch and mouse drag / flick to spin
  initInteraction() {
    let isDragging = false;
    let lastAngle = 0;
    let lastTime = 0;
    let dragVelocity = 0;

    const getAngle = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left - this.centerX;
      const y = clientY - rect.top - this.centerY;
      return Math.atan2(y, x);
    };

    const onStart = (e) => {
      if (this.isSpinning) return;
      if (this.options.beforeSpin && typeof this.options.beforeSpin === 'function') {
        if (!this.options.beforeSpin()) {
          return;
        }
      }
      isDragging = true;
      lastAngle = getAngle(e);
      lastTime = performance.now();
      dragVelocity = 0;
    };

    const onMove = (e) => {
      if (!isDragging || this.isSpinning) return;
      const currentAngle = getAngle(e);
      const currentTime = performance.now();
      let deltaAngle = currentAngle - lastAngle;

      // Wrap around handling
      if (deltaAngle > Math.PI) deltaAngle -= 2 * Math.PI;
      if (deltaAngle < -Math.PI) deltaAngle += 2 * Math.PI;

      this.rotation += deltaAngle;
      const dt = (currentTime - lastTime) / 1000;
      if (dt > 0.005) {
        dragVelocity = deltaAngle / dt;
      }

      lastAngle = currentAngle;
      lastTime = currentTime;
    };

    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;

      // If flicked with sufficient speed, trigger spin!
      if (Math.abs(dragVelocity) > 6) {
        if (this.options.beforeSpin && typeof this.options.beforeSpin === 'function') {
          if (!this.options.beforeSpin()) {
            return;
          }
        }
        this.angularVelocity = Math.min(Math.max(dragVelocity, -35), 35);
        this.friction = 0.986;
        this.isSpinning = true;
        if (this.onSpinStart) this.onSpinStart();
      }
    };

    this.canvas.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);

    this.canvas.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

  // Main animation and physics tick
  updatePhysics(deltaTime) {
    if (this.isSpinning) {
      // Apply deceleration
      this.rotation += this.angularVelocity * deltaTime;
      this.angularVelocity *= Math.pow(this.friction, deltaTime * 60);

      // Peg collision detection
      // Check which peg is crossing 12 o'clock (3*pi/2)
      const pointerAngle = -Math.PI / 2;
      let localAngle = (pointerAngle - this.rotation) % (2 * Math.PI);
      if (localAngle < 0) localAngle += 2 * Math.PI;

      const currentPeg = Math.floor(localAngle / this.pegArc);
      if (currentPeg !== this.lastPegCrossed) {
        this.lastPegCrossed = currentPeg;
        // Pointer deflection
        const velocityRatio = Math.min(Math.abs(this.angularVelocity) / 25, 1.2);
        this.flapperAngle = 0.35 * Math.sign(this.angularVelocity || 1);
        
        if (this.onPegTick) {
          this.onPegTick(velocityRatio);
        }
      }

      // Check stopping condition
      if (Math.abs(this.angularVelocity) < 0.08) {
        this.angularVelocity = 0;
        this.isSpinning = false;

        // Trigger confetti celebration
        this.spawnConfetti();

        // Trigger onSpinEnd callback
        const winningSegment = this.getCurrentSegment();
        if (this.onSpinEnd) {
          setTimeout(() => {
            this.onSpinEnd(winningSegment);
          }, 350);
        }
      }
    }

    // Flapper spring physics back to resting position
    const springConstant = 25;
    const damping = 6;
    const flapperForce = -springConstant * this.flapperAngle;
    this.flapperVelocity += flapperForce * deltaTime;
    this.flapperVelocity *= Math.exp(-damping * deltaTime);
    this.flapperAngle += this.flapperVelocity * deltaTime;

    // Update confetti particles
    this.updateConfetti(deltaTime);
  }

  // Spawn celebration confetti
  spawnConfetti() {
    const colors = ['#FF6584', '#FFCA3A', '#BA8DFF', '#4CC9F0', '#8AC926', '#FFD152', '#FFFFFF'];
    for (let i = 0; i < 70; i++) {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5;
      const speed = 250 + Math.random() * 400;
      this.confettiParticles.push({
        x: this.centerX,
        y: this.centerY - this.radius + 20,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 7 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        life: 1.2 + Math.random() * 1.0
      });
    }
  }

  updateConfetti(deltaTime) {
    const gravity = 550;
    for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
      const p = this.confettiParticles[i];
      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
      p.vy += gravity * deltaTime;
      p.rotation += p.rotSpeed * deltaTime;
      p.life -= deltaTime;
      p.alpha = Math.max(0, p.life / 2);

      if (p.life <= 0 || p.y > this.height + 50) {
        this.confettiParticles.splice(i, 1);
      }
    }
  }

  // Render loop
  render(timestamp) {
    if (!this.lastTimestamp) this.lastTimestamp = timestamp;
    const deltaTime = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    this.updatePhysics(deltaTime);

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw the Wheel assembly
    this.ctx.save();
    this.ctx.translate(this.centerX, this.centerY);

    // 1. Shadow underneath the wheel for premium depth
    this.drawWheelShadow();

    // 2. Rotate and draw rotating segments & rim
    this.ctx.save();
    this.ctx.rotate(this.rotation);
    this.drawSegments();
    this.drawOuterRim();
    this.ctx.restore();

    // 3. Center Ladybug Cap (Fixed or rotating? Fixed looks adorable and professional!)
    this.drawCenterLadybug();

    // 4. Pointer / Flapper Pin at 12 o'clock
    this.drawTopPointer();

    this.ctx.restore();

    // 5. Draw overlay confetti particles
    this.drawConfetti();

    requestAnimationFrame(this.render);
  }

  drawWheelShadow() {
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(0, 10, this.radius + 6, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(230, 74, 117, 0.12)';
    this.ctx.filter = 'blur(12px)';
    this.ctx.fill();
    this.ctx.filter = 'none';
    this.ctx.restore();
  }

  drawSegments() {
    const lang = (window.activityManager && window.activityManager.getLanguage()) || 'ar';
    // Offset segment 0 so it centers at 12 o'clock: -pi/2
    const startOffset = -Math.PI / 2 - this.segmentArc / 2;

    for (let i = 0; i < this.numSegments; i++) {
      const seg = this.segments[i];
      const startAngle = startOffset + i * this.segmentArc;
      const endAngle = startAngle + this.segmentArc;
      const midAngle = startAngle + this.segmentArc / 2;

      // Draw segment pie slice
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(0, 0);
      this.ctx.arc(0, 0, this.radius, startAngle, endAngle);
      this.ctx.closePath();

      // Rich gradient for a glossy dimensional look
      const grad = this.ctx.createRadialGradient(0, 0, 40, 0, 0, this.radius);
      grad.addColorStop(0, '#FFFFFF');
      grad.addColorStop(0.2, seg.color);
      grad.addColorStop(1, seg.accentColor || seg.color);
      this.ctx.fillStyle = grad;
      this.ctx.fill();

      // Segment separator line
      this.ctx.lineWidth = 3.5;
      this.ctx.strokeStyle = '#FFFFFF';
      this.ctx.stroke();

      // Content inside slice: Icon and Text
      this.ctx.save();
      this.ctx.rotate(midAngle);

      // Icon placement
      const iconDist = this.radius * 0.48;
      this.ctx.font = `${Math.round(this.radius * 0.14)}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillText(seg.icon, iconDist, 0);

      // Title placement
      const textDist = this.radius * 0.72;
      const isArabic = (lang === 'ar');
      const title = isArabic ? seg.titleAr : seg.titleEn;

      this.ctx.font = `bold ${Math.round(this.radius * 0.065)}px 'Outfit', 'Cairo', 'Tajawal', sans-serif`;
      this.ctx.fillStyle = seg.textColor;
      this.ctx.shadowColor = 'rgba(0,0,0,0.2)';
      this.ctx.shadowBlur = 4;
      this.ctx.shadowOffsetY = 1;

      // Two-line wrapping if needed
      const words = title.split(' ');
      if (words.length > 2) {
        const line1 = words.slice(0, 2).join(' ');
        const line2 = words.slice(2).join(' ');
        this.ctx.fillText(line1, textDist, -9);
        this.ctx.fillText(line2, textDist, 10);
      } else {
        this.ctx.fillText(title, textDist, 0);
      }

      this.ctx.restore();
      this.ctx.restore();
    }
  }

  drawOuterRim() {
    const rimRadius = this.radius;
    const rimWidth = 14;

    this.ctx.save();

    // Outer pink border
    this.ctx.beginPath();
    this.ctx.arc(0, 0, rimRadius + rimWidth / 2, 0, Math.PI * 2);
    this.ctx.lineWidth = rimWidth;
    this.ctx.strokeStyle = '#FF5C8A';
    this.ctx.stroke();

    // Inner subtle highlight ring
    this.ctx.beginPath();
    this.ctx.arc(0, 0, rimRadius - 2, 0, Math.PI * 2);
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#FFAAC2';
    this.ctx.stroke();

    // Draw 12 white round rivets/pegs around the border
    for (let i = 0; i < this.totalPegs; i++) {
      const angle = i * this.pegArc;
      const pegX = Math.cos(angle) * (rimRadius + 1);
      const pegY = Math.sin(angle) * (rimRadius + 1);

      // Peg shadow
      this.ctx.beginPath();
      this.ctx.arc(pegX, pegY + 1.5, 5, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(180, 20, 60, 0.4)';
      this.ctx.fill();

      // Peg body
      this.ctx.beginPath();
      this.ctx.arc(pegX, pegY, 4.5, 0, Math.PI * 2);
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.fill();

      // Peg gleam
      this.ctx.beginPath();
      this.ctx.arc(pegX - 1, pegY - 1, 1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      this.ctx.fill();
    }

    this.ctx.restore();
  }

  // Draw the Center Ladybug Badge
  drawCenterLadybug() {
    const hubRadius = this.radius * 0.26;
    this.ctx.save();

    // Hub drop shadow
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.18)';
    this.ctx.shadowBlur = 12;
    this.ctx.shadowOffsetY = 4;

    // Hub white circle
    this.ctx.beginPath();
    this.ctx.arc(0, 0, hubRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();

    // Dashed stitch border
    this.ctx.shadowColor = 'transparent';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, hubRadius - 4, 0, Math.PI * 2);
    this.ctx.setLineDash([5, 4]);
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#FF8DAA';
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Vector Ladybug Illustration!
    const bugScale = hubRadius / 60;
    this.ctx.scale(bugScale, bugScale);

    // Antennae
    this.ctx.lineWidth = 3;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = '#2B2B2B';

    // Left antenna
    this.ctx.beginPath();
    this.ctx.moveTo(-10, -18);
    this.ctx.quadraticCurveTo(-22, -32, -18, -36);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(-18, -36, 3, 0, Math.PI * 2);
    this.ctx.fillStyle = '#2B2B2B';
    this.ctx.fill();

    // Right antenna
    this.ctx.beginPath();
    this.ctx.moveTo(10, -18);
    this.ctx.quadraticCurveTo(22, -32, 18, -36);
    this.ctx.stroke();
    this.ctx.beginPath();
    this.ctx.arc(18, -36, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // Head
    this.ctx.beginPath();
    this.ctx.arc(0, -14, 16, 0, Math.PI * 2);
    this.ctx.fillStyle = '#2A2A2A';
    this.ctx.fill();

    // Cute smiling Eyes
    this.ctx.beginPath();
    this.ctx.arc(-6, -16, 3.2, 0, Math.PI * 2);
    this.ctx.arc(6, -16, 3.2, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();

    // Pupils
    this.ctx.beginPath();
    this.ctx.arc(-5.5, -16, 1.8, 0, Math.PI * 2);
    this.ctx.arc(6.5, -16, 1.8, 0, Math.PI * 2);
    this.ctx.fillStyle = '#111111';
    this.ctx.fill();

    // Cute blush cheeks on head
    this.ctx.beginPath();
    this.ctx.arc(-10, -11, 2.5, 0, Math.PI * 2);
    this.ctx.arc(10, -11, 2.5, 0, Math.PI * 2);
    this.ctx.fillStyle = 'rgba(255, 105, 135, 0.7)';
    this.ctx.fill();

    // Ladybug Body (Red wings)
    this.ctx.beginPath();
    this.ctx.arc(0, 10, 24, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FF3B56';
    this.ctx.fill();

    // Center wing dividing line
    this.ctx.beginPath();
    this.ctx.moveTo(0, -12);
    this.ctx.lineTo(0, 34);
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#222222';
    this.ctx.stroke();

    // Black spots on wings
    const spots = [
      { x: -11, y: 0, r: 4.5 },
      { x: -13, y: 15, r: 4 },
      { x: -5, y: 24, r: 3.5 },
      { x: 11, y: 0, r: 4.5 },
      { x: 13, y: 15, r: 4 },
      { x: 5, y: 24, r: 3.5 }
    ];
    this.ctx.fillStyle = '#1F1F1F';
    spots.forEach(sp => {
      this.ctx.beginPath();
      this.ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // Shiny wing glint
    this.ctx.beginPath();
    this.ctx.arc(-10, 5, 14, -Math.PI / 2, 0);
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Draw the Top Pointer at 12 o'clock with realistic spring tilt
  drawTopPointer() {
    this.ctx.save();
    // Position at top of outer rim
    const topY = -this.radius - 12;
    this.ctx.translate(0, topY);

    // Apply flapper spring rotation around its anchor
    this.ctx.rotate(this.flapperAngle);

    // Drop shadow for pointer
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    this.ctx.shadowBlur = 8;
    this.ctx.shadowOffsetY = 4;

    // Teardrop / Pin Pointer Body
    this.ctx.beginPath();
    this.ctx.moveTo(0, 36); // Pointing DOWN towards center of wheel
    this.ctx.bezierCurveTo(18, 12, 18, -16, 0, -16);
    this.ctx.bezierCurveTo(-18, -16, -18, 12, 0, 36);
    this.ctx.closePath();

    // Pink gradient for pin
    const pinGrad = this.ctx.createLinearGradient(-15, -16, 15, 36);
    pinGrad.addColorStop(0, '#FF4571');
    pinGrad.addColorStop(1, '#E62454');
    this.ctx.fillStyle = pinGrad;
    this.ctx.fill();

    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = '#FFFFFF';
    this.ctx.stroke();

    // Center white dot on pin
    this.ctx.shadowColor = 'transparent';
    this.ctx.beginPath();
    this.ctx.arc(0, -2, 6, 0, Math.PI * 2);
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fill();

    this.ctx.restore();
  }

  drawConfetti() {
    for (let p of this.confettiParticles) {
      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }
  }
}

window.SpinnerWheel = SpinnerWheel;
