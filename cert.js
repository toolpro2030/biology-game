/**
 * CertificateRenderer - Official Presentation Merit & Achievement Certificate
 * High Definition 1200x850 Canvas Renderer
 * Adapts dynamically to Arabic / English
 * Features:
 *  - Center: Central Academic Arbiter Official 3D Gold Seal
 *  - Right: Academic Supervisor Signature & Date
 *  - Left: Admin Digital Verification ID & Official Witness Accreditation
 *  - Individual Score, Solved Questions, Team Score & Rank
 *  - Direct Export as PNG HD & Landscape PDF Print
 */

(function () {
  'use strict';

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  }

  const CertificateRenderer = {
    draw(canvas, options = {}) {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const width = 1200;
      const height = 850;

      canvas.width = width;
      canvas.height = height;

      const lang = options.lang === 'en' ? 'en' : 'ar';
      const isEn = lang === 'en';

      const studentName = (options.studentName || (isEn ? 'Distinguished Participant' : 'المتسابق المتميز')).trim();
      const teamName = options.teamName || (isEn ? 'Contest Team' : 'فريق المسابقة');
      const teamAvatar = options.teamAvatar || '🐞';
      const teamScore = options.teamScore !== undefined ? options.teamScore : 0;
      const memberScore = options.memberScore !== undefined ? options.memberScore : 0;
      const questionsSolved = options.questionsSolved !== undefined ? options.questionsSolved : 0;
      const rankName = options.rankName || (isEn ? '1st Place 🥇' : 'المركز الأول 🥇');
      const witnessTitle = options.witnessTitle || (isEn ? 'Central Admin Control Panel' : 'لوحة تحكم المشرف المركزية');

      // 1. Rich Background Gradient - Deep Presentation Midnight Navy & Emerald
      const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 720);
      bgGrad.addColorStop(0, '#0F263B');
      bgGrad.addColorStop(0.55, '#0A1C2C');
      bgGrad.addColorStop(1, '#050D15');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Faint Biology Micro-Grid & Vascular Watermark
      ctx.save();
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.035)';
      ctx.lineWidth = 1;
      for (let x = 60; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 40);
        ctx.lineTo(x, height - 40);
        ctx.stroke();
      }
      for (let y = 60; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(40, y);
        ctx.lineTo(width - 40, y);
        ctx.stroke();
      }

      // ECG / Vascular Pulsing Heartbeat line watermark across center
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.06)';
      ctx.lineWidth = 2.5;
      ctx.moveTo(80, 425);
      for (let x = 80; x < width - 80; x += 30) {
        const y = 425 + Math.sin(x * 0.05) * (x > 450 && x < 750 ? 55 : 12);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 3. Ornate Golden Borders & Corner Rosettes
      ctx.save();
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 6;
      ctx.strokeRect(26, 26, width - 52, height - 52);

      ctx.strokeStyle = '#99751C';
      ctx.lineWidth = 1.8;
      ctx.strokeRect(36, 36, width - 72, height - 72);

      ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
      ctx.setLineDash([4, 8]);
      ctx.lineWidth = 1.5;
      ctx.strokeRect(46, 46, width - 92, height - 92);
      ctx.setLineDash([]);

      const corners = [
        { x: 46, y: 46 },
        { x: width - 46, y: 46 },
        { x: 46, y: height - 46 },
        { x: width - 46, y: height - 46 }
      ];
      corners.forEach(c => {
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.strokeStyle = '#FFD700';
        ctx.fillStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 16, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();

      // 4. Header Badge Pill
      ctx.save();
      const pillW = isEn ? 680 : 580;
      const pillH = 36;
      const pillX = (width - pillW) / 2;
      const pillY = 70;
      ctx.fillStyle = 'rgba(212, 175, 55, 0.12)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(pillX, pillY, pillW, pillH, 18);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 15px "Tajawal", "Outfit", "Segoe UI", sans-serif';
      ctx.fillStyle = '#FFD54F';
      ctx.textAlign = 'center';
      const pillText = isEn
        ? '🔬 PRESENTATION ASSESSMENT: CIRCULATORY SYSTEMS IN ANIMALS & INSECTS 🐞'
        : '🔬 مَنْظُومَةُ العَرْضِ التَّقْدِيمِيِّ: الجِهَازُ الدَّوْرِيُّ فِي الحَيَوَانَاتِ وَالحَشَرَاتِ 🐞';
      ctx.fillText(pillText, width / 2, pillY + 24);
      ctx.restore();

      // 5. Main Certificate Title (Golden Calligraphy)
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = isEn ? '900 40px "Outfit", "Segoe UI", sans-serif' : '900 44px "Tajawal", "Amiri", "Traditional Arabic", serif';
      const titleGrad = ctx.createLinearGradient(300, 140, 900, 140);
      titleGrad.addColorStop(0, '#FFE082');
      titleGrad.addColorStop(0.5, '#FFF8E1');
      titleGrad.addColorStop(1, '#FFCA28');
      ctx.fillStyle = titleGrad;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
      ctx.shadowBlur = 14;
      const mainTitle = isEn ? 'CERTIFICATE OF SCIENTIFIC EXCELLENCE' : 'شَـــهَــادَةُ إِنجَـــازٍ وَتَـفَـــوُّقٍ عِلْمِـــيّ';
      ctx.fillText(mainTitle, width / 2, 150);

      ctx.shadowBlur = 0;
      ctx.font = 'italic 600 14px "Outfit", "Segoe UI", sans-serif';
      ctx.fillStyle = '#90A4AE';
      const subTitle = isEn
        ? 'OFFICIAL ACADEMIC RECOGNITION & ACTIVE PRESENTATION PARTICIPATION'
        : 'CERTIFICATE OF SCIENTIFIC EXCELLENCE & ACTIVE CONTRIBUTION';
      ctx.fillText(subTitle, width / 2, 182);
      ctx.restore();

      // 6. Citation Text
      ctx.save();
      ctx.textAlign = 'center';
      ctx.font = '700 17.5px "Tajawal", "Outfit", "Segoe UI", sans-serif';
      ctx.fillStyle = '#ECEFF1';
      const citationText = isEn
        ? 'The Academic Committee & Competition Jury hereby certifies that the distinguished researcher:'
        : 'تَشْهَدُ إِدَارَةُ المَسَابَقَةِ وَلَجْنَةُ التَّحْكِيمِ الأَكَادِيمِيَّةِ بِأَنَّ الطَّالِبَ / البَاحِثَ المتميّز:';
      ctx.fillText(citationText, width / 2, 235);

      // 7. Student Name - Large Glowing Gold Calligraphy
      ctx.font = isEn ? '900 44px "Outfit", "Segoe UI", sans-serif' : '900 48px "Tajawal", "Amiri", serif';
      const nameGrad = ctx.createLinearGradient(350, 300, 850, 300);
      nameGrad.addColorStop(0, '#FFE57F');
      nameGrad.addColorStop(0.5, '#FFFFFF');
      nameGrad.addColorStop(1, '#FFD54F');
      ctx.fillStyle = nameGrad;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
      ctx.shadowBlur = 20;
      ctx.fillText(studentName, width / 2, 300);

      // Underline Ribbon Flourish
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 240, 320);
      ctx.lineTo(width / 2 + 240, 320);
      ctx.stroke();

      // Golden Diamond in Center
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(width / 2, 314);
      ctx.lineTo(width / 2 + 8, 320);
      ctx.lineTo(width / 2, 326);
      ctx.lineTo(width / 2 - 8, 320);
      ctx.closePath();
      ctx.fill();

      // 8. Team Affiliation
      ctx.font = 'bold 22px "Tajawal", "Outfit", "Segoe UI", sans-serif';
      ctx.fillStyle = '#4DD0E1';
      const teamAffil = isEn
        ? `MEMBER OF TEAM: ${teamName} (${teamAvatar})`
        : `عُضْوُ فَرِيقِ: ${teamName} (${teamAvatar})`;
      ctx.fillText(teamAffil, width / 2, 360);

      // Praise description matching the presentation topics
      ctx.font = '500 16px "Tajawal", "Outfit", "Segoe UI", sans-serif';
      ctx.fillStyle = '#B0BEC5';
      if (isEn) {
        ctx.fillText('In recognition of active participation and scientific mastery in animal and insect circulatory physiology,', width / 2, 400);
        ctx.fillText('open vs closed hemolymph dynamics, tubular heart contractions, ostia valve mechanics, and respiratory exchange.', width / 2, 428);
      } else {
        ctx.fillText('تَقْدِيراً لِمُشَارَكَتِهِ الفَعَّالَةِ وَتَفَوُّقِهِ المَعْرِفِيِّ فِي اسْتِيعَابِ فِسْيُولُوجْيَا أَنْظِمَةِ الدَّوَرَانِ المَفْتُوحَةِ وَالمُغْلَقَةِ،', width / 2, 400);
        ctx.fillText('وَآلِيَّاتِ تَدَفُّقِ سَائِلِ الهِيمُولِيمْفِ وَكِفَاءَةِ القُلُوبِ الأُنْبُوبِيَّةِ وَصَمَّامَاتِ الأُوسْتْيَا وَتَبَادُلِ الغَازَاتِ فِي الكَائِنَاتِ الحَيَّةِ.', width / 2, 428);
      }
      ctx.restore();

      // 9. Stat Cards Row (3 Cards: Member Score, Questions Solved, Team Score & Rank)
      const cardY = 475;
      const cardH = 100;
      const cardW = 310;
      const gap = 35;
      const startX = (width - (cardW * 3 + gap * 2)) / 2;

      const cardsData = isEn ? [
        {
          icon: '⭐',
          title: 'Individual Score',
          val: `${memberScore >= 0 ? '+' : ''}${memberScore} PTS`,
          sub: 'Direct Personal Merit',
          color: '#69F0AE',
          bg: 'rgba(0, 230, 118, 0.08)',
          border: 'rgba(0, 230, 118, 0.4)'
        },
        {
          icon: '🎯',
          title: 'Challenges Solved',
          val: `${questionsSolved} Solved`,
          sub: 'Accurate Scientific Answers',
          color: '#40C4FF',
          bg: 'rgba(0, 176, 255, 0.08)',
          border: 'rgba(0, 176, 255, 0.4)'
        },
        {
          icon: '🏆',
          title: 'Team Total Score & Rank',
          val: `${teamScore} PTS`,
          sub: rankName,
          color: '#FFD740',
          bg: 'rgba(255, 215, 64, 0.08)',
          border: 'rgba(255, 215, 64, 0.4)'
        }
      ] : [
        {
          icon: '⭐',
          title: 'النقاط الفردية المكتسبة',
          val: `${memberScore >= 0 ? '+' : ''}${memberScore} نقطة`,
          sub: 'إنجاز شخصي مباشر',
          color: '#69F0AE',
          bg: 'rgba(0, 230, 118, 0.08)',
          border: 'rgba(0, 230, 118, 0.4)'
        },
        {
          icon: '🎯',
          title: 'التحديات المنجزة بنجاح',
          val: `${questionsSolved} أسئلة/أنشطة`,
          sub: 'حل علمي دقيق',
          color: '#40C4FF',
          bg: 'rgba(0, 176, 255, 0.08)',
          border: 'rgba(0, 176, 255, 0.4)'
        },
        {
          icon: '🏆',
          title: 'مجموع سكور الفريق والترتيب',
          val: `${teamScore} نقطة`,
          sub: rankName,
          color: '#FFD740',
          bg: 'rgba(255, 215, 64, 0.08)',
          border: 'rgba(255, 215, 64, 0.4)'
        }
      ];

      cardsData.forEach((cd, i) => {
        const cx = startX + i * (cardW + gap);
        ctx.save();
        ctx.fillStyle = cd.bg;
        ctx.strokeStyle = cd.border;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(cx, cardY, cardW, cardH, 14);
        ctx.fill();
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.font = 'bold 13.5px "Tajawal", "Outfit", "Segoe UI", sans-serif';
        ctx.fillStyle = '#CFD8DC';
        ctx.fillText(`${cd.icon} ${cd.title}`, cx + cardW / 2, cardY + 28);

        ctx.font = '900 24px "Tajawal", "Outfit", sans-serif';
        ctx.fillStyle = cd.color;
        ctx.fillText(cd.val, cx + cardW / 2, cardY + 62);

        ctx.font = '600 12.5px "Tajawal", "Outfit", sans-serif';
        ctx.fillStyle = '#90A4AE';
        ctx.fillText(cd.sub, cx + cardW / 2, cardY + 86);
        ctx.restore();
      });

      // 10. Official Footer Triad:
      //  - LEFT: Admin Verification & Witness Accreditation
      //  - CENTER: Central Academic Arbiter 3D Golden Seal
      //  - RIGHT: Academic Supervisor Signature & Date
      const footerY = 638;

      // -------------------------------------------------------------
      // LEFT BOX: Admin Digital Verification & Witness Accreditation
      // -------------------------------------------------------------
      ctx.save();
      const verW = 260;
      const verH = 125;
      const verX = 90;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(verX, footerY, verW, verH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 12px "Tajawal", "Outfit", sans-serif';
      ctx.fillStyle = '#FFD54F';
      const verHeader = isEn ? '🛡️ Admin Verification & Accreditation' : '🛡️ كود التحقق والاعتماد الصادر من الأدمن';
      ctx.fillText(verHeader, verX + verW / 2, footerY + 26);

      ctx.font = 'bold 16px "Outfit", monospace';
      ctx.fillStyle = '#ECEFF1';
      const certCode = 'BIO-ADMIN-' + hashString(studentName + teamName);
      ctx.fillText(certCode, verX + verW / 2, footerY + 54);

      ctx.font = '600 11.5px "Tajawal", "Outfit", sans-serif';
      ctx.fillStyle = '#80DEEA';
      const witnessLine = isEn ? `Witness: ${witnessTitle}` : `الشاهد: ${witnessTitle}`;
      ctx.fillText(witnessLine, verX + verW / 2, footerY + 80);

      ctx.font = '500 11px "Tajawal", "Outfit", sans-serif';
      ctx.fillStyle = '#78909C';
      const recordLine = isEn ? 'Official System Record 2026' : 'اعتماد رسمي مسجل بالمنظومة 2026';
      ctx.fillText(recordLine, verX + verW / 2, footerY + 104);
      ctx.restore();

      // -------------------------------------------------------------
      // CENTER: 3D Official Gold Biology Academic Arbiter Seal
      // -------------------------------------------------------------
      ctx.save();
      const sealX = width / 2;
      const sealY = footerY + 62;
      const sealR = 56;

      // 16-point golden starburst background
      ctx.fillStyle = '#D4AF37';
      ctx.beginPath();
      const points = 16;
      for (let p = 0; p < points * 2; p++) {
        const radius = (p % 2 === 0) ? sealR + 6 : sealR - 4;
        const angle = (p * Math.PI) / points;
        const px = sealX + Math.cos(angle) * radius;
        const py = sealY + Math.sin(angle) * radius;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();

      // Inner Seal Circle with Gold Radial Gradient
      const sealGrad = ctx.createRadialGradient(sealX - 10, sealY - 10, 5, sealX, sealY, sealR);
      sealGrad.addColorStop(0, '#FFE082');
      sealGrad.addColorStop(0.6, '#FFB300');
      sealGrad.addColorStop(1, '#FF8F00');
      ctx.fillStyle = sealGrad;
      ctx.beginPath();
      ctx.arc(sealX, sealY, sealR - 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Seal Inscription Text
      ctx.textAlign = 'center';
      ctx.fillStyle = '#3E2723';
      if (isEn) {
        ctx.font = '900 10.5px "Outfit", sans-serif';
        ctx.fillText('★ OFFICIAL ARBITER ★', sealX, sealY - 18);
        ctx.font = '900 19px "Outfit", sans-serif';
        ctx.fillText('2026', sealX, sealY + 3);
        ctx.font = '800 9px "Outfit", sans-serif';
        ctx.fillText('ACADEMIC JURY', sealX, sealY + 20);
        ctx.fillText('BIOLOGY SEAL', sealX, sealY + 32);
      } else {
        ctx.font = '900 11px "Tajawal", sans-serif';
        ctx.fillText('★ المُحَكِّمُ الأَكَادِيمِيُّ ★', sealX, sealY - 18);
        ctx.font = '900 19px "Outfit", sans-serif';
        ctx.fillText('2026', sealX, sealY + 3);
        ctx.font = '800 10px "Tajawal", sans-serif';
        ctx.fillText('خَتْمُ التَّفَوُّقِ وَالتَّحْكِيمِ', sealX, sealY + 20);
        ctx.font = '800 8.5px "Outfit", sans-serif';
        ctx.fillText('OFFICIAL ARBITER', sealX, sealY + 32);
      }
      ctx.restore();

      // -------------------------------------------------------------
      // RIGHT BOX: Academic Supervisor Signature & Date
      // -------------------------------------------------------------
      ctx.save();
      const sigW = 260;
      const sigH = 125;
      const sigX = width - 90 - sigW;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(sigX, footerY, sigW, sigH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.font = 'bold 12px "Tajawal", "Outfit", sans-serif';
      ctx.fillStyle = '#CFD8DC';
      const dateText = isEn ? '📅 Date: October 2026' : '📅 التاريخ: أكتوبر 2026 م';
      ctx.fillText(dateText, sigX + sigW / 2, footerY + 26);

      ctx.font = isEn ? 'italic 700 20px "Outfit", cursive' : 'italic 700 20px "Amiri", "Traditional Arabic", cursive';
      ctx.fillStyle = '#80DEEA';
      const profName = isEn ? 'Dr. Academic Supervisor' : 'د. المشرف الأكاديمي';
      ctx.fillText(profName, sigX + sigW / 2, footerY + 62);

      // Gold Signature Line
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(sigX + 30, footerY + 76);
      ctx.lineTo(sigX + sigW - 30, footerY + 76);
      ctx.stroke();

      ctx.font = '600 11px "Tajawal", "Outfit", sans-serif';
      ctx.fillStyle = '#90A4AE';
      const boardText = isEn ? 'Academic Evaluation & Jury Board' : 'لجنة الإشراف الأكاديمي والتحكيم';
      ctx.fillText(boardText, sigX + sigW / 2, footerY + 98);
      const chairText = isEn ? 'Comparative Animal Physiology' : 'أستاذ علم الحيوان والفسيولوجيا';
      ctx.fillText(chairText, sigX + sigW / 2, footerY + 114);
      ctx.restore();
    },

    downloadPng(canvas, filename) {
      if (!canvas) return;
      const link = document.createElement('a');
      link.download = filename || 'شهادة_إنجاز_الجهاز_الدوري.png';
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    },

    printPdf(canvas, title = 'شهادة الإنجاز') {
      if (!canvas) return;
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('يرجى السماح بالنوافذ المنبثقة لطباعة الشهادة.');
        return;
      }
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            @page {
              size: landscape;
              margin: 0;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: #000;
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            img {
              max-width: 100vw;
              max-height: 100vh;
              width: 100%;
              height: auto;
              object-fit: contain;
              display: block;
            }
            @media print {
              body {
                background: transparent;
              }
              img {
                width: 100%;
                height: 100%;
              }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Certificate" onload="window.focus(); window.print();" />
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  window.CertificateRenderer = CertificateRenderer;
})();
