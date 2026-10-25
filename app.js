/**
 * Player Game Controller (index.html)
 * - Negative score support (answers can deduct points below zero)
 * - Fix the Mistake & Mystery Clue now feature 4 interactive choices with assistance penalties
 * - Act It Out & Explain It Fast evaluated strictly by Admin from admin.html
 * - Student is locked into their team once joined
 * - Clean interface without any Admin links or tamperable controls
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const wheelCanvas = document.getElementById('wheelCanvas');
  const spinBtn = document.getElementById('spinBtn');
  const langToggleBtn = document.getElementById('langToggleBtn');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const presentationBtn = document.getElementById('presentationBtn');
  const joinTeamBtn = document.getElementById('joinTeamBtn');
  const recentSpinsContainer = document.getElementById('recentSpinsBadges');
  const playerTeamBadge = document.getElementById('playerTeamBadge');
  const playerTeamBadgeText = document.getElementById('playerTeamBadgeText');

  // Activity Modal
  const activityModalBackdrop = document.getElementById('activityModalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalHeader = document.getElementById('modalHeader');
  const modalIcon = document.getElementById('modalIcon');
  const modalTitle = document.getElementById('modalTitle');
  const modalSubtitle = document.getElementById('modalSubtitle');
  const modalBodyContent = document.getElementById('modalBodyContent');
  const awardPointsArea = document.getElementById('awardPointsArea');

  // Join Team Modal
  const joinTeamModalBackdrop = document.getElementById('joinTeamModalBackdrop');
  const joinCloseBtn = document.getElementById('joinCloseBtn');
  const joinPlayerNameInput = document.getElementById('joinPlayerNameInput');
  const joinTeamCodeInput = document.getElementById('joinTeamCodeInput');
  const submitJoinTeamBtn = document.getElementById('submitJoinTeamBtn');
  const joinStatusMessage = document.getElementById('joinStatusMessage');
  const joinAvailableTeamsList = document.getElementById('joinAvailableTeamsList');

  // Share & QR Code Modal
  const shareQrBtn = document.getElementById('shareQrBtn');
  const shareQrModalBackdrop = document.getElementById('shareQrModalBackdrop');
  const shareQrCloseBtn = document.getElementById('shareQrCloseBtn');
  const shareQrCodeImg = document.getElementById('shareQrCodeImg');
  const shareUrlInput = document.getElementById('shareUrlInput');
  const btnCopyShareUrl = document.getElementById('btnCopyShareUrl');

  // Certificate Modal Elements
  const openCertBtn = document.getElementById('openCertBtn');
  const certModalBackdrop = document.getElementById('certModalBackdrop');
  const certCloseBtn = document.getElementById('certCloseBtn');
  const certTeamSelect = document.getElementById('certTeamSelect');
  const certMemberSelect = document.getElementById('certMemberSelect');
  const certCustomNameInput = document.getElementById('certCustomNameInput');
  const certLangSelect = document.getElementById('certLangSelect');
  const btnDownloadCertPng = document.getElementById('btnDownloadCertPng');
  const btnPrintCertPdf = document.getElementById('btnPrintCertPdf');
  const certCanvas = document.getElementById('certCanvas');

  // State
  let currentLang = window.activityManager.getLanguage() || 'ar';
  let recentSpins = [];
  let currentTimerInterval = null;
  let lastProcessedTrigger = 0;
  let lastProcessedEvalTimestamp = 0;
  let isSubmittingAnswer = false; // Debounce guard against rapid double-clicks

  // Registered Student isolated per browser tab session
  let myTeamId = sessionStorage.getItem('my_registered_team_id');
  let myPlayerName = sessionStorage.getItem('my_registered_player_name');
  const leaveTeamBtn = document.getElementById('leaveTeamBtn');

  // Translations
  const UI_TRANSLATIONS = {
    ar: {
      appTitle: 'الجهاز الدوري في الحيوانات والحشرات',
      appSubtitle: 'مسابقة العرض التقديمي: النظم المفتوحة والمغلقة',
      spinWheel: 'دَوِّر العجلة الآن!',
      spinHint: '💡 يمكنك أيضاً سحب العجلة بيدك أو بالماوس لتدويرها!',
      scoreboardTitle: 'لوحة نتائج الفرق (Scoreboard)',
      rosterTitle: 'أقسام وتحديات العجلة الـ 6',
      recentSpins: 'آخر الأنشطة:',
      joinTeamBtn: 'انضم لفريقك',
      leaveTeamBtn: 'مغادرة الفريق',
      turnBadge: 'دوره الآن',
      timeRemaining: 'الوقت المتبقي:',
      seconds: 'ثانية',
      tapToRevealPrompt: 'اضغط هنا لكشف التحدي السري للممثل 🎭',
      tabooForbidden: 'الكلمات المحظورة (ممنوع نطقها):',
      luckyClickBox: 'انقر على صندوق المفاجآت لفتحه! 🎁',
      joinModalTitle: 'انضم إلى فريقك للمسابقة',
      joinModalSub: 'الحد الأقصى لكل فريق: 5 أعضاء فقط',
      yourNameLabel: 'اسمك (أو لقبك):',
      invitationCodeLabel: 'رقم أو كود الدعوة (أعطاه لك المحاضر):',
      availableTeamsLabel: 'الفرق وحالة المقاعد المتبقية:',
      confirmJoinBtn: 'تأكيد الانضمام للفريق',
      shareQrBtn: 'باركود المشاركة',
      qrModalTitle: 'امسح الباركود للانضمام للمسابقة',
      qrModalSub: 'شارك الرابط مع الطلاب أو اعرضه على شاشة القاعة',
      qrScanHint: 'امسح الرمز بكاميرا هاتفك أو افتح الرابط المباشر أدناه:',
      copyLinkBtn: 'نسخ الرابط 📋',
      gameFrozenTitle: 'المسابقة متوقفة مؤقتاً بأمر المشرف',
      gameFrozenSub: 'قام الأستاذ المشرف بإيقاف وتجميد اللعبة مؤقتاً لمراجعة النقاط أو تقديم شرح تعليمي. يرجى الانتباه لشاشة العرض، وسيتم استئناف التحدي فوراً.',
      waitingAdminResume: 'في انتظار إشارة الاستئناف من المشرف...',
      certificateBtn: 'شهادة الإنجاز',
      certModalTitle: 'شهادة الإنجاز والتفوّق العلمي',
      certModalSub: 'وثيقة تكريم رسمية بالنقاط والترتيب لمسابقة الجهاز الدوري',
      certTeamLabel: 'الفريق:',
      certMemberLabel: 'العضو المسجل:',
      certNameLabel: 'الاسم على الشهادة:',
      downloadCertPng: 'تحميل كصورة (PNG HD)',
      printCertPdf: 'طباعة / حفظ PDF'
    },
    en: {
      appTitle: 'Circulatory Systems in Animals & Insects',
      appSubtitle: 'Interactive Presentation Challenge: Open vs Closed Systems',
      spinWheel: 'SPIN THE WHEEL!',
      spinHint: '💡 You can also drag & flick the wheel with your mouse/touch!',
      scoreboardTitle: 'Team Scoreboard',
      rosterTitle: '6 Presentation Wheel Activities',
      recentSpins: 'Recent Activities:',
      joinTeamBtn: 'Join a Team',
      leaveTeamBtn: 'Leave Team',
      turnBadge: 'Active Turn',
      timeRemaining: 'Time Left:',
      seconds: 'sec',
      tapToRevealPrompt: 'Tap here to reveal secret theatrical card 🎭',
      tabooForbidden: 'Forbidden Words (Do Not Say):',
      luckyClickBox: 'Click the mystery box to unwrap your prize! 🎁',
      joinModalTitle: 'Join Your Competition Team',
      joinModalSub: 'Maximum 5 members per team',
      yourNameLabel: 'Your Name (or Nickname):',
      invitationCodeLabel: 'Team Invitation Code or Number:',
      availableTeamsLabel: 'Teams & Remaining Seats Status:',
      confirmJoinBtn: 'Confirm & Join Team',
      shareQrBtn: 'Share QR Code',
      qrModalTitle: 'Scan QR to Join Contest',
      qrModalSub: 'Share link with students or display on screen',
      qrScanHint: 'Scan code with phone camera or use direct link below:',
      copyLinkBtn: 'Copy Link 📋',
      gameFrozenTitle: 'Game Paused by Admin',
      gameFrozenSub: 'The teacher/admin has temporarily paused the competition. Please look at the presenter screen, challenge will resume shortly.',
      waitingAdminResume: 'Waiting for admin to resume...',
      certificateBtn: 'Certificate',
      certModalTitle: 'Certificate of Academic Excellence',
      certModalSub: 'Official Honor Document with Scores and Rank',
      certTeamLabel: 'Team:',
      certMemberLabel: 'Registered Member:',
      certNameLabel: 'Name on Certificate:',
      downloadCertPng: 'Download Image (PNG HD)',
      printCertPdf: 'Print / Save PDF'
    }
  };

  function updateLanguage(lang) {
    currentLang = lang;
    window.activityManager.setLanguage(lang);
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    langToggleBtn.innerHTML = (lang === 'ar') ? '🌐 English' : '🌐 العربية';

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (UI_TRANSLATIONS[lang] && UI_TRANSLATIONS[lang][key]) {
        el.textContent = UI_TRANSLATIONS[lang][key];
      }
    });

    renderRosterList();
    renderScoreboard();
    updatePlayerBadge();
    if (certLangSelect) certLangSelect.value = lang;
  }

  function updatePlayerBadge() {
    if (myTeamId && myPlayerName) {
      const teams = window.gameStateManager.getTeams();
      const t = teams.find(team => team.id === myTeamId);
      const memExists = t && t.members && t.members.some(m => m.name === myPlayerName);

      if (t && memExists) {
        playerTeamBadge.style.display = 'inline-flex';
        joinTeamBtn.style.display = 'none'; // Lock from joining another team
        
        const isTeamBlk = window.gameStateManager.isTeamBlocked(myTeamId);
        const isMemBlk = window.gameStateManager.isMemberBlocked(myTeamId, myPlayerName);
        
        if (isTeamBlk || isMemBlk) {
          playerTeamBadge.style.background = '#FFEBEE';
          playerTeamBadge.style.borderColor = '#EF5350';
          playerTeamBadge.style.color = '#C62828';
          if (isTeamBlk) {
            playerTeamBadgeText.innerHTML = (currentLang === 'ar')
              ? `<span>🚫 فريقك (${t.name}) محظور من المشرف!</span>`
              : `<span>🚫 Your team (${t.name}) is blocked!</span>`;
          } else {
            playerTeamBadgeText.innerHTML = (currentLang === 'ar')
              ? `<span>🚫 حسابك (<strong>${myPlayerName}</strong>) محظور من المشرف!</span>`
              : `<span>🚫 Account (<strong>${myPlayerName}</strong>) is blocked!</span>`;
          }
        } else {
          playerTeamBadge.style.background = '#FFF0F4';
          playerTeamBadge.style.borderColor = '#FF8DAA';
          playerTeamBadge.style.color = 'var(--primary-pink-dark)';
          playerTeamBadgeText.innerHTML = (currentLang === 'ar')
            ? `<span>👋 مرحباً، <strong>${myPlayerName}</strong> | فريق: ${t.avatar} <strong>${t.name}</strong></span>`
            : `<span>👋 Welcome, <strong>${myPlayerName}</strong> | Team: ${t.avatar} <strong>${t.name}</strong></span>`;
        }
      } else {
        myTeamId = null;
        myPlayerName = null;
        sessionStorage.removeItem('my_registered_team_id');
        sessionStorage.removeItem('my_registered_player_name');
        playerTeamBadge.style.display = 'none';
        joinTeamBtn.style.display = 'inline-flex';
      }
    } else {
      playerTeamBadge.style.display = 'none';
      joinTeamBtn.style.display = 'inline-flex';
    }
  }

  // Wire Leave Team button
  if (leaveTeamBtn) {
    leaveTeamBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!myTeamId || !myPlayerName) return;
      const t = window.gameStateManager.getTeam(myTeamId);
      const teamName = t ? t.name : '';
      const confirmLeave = confirm(currentLang === 'ar'
        ? `هل أنت متأكد من مغادرة فريقك (${teamName})؟ سيتم إخلاء مقعدك لتتمكن من الانضمام إلى فريق آخر.`
        : `Are you sure you want to leave your team (${teamName})? You will be able to join another team.`);
      if (confirmLeave) {
        window.gameStateManager.leaveTeam(myTeamId, myPlayerName);
        sessionStorage.removeItem('my_registered_team_id');
        sessionStorage.removeItem('my_registered_player_name');
        localStorage.removeItem('my_registered_team_id');
        localStorage.removeItem('my_registered_player_name');
        myTeamId = null;
        myPlayerName = null;
        updatePlayerBadge();
        renderScoreboard();
        alert(currentLang === 'ar' ? 'تمت مغادرة الفريق بنجاح. يمكنك الآن الانضمام لفريق جديد.' : 'You have left the team successfully.');
      }
    });
  }

  // Check if player has permission to spin or play
  function canCurrentPlayerSpin() {
    // 1. Is game frozen?
    const isFrozen = (window.gameStateManager && typeof window.gameStateManager.isGameFrozen === 'function')
      ? window.gameStateManager.isGameFrozen()
      : !!(window.gameStateManager && window.gameStateManager.getState() && window.gameStateManager.getState().isFrozen);

    if (isFrozen) {
      alert(currentLang === 'ar' 
        ? '❄️ المسابقة متوقفة ومجمدة مؤقتاً بأمر المشرف.' 
        : '❄️ The game is temporarily paused by the admin.');
      return false;
    }

    // 2. Must be joined to a team
    if (!myTeamId || !myPlayerName) {
      alert(currentLang === 'ar'
        ? '⚠️ يجب عليك الانضمام إلى فريق أولاً لتتمكن من تدوير العجلة والمنافسة في التحديات!'
        : '⚠️ You must join a team first before spinning the wheel!');
      openJoinModal();
      return false;
    }

    // 3. Is team blocked?
    if (window.gameStateManager && typeof window.gameStateManager.isTeamBlocked === 'function' && window.gameStateManager.isTeamBlocked(myTeamId)) {
      const teams = window.gameStateManager.getTeams();
      const t = teams.find(team => team.id === myTeamId);
      const teamName = t ? t.name : myTeamId;
      alert(currentLang === 'ar'
        ? `🚫 تم حظر فريقك (${teamName}) من المشاركة في المسابقة بقرار من المشرف! تواصل مع المشرف لفك الحظر.`
        : `🚫 Your team (${teamName}) has been blocked by the admin!`);
      return false;
    }

    // 4. Is member individually blocked?
    if (window.gameStateManager && typeof window.gameStateManager.isMemberBlocked === 'function' && window.gameStateManager.isMemberBlocked(myTeamId, myPlayerName)) {
      alert(currentLang === 'ar'
        ? `🚫 تم حظرك كلاعب (${myPlayerName}) بقرار من المشرف! لا يمكنك تدوير العجلة أو كسب النقاط حتى يتم فك الحظر.`
        : `🚫 Your player account (${myPlayerName}) is blocked by the admin!`);
      return false;
    }

    return true;
  }

  // Wheel Initialization
  const spinner = new SpinnerWheel('wheelCanvas', {
    beforeSpin: () => {
      return canCurrentPlayerSpin();
    },
    onSpinStart: () => {
      // Align active turn to the spinning player's team
      if (myTeamId) {
        const teams = window.gameStateManager.getTeams();
        const tIdx = teams.findIndex(t => t.id === myTeamId);
        if (tIdx !== -1) {
          window.gameStateManager.setActiveTeamIndex(tIdx);
        }
      }
      spinBtn.disabled = true;
      soundController.playClick();
    },
    onPegTick: (velocityRatio) => {
      soundController.playWheelTick(velocityRatio);
    },
    onSpinEnd: (winningSegment) => {
      spinBtn.disabled = false;
      soundController.playFanfare();
      recordRecentSpin(winningSegment);
      openActivityModal(winningSegment);
    }
  });

  spinBtn.addEventListener('click', () => {
    if (!canCurrentPlayerSpin()) return;
    soundController.init();
    spinner.spin(1 + Math.random() * 0.4);
  });

  soundToggleBtn.addEventListener('click', () => {
    const isMuted = soundController.toggleMute();
    soundToggleBtn.innerHTML = isMuted ? '🔇 الصوت' : '🔊 الصوت';
  });

  langToggleBtn.addEventListener('click', () => {
    const nextLang = (currentLang === 'ar') ? 'en' : 'ar';
    updateLanguage(nextLang);
  });

  presentationBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
      document.body.classList.add('presentation-mode');
      presentationBtn.innerHTML = '⛶ خروج';
    } else {
      document.exitFullscreen();
      document.body.classList.remove('presentation-mode');
      presentationBtn.innerHTML = '⛶ العرض';
    }
  });

  // =========================================================================
  // Scoreboard Rendering (Displaying individual member stats & Negative scores)
  // =========================================================================

  function renderScoreboard() {
    const list = document.getElementById('teamCardsList');
    if (!list) return;
    list.innerHTML = '';

    const teams = window.gameStateManager.getTeams();
    const activeIdx = window.gameStateManager.getState().activeTeamIndex || 0;

    // Determine rankings based on scores
    const sortedScores = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));

    teams.forEach((team, idx) => {
      const card = document.createElement('div');
      card.className = `team-card ${idx === activeIdx ? 'active-turn' : ''}`;

      const rankIndex = sortedScores.findIndex(t => t.id === team.id);
      let rankBadge = '';
      if (team.score > 0) {
        if (rankIndex === 0) rankBadge = '🥇';
        else if (rankIndex === 1) rankBadge = '🥈';
        else if (rankIndex === 2) rankBadge = '🥉';
      }

      const memCount = team.members ? team.members.length : 0;
      const isFull = memCount >= (team.maxMembers || 5);
      const isNegative = team.score < 0;
      const isTeamBlk = !!team.isBlocked;

      card.innerHTML = `
        ${idx === activeIdx ? `<div class="team-turn-badge">${UI_TRANSLATIONS[currentLang].turnBadge}</div>` : ''}

        <div class="team-header-row">
          <div class="team-info">
            <div class="team-avatar" style="position:relative;">
              ${team.avatar}
              ${rankBadge ? `<span style="position:absolute; bottom:-6px; right:-6px; font-size:16px;" title="ترتيب المتصدرين">${rankBadge}</span>` : ''}
            </div>
            <div>
              <div class="team-name-text" style="display: flex; align-items: center; gap: 6px;">
                <span>${team.name}</span>
                ${isTeamBlk ? '<span style="background:#FFEBEE; color:#C62828; border:1px solid #FFCDD2; font-size:10px; font-weight:800; padding:1px 6px; border-radius:4px;">🚫 محظور</span>' : ''}
              </div>
              <div style="font-size: 11.5px; color: var(--text-muted); font-weight: 700;">
                <span class="slot-capacity ${isFull ? 'full' : ''}">
                  ${isFull ? '🔴 مكتمل (5/5)' : `👥 ${memCount}/${team.maxMembers || 5} أعضاء`}
                </span>
                ${isNegative ? '<span style="color:#D32F2F; margin-right:4px; font-weight:800;">⚠️ رصيد بالسالب</span>' : ''}
              </div>
            </div>
          </div>
          <div class="team-score-wrap">
            <div class="team-score-num" style="${isNegative ? 'color: #D32F2F !important; text-shadow: 0 0 10px rgba(211,47,47,0.3);' : ''}">${team.score}</div>
          </div>
        </div>

        <!-- Individual Members Roster with Points & Questions Solved -->
        <div style="border-top: 1px dashed rgba(220, 200, 210, 0.6); padding-top: 8px; margin-top: 4px; display: flex; flex-direction: column; gap: 6px;">
          ${team.members && team.members.length > 0 ? team.members.map(m => `
            <div style="background: ${(m.points || 0) < 0 ? '#FFF2F2' : '#F8F4F6'}; border: 1px solid ${(m.points || 0) < 0 ? '#FFCDD2' : 'transparent'}; border-radius: 8px; padding: 5px 10px; display: flex; align-items: center; justify-content: space-between; font-size: 12px;">
              <div style="display:flex; align-items:center; gap:6px;">
                <span style="font-weight: 800; color: #2C2623;">👤 ${m.name}</span>
                ${m.isBlocked ? '<span style="background:#FFEBEE; color:#C62828; font-size:10px; font-weight:800; padding:1px 5px; border-radius:4px;">🚫 محظور</span>' : ''}
              </div>
              <div style="display: flex; gap: 8px; font-weight: 800; align-items: center;">
                <span style="${(m.points || 0) < 0 ? 'color: #D32F2F;' : 'color: #D82655;'}">⭐ ${m.points || 0} ${(m.points || 0) < 0 ? '⚠️' : ''}</span>
                <span style="color: #2E7D32;">🎯 ${m.questionsSolved || 0}</span>
                <button class="btn-cert-mini" data-team="${team.id}" data-member="${encodeURIComponent(m.name)}" title="استخراج شهادة الإنجاز" style="background:#FFF9C4; border:1px solid #FBC02D; color:#E65100; border-radius:6px; font-size:11px; padding:2px 7px; cursor:pointer; font-weight:800;">🏆 شهادة</button>
              </div>
            </div>
          `).join('') : '<span style="font-size: 11.5px; color: #9E9E9E; text-align: center;">بانتظار انضمام الأعضاء...</span>'}
        </div>
      `;

      list.appendChild(card);
    });

    // Wire up mini certificate buttons
    list.querySelectorAll('.btn-cert-mini').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const tId = btn.getAttribute('data-team');
        const mName = decodeURIComponent(btn.getAttribute('data-member'));
        soundController.playClick();
        openCertificateModal(tId, mName);
      });
    });
  }

  // =========================================================================
  // Share & QR Code Modal
  // =========================================================================

  if (shareQrBtn) {
    shareQrBtn.addEventListener('click', () => {
      let currentUrl = window.location.href.split('#')[0];
      const activeRoom = (window.gameStateManager && window.gameStateManager.roomId) ? window.gameStateManager.roomId : 'bio_circulatory_toolpro2030';
      if (!currentUrl.includes('room=')) {
        currentUrl += (currentUrl.includes('?') ? '&' : '?') + 'room=' + encodeURIComponent(activeRoom);
      }
      shareUrlInput.value = currentUrl;
      shareQrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}`;
      shareQrModalBackdrop.classList.add('active');
    });
  }

  if (shareQrCloseBtn) {
    shareQrCloseBtn.addEventListener('click', () => {
      shareQrModalBackdrop.classList.remove('active');
    });
  }

  if (shareQrModalBackdrop) {
    shareQrModalBackdrop.addEventListener('click', (e) => {
      if (e.target === shareQrModalBackdrop) {
        shareQrModalBackdrop.classList.remove('active');
      }
    });
  }

  if (btnCopyShareUrl) {
    btnCopyShareUrl.addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrlInput.value).then(() => {
        soundController.playSuccess();
        btnCopyShareUrl.textContent = '✓ تم النسخ!';
        setTimeout(() => { 
          btnCopyShareUrl.textContent = currentLang === 'ar' ? 'نسخ الرابط 📋' : 'Copy Link 📋'; 
        }, 1600);
      });
    });
  }

  // =========================================================================
  // Student "Join Team" Modal
  // =========================================================================

  joinTeamBtn.addEventListener('click', () => {
    soundController.playClick();
    openJoinModal();
  });

  joinCloseBtn.addEventListener('click', () => {
    joinTeamModalBackdrop.classList.remove('active');
  });

  function openJoinModal() {
    if (myTeamId && myPlayerName) {
      alert(currentLang === 'ar' 
        ? `أنت مسجل ومثبت بالفعل في فريقك (${myPlayerName}). نظام المسابقة لا يسمح بتغيير الفرق أو التلاعب بها لمنع المشاكل!` 
        : `You are already locked into your team!`);
      return;
    }
    joinPlayerNameInput.value = '';
    joinTeamCodeInput.value = '';
    joinStatusMessage.style.display = 'none';
    renderJoinTeamsList();
    joinTeamModalBackdrop.classList.add('active');
  }

  function renderJoinTeamsList() {
    joinAvailableTeamsList.innerHTML = '';
    const teams = window.gameStateManager.getTeams();

    teams.forEach(t => {
      const memCount = t.members ? t.members.length : 0;
      const isFull = memCount >= (t.maxMembers || 5);
      const remaining = (t.maxMembers || 5) - memCount;

      const slot = document.createElement('div');
      slot.className = `join-team-slot ${isFull ? 'slot-full' : ''}`;

      slot.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 24px;">${t.avatar}</span>
          <div>
            <div style="font-weight: 800; font-size: 15px; color: var(--text-dark);">${t.name}</div>
            <div style="font-size: 12px; color: var(--text-muted);">
              ${isFull ? 'الفريق مكتمل بالكامل (5/5)' : `متاح للانضمام برقم الدعوة`}
            </div>
          </div>
        </div>
        <div>
          <span class="slot-capacity ${isFull ? 'full' : ''}">
            ${isFull ? '🔴 مكتمل (5/5)' : `🟢 متبقي ${remaining} مقاعد (${memCount}/5)`}
          </span>
        </div>
      `;

      joinAvailableTeamsList.appendChild(slot);
    });
  }

  submitJoinTeamBtn.addEventListener('click', () => {
    const name = joinPlayerNameInput.value.trim();
    const code = joinTeamCodeInput.value.trim();

    if (!name) {
      showJoinMsg(currentLang === 'ar' ? 'يرجى كتابة اسمك أولاً!' : 'Please enter your name!', 'error');
      return;
    }

    if (!code) {
      showJoinMsg(currentLang === 'ar' ? 'يرجى كتابة رقم أو كود دعوة الفريق!' : 'Please enter team code or number!', 'error');
      return;
    }

    const res = window.gameStateManager.joinTeam(name, code);

    if (!res.success) {
      soundController.playBuzzer();
      if (res.error === 'INVALID_CODE') {
        showJoinMsg(currentLang === 'ar' ? '❌ رقم أو كود غير صحيح! يرجى التأكد من الرقم المخصص لفريقك من المحاضر.' : '❌ Invalid code! Please check with the admin.', 'error');
      } else if (res.error === 'TEAM_FULL') {
        showJoinMsg(currentLang === 'ar' ? `⚠️ هذا الفريق مكتمل الآن (${res.capacity}/5)! لقد اكتمل عدد أعضاء الفريق ولا يمكن استقبال المزيد.` : `⚠️ This team is already FULL (${res.capacity}/5)!`, 'error');
      } else if (res.error === 'TEAM_BLOCKED') {
        showJoinMsg(currentLang === 'ar' ? `🚫 هذا الفريق (${res.teamName}) محظور حالياً بقرار من المشرف.` : `🚫 This team is currently blocked by the admin.`, 'error');
      } else if (res.error === 'MEMBER_BLOCKED') {
        showJoinMsg(currentLang === 'ar' ? `🚫 تم حظر هذا الحساب (${res.memberName}) بقرار من المشرف.` : `🚫 This account is blocked by the admin.`, 'error');
      } else if (res.error === 'ALREADY_JOINED') {
        showJoinMsg(currentLang === 'ar' ? `أنت مسجل بالفعل في ${res.teamName}!` : `You are already registered!`, 'info');
      }
    } else {
      soundController.playSuccess();
      myTeamId = res.teamId;
      myPlayerName = name;

      // Pure isolated session per browser tab
      sessionStorage.setItem('my_registered_team_id', res.teamId);
      sessionStorage.setItem('my_registered_player_name', name);
      localStorage.removeItem('my_registered_team_id');
      localStorage.removeItem('my_registered_player_name');

      if (res.reconnected) {
        showJoinMsg(currentLang === 'ar'
          ? `🎉 أهلاً بعودتك يا ${name}! تم استعادة جلستك ورصيدك السليم (${res.member.points || 0} نقطة) في فريق "${res.teamName}"!`
          : `🎉 Welcome back ${name}! Restored your session (${res.member.points || 0} pts) in "${res.teamName}"!`, 'success');
      } else {
        showJoinMsg(currentLang === 'ar'
          ? `🎉 أهلاً بك يا ${name}! تم تثبيتك بنجاح في "${res.teamName}" (عضو رقم ${res.memberCount} من 5)!`
          : `🎉 Welcome ${name}! Successfully joined "${res.teamName}"!`, 'success');
      }

      updatePlayerBadge();
      renderJoinTeamsList();
      renderScoreboard();
      setTimeout(() => {
        joinTeamModalBackdrop.classList.remove('active');
        setTimeout(() => {
          joinTeamModalBackdrop.style.display = 'none';
        }, 250);
      }, 1000);
    }
  });

  function showJoinMsg(msg, type) {
    joinStatusMessage.style.display = 'block';
    joinStatusMessage.textContent = msg;

    if (type === 'error') {
      joinStatusMessage.style.background = '#FFEBEE';
      joinStatusMessage.style.color = '#C62828';
      joinStatusMessage.style.border = '1px solid #FFCDD2';
    } else if (type === 'success') {
      joinStatusMessage.style.background = '#E8F5E9';
      joinStatusMessage.style.color = '#2E7D32';
      joinStatusMessage.style.border = '1px solid #C8E6C9';
    } else {
      joinStatusMessage.style.background = '#E3F2FD';
      joinStatusMessage.style.color = '#1565C0';
      joinStatusMessage.style.border = '1px solid #BBDEFB';
    }
  }

  // =========================================================================
  // Live State & Remote Triggers Listener from admin.html
  // =========================================================================

  function updateFreezeState(isFrozen, reason = null) {
    const overlay = document.getElementById('gameFrozenOverlay');
    const spinBtn = document.getElementById('spinBtn');
    if (overlay) {
      if (isFrozen) {
        overlay.style.display = 'flex';
        requestAnimationFrame(() => overlay.classList.add('active'));
        if (spinBtn) spinBtn.disabled = true;
      } else {
        overlay.classList.remove('active');
        setTimeout(() => {
          if (!overlay.classList.contains('active')) {
            overlay.style.display = 'none';
          }
        }, 300);
        if (spinBtn && !spinner.isSpinning) spinBtn.disabled = false;
      }
    }
  }

  function checkLiveUpdates(state) {
    // 1. Game Freeze State
    updateFreezeState(state.isFrozen, state.frozenReason);

    // 2. Remote Spin Triggers
    if (state.remoteTrigger && state.remoteTrigger.timestamp > lastProcessedTrigger) {
      lastProcessedTrigger = state.remoteTrigger.timestamp;
      const { action, targetIndex } = state.remoteTrigger;

      if (action === 'spin') {
        soundController.init();
        spinner.spin();
      } else if (action === 'force_spin' && typeof targetIndex === 'number') {
        soundController.init();
        spinner.spinToSegment(targetIndex);
      }
    }

    // 3. Remote Admin Evaluation for Act It Out or Explain It Fast!
    if (state.liveEvaluation && state.liveEvaluation.status === 'graded' && state.liveEvaluation.timestamp > lastProcessedEvalTimestamp) {
      lastProcessedEvalTimestamp = state.liveEvaluation.timestamp;
      const pts = state.liveEvaluation.awardedPoints;

      const evalBanner = document.getElementById('adminEvalWaitingBanner');
      if (evalBanner) {
        if (pts > 0) {
          soundController.playSuccess();
          evalBanner.innerHTML = `<span style="font-size:22px;">🎉</span> <strong>تم اعتماد التقييم من المشرف: +${pts} نقطة!</strong>`;
          evalBanner.style.background = '#E8F5E9';
          evalBanner.style.color = '#2E7D32';
        } else {
          soundController.playBuzzer();
          evalBanner.innerHTML = `<span style="font-size:22px;">❌</span> <strong>تم اعتماد التقييم من المشرف: خصم ${pts} نقطة!</strong>`;
          evalBanner.style.background = '#FFEBEE';
          evalBanner.style.color = '#C62828';
        }

        setTimeout(() => {
          closeModal();
        }, 2200);
      }
    }
  }

  window.gameStateManager.subscribe((newState) => {
    renderScoreboard();
    checkLiveUpdates(newState);
  });

  // Initial check on load
  updateFreezeState(window.gameStateManager.getState().isFrozen);

  // Recent Spins Log
  function recordRecentSpin(segment) {
    recentSpins.unshift(segment);
    if (recentSpins.length > 5) recentSpins.pop();
    renderRecentSpins();
  }

  function renderRecentSpins() {
    recentSpinsContainer.innerHTML = '';
    recentSpins.forEach(seg => {
      const title = (currentLang === 'ar') ? seg.titleAr : seg.titleEn;
      const badge = document.createElement('div');
      badge.className = 'spin-history-badge';
      badge.style.borderLeft = `4px solid ${seg.color}`;
      badge.innerHTML = `<span>${seg.icon}</span> <span>${title}</span>`;
      recentSpinsContainer.appendChild(badge);
    });
  }

  // Render Display-Only Roster (Students cannot click to trigger out of turn!)
  function renderRosterList() {
    const rosterList = document.getElementById('activityRosterList');
    if (!rosterList) return;
    rosterList.innerHTML = '';

    spinner.segments.forEach(seg => {
      const title = (currentLang === 'ar') ? seg.titleAr : seg.titleEn;
      const act = window.activityManager.getActivity(seg.id);
      const desc = act ? (act.description[currentLang] || '') : '';

      const card = document.createElement('div');
      card.className = 'roster-card';
      card.style.borderColor = `${seg.color}40`;
      card.style.cursor = 'default'; // Visual only!
      card.innerHTML = `
        <div class="roster-icon" style="background: ${seg.color}">
          ${seg.icon}
        </div>
        <div class="roster-text">
          <div class="roster-title">${title}</div>
          <div class="roster-sub">${desc.substring(0, 36)}...</div>
        </div>
      `;

      rosterList.appendChild(card);
    });
  }

  function closeModal() {
    isSubmittingAnswer = false;
    if (currentTimerInterval) {
      clearInterval(currentTimerInterval);
      currentTimerInterval = null;
    }
    window.gameStateManager.cancelLiveChallenge();
    activityModalBackdrop.classList.remove('active');
  }

  modalCloseBtn.addEventListener('click', closeModal);
  activityModalBackdrop.addEventListener('click', (e) => {
    if (e.target === activityModalBackdrop) closeModal();
  });

  // =========================================================================
  // Activity Modals with Negative Scores & Options
  // =========================================================================

  function openActivityModal(segment) {
    isSubmittingAnswer = false;
    if (currentTimerInterval) {
      clearInterval(currentTimerInterval);
      currentTimerInterval = null;
    }

    const lang = currentLang;
    const title = (lang === 'ar') ? segment.titleAr : segment.titleEn;
    const activityData = window.activityManager.getActivity(segment.id);
    const itemData = window.activityManager.getRandomItem(segment.id);

    modalHeader.style.background = `linear-gradient(135deg, ${segment.color}, ${segment.accentColor || segment.color})`;
    modalIcon.textContent = segment.icon;
    modalTitle.textContent = title;
    modalSubtitle.textContent = activityData ? (activityData.description[lang] || '') : '';

    modalBodyContent.innerHTML = '';
    awardPointsArea.innerHTML = '';

    if (!itemData || !itemData.item) {
      modalBodyContent.innerHTML = `<p style="text-align:center; padding: 20px;">No questions found.</p>`;
      activityModalBackdrop.classList.add('active');
      return;
    }

    const item = itemData.item;

    switch (segment.id) {
      case 'quickQuiz':
        renderQuickQuizModal(item, segment);
        break;
      case 'mysteryClue':
        renderMysteryClueModal(item, segment);
        break;
      case 'fixMistake':
        renderFixMistakeModal(item, segment);
        break;
      case 'actItOut':
        renderActItOutModal(item, segment);
        break;
      case 'explainItFast':
        renderExplainItFastModal(item, segment);
        break;
      case 'luckyBug':
        renderLuckyBugModal(item, segment);
        break;
    }

    activityModalBackdrop.classList.add('active');
  }

  /**
   * Helper to shuffle options dynamically so the correct answer is randomly
   * positioned across A, B, C, or D each time a challenge is presented.
   * Keeps Arabic and English synchronized.
   */
  function createShuffledOptions(optionsObj, correctIdx = 0) {
    if (!optionsObj) return [];
    const arList = optionsObj.ar || [];
    const enList = optionsObj.en || [];
    const count = Math.max(arList.length, enList.length);
    const targetIdx = (typeof correctIdx === 'number') ? correctIdx : 0;

    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        originalIndex: i,
        ar: arList[i] || '',
        en: enList[i] || (arList[i] || ''),
        isCorrect: (i === targetIdx)
      });
    }

    // Fisher-Yates shuffle
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }

    return items;
  }

  // 1. Quick Quiz (Multiple Choice with -15 deduction and randomized option positions)
  function renderQuickQuizModal(item, segment) {
    const lang = currentLang;
    const qText = item.question[lang] || item.question.en;
    const activeTeam = window.gameStateManager.getActiveTeam();
    const shuffledOptions = createShuffledOptions(item.options, item.correctIndex);

    const timerDuration = 20;
    let secondsLeft = timerDuration;

    modalBodyContent.innerHTML = `
      <div class="activity-timer-widget">
        <div class="timer-label-box">
          <span>⏱️</span>
          <span>${UI_TRANSLATIONS[lang].timeRemaining}</span>
          <span class="timer-seconds-display" id="quizTimerDisplay">${secondsLeft}s</span>
        </div>
        <div class="timer-progress-track">
          <div class="timer-progress-bar" id="quizTimerBar" style="width: 100%;"></div>
        </div>
      </div>

      <div class="challenge-prompt-card">
        <span class="prompt-badge">💡 دور: ${activeTeam ? activeTeam.name : 'الفريق النشط'} (الصواب: +30 / الخطأ: خصم -15)</span>
        <div class="challenge-question-text">${qText}</div>
      </div>

      <div class="quiz-options-grid" id="quizOptionsGrid"></div>
      <div class="explanation-card" id="quizExplanationCard"></div>
    `;

    const optionsGrid = document.getElementById('quizOptionsGrid');
    const letters = ['A', 'B', 'C', 'D'];

    shuffledOptions.forEach((optObj, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.dataset.correct = optObj.isCorrect ? 'true' : 'false';
      const optText = optObj[lang] || optObj.ar || optObj.en;

      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[optIdx] || (optIdx + 1)}</span>
        <span>${optText}</span>
      `;

      btn.addEventListener('click', () => {
        if (!canCurrentPlayerSpin()) return;
        if (isSubmittingAnswer) return;
        isSubmittingAnswer = true;

        clearInterval(currentTimerInterval);
        const allBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);

        const expCard = document.getElementById('quizExplanationCard');
        const expText = item.explanation ? (item.explanation[lang] || item.explanation.en) : '';

        if (optObj.isCorrect) {
          btn.classList.add('correct');
          soundController.playSuccess();
          window.gameStateManager.awardActiveTeam(30, myPlayerName);
          expCard.innerHTML = `<strong>🎉 ${lang === 'ar' ? 'إجابة صحيحة! (+30 نقطة)' : 'Correct! (+30 Points)'}</strong><br>${expText}`;
        } else {
          btn.classList.add('wrong');
          // Highlight the actual correct option button wherever it ended up!
          allBtns.forEach(b => {
            if (b.dataset.correct === 'true') b.classList.add('correct');
          });
          soundController.playBuzzer();
          window.gameStateManager.penalizeActiveTeam(15, myPlayerName);
          expCard.innerHTML = `<strong>❌ ${lang === 'ar' ? 'إجابة خاطئة! (خصم -15 نقطة)' : 'Wrong Answer! (-15 Points)'}</strong><br>${expText}`;
        }
        expCard.classList.add('visible');
      });

      optionsGrid.appendChild(btn);
    });

    const timerDisplay = document.getElementById('quizTimerDisplay');
    const timerBar = document.getElementById('quizTimerBar');

    currentTimerInterval = setInterval(() => {
      secondsLeft--;
      if (timerDisplay) timerDisplay.textContent = `${secondsLeft}s`;
      if (timerBar) timerBar.style.width = `${(secondsLeft / timerDuration) * 100}%`;

      if (secondsLeft <= 5 && secondsLeft > 0) {
        soundController.playTimerTick();
      }

      if (secondsLeft <= 0) {
        clearInterval(currentTimerInterval);
        soundController.playBuzzer();
        const allBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => {
          b.disabled = true;
          if (b.dataset.correct === 'true') b.classList.add('correct');
        });
        window.gameStateManager.penalizeActiveTeam(15);
        const expCard = document.getElementById('quizExplanationCard');
        expCard.innerHTML = `<strong>⏰ ${lang === 'ar' ? 'انتهى الوقت! (خصم -15 نقطة)' : 'Time up! (-15 points)'}</strong>`;
        expCard.classList.add('visible');
      }
    }, 1000);
  }

  // 2. Mystery Clue (Options + Assistance Penalty -5 pts for extra clues!)
  function renderMysteryClueModal(item, segment) {
    const lang = currentLang;
    const clues = item.clues[lang] || item.clues.en;
    const options = item.options ? (item.options[lang] || item.options.en) : [];
    const answer = item.answer[lang] || item.answer.en;
    const funFact = item.funFact ? (item.funFact[lang] || item.funFact.en) : '';

    modalBodyContent.innerHTML = `
      <div class="challenge-prompt-card">
        <span class="prompt-badge">🕵️ ${item.title ? (item.title[lang] || item.title.en) : 'Mystery Dossier'}</span>
        <div class="challenge-question-text">${lang === 'ar' ? 'خمن ما هو المصطلح الغامض من التلميحات! (كشف التلميحات الإضافية يخصم 5 نقاط مساعدة)' : 'Guess the mystery! Revealing extra clues costs 5 assistance points.'}</div>
      </div>

      <div class="clue-dossier-list" id="clueDossierList"></div>

      <div style="font-size: 14px; font-weight: 800; color: #38242A; margin-top: 10px;">
        🔍 اختر التخمين الصحيح من الخيارات أدناه (الصواب: +30 / الخطأ: خصم -15):
      </div>
      <div class="quiz-options-grid" id="mysteryOptionsGrid"></div>
      <div class="explanation-card" id="mysteryAnswerCard"></div>
    `;

    const dossierList = document.getElementById('clueDossierList');

    clues.forEach((clueText, idx) => {
      const stepCard = document.createElement('div');
      stepCard.className = `clue-step-card ${idx === 0 ? 'revealed' : ''}`;

      if (idx === 0) {
        stepCard.innerHTML = `<span class="clue-text">${clueText}</span>`;
      } else {
        stepCard.innerHTML = `
          <span class="clue-text" id="clueText_${idx}">🔒 ${lang === 'ar' ? `التلميح رقم ${idx + 1} (مغلق)` : `Clue #${idx + 1} Hidden`}</span>
          <button class="clue-reveal-btn" id="clueBtn_${idx}" style="background:#FFCCD8; color:#D82655;">
            ${lang === 'ar' ? 'طلب وسيلة مساعدة (خصم -5 نقاط) 🔍' : 'Use Assistance (-5 Pts) 🔍'}
          </button>
        `;
      }

      dossierList.appendChild(stepCard);
    });

    // Wire Clue Reveals with Assistance Deduction (-5 points)
    clues.forEach((clueText, idx) => {
      if (idx > 0) {
        const btn = document.getElementById(`clueBtn_${idx}`);
        const textSpan = document.getElementById(`clueText_${idx}`);
        if (btn && textSpan) {
          btn.addEventListener('click', () => {
            soundController.playClick();
            window.gameStateManager.penalizeActiveTeam(5); // Deduct assistance fee!
            textSpan.textContent = clueText;
            btn.parentElement.classList.add('revealed');
            btn.remove();
          });
        }
      }
    });

    // Options for Mystery (Randomized positions)
    const optionsGrid = document.getElementById('mysteryOptionsGrid');
    const letters = ['A', 'B', 'C', 'D'];
    const shuffledOptions = createShuffledOptions(item.options, item.correctIndex || 0);

    shuffledOptions.forEach((optObj, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.dataset.correct = optObj.isCorrect ? 'true' : 'false';
      const optText = optObj[lang] || optObj.ar || optObj.en;

      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[optIdx] || (optIdx + 1)}</span>
        <span>${optText}</span>
      `;

      btn.addEventListener('click', () => {
        if (!canCurrentPlayerSpin()) return;
        if (isSubmittingAnswer) return;
        isSubmittingAnswer = true;

        const allBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);
        const ansCard = document.getElementById('mysteryAnswerCard');

        if (optObj.isCorrect) {
          btn.classList.add('correct');
          soundController.playSuccess();
          window.gameStateManager.awardActiveTeam(30, myPlayerName);
          ansCard.innerHTML = `<strong>🎉 ${lang === 'ar' ? 'تخمين عبقري صحيح! (+30 نقطة)' : 'Brilliant Guess! (+30 Points)'}</strong><br>الحل: ${answer}<br>${funFact}`;
        } else {
          btn.classList.add('wrong');
          // Highlight the actual correct option button wherever it ended up!
          allBtns.forEach(b => {
            if (b.dataset.correct === 'true') b.classList.add('correct');
          });
          soundController.playBuzzer();
          window.gameStateManager.penalizeActiveTeam(15, myPlayerName);
          ansCard.innerHTML = `<strong>❌ ${lang === 'ar' ? 'تخمين غير صحيح! (خصم -15 نقطة)' : 'Wrong Guess! (-15 Points)'}</strong><br>الحل الصحيح هو: ${answer}<br>${funFact}`;
        }
        ansCard.classList.add('visible');
      });

      optionsGrid.appendChild(btn);
    });
  }

  // 3. Fix the Mistake (Multiple Choice Options with -15 deduction and randomized positions)
  function renderFixMistakeModal(item, segment) {
    const lang = currentLang;
    const sentence = item.sentence[lang] || item.sentence.en;
    const explanation = item.explanation ? (item.explanation[lang] || item.explanation.en) : '';

    modalBodyContent.innerHTML = `
      <div class="challenge-prompt-card">
        <span class="prompt-badge">❌ حدد الخطأ العلمي في العبارة التالية:</span>
        <div class="mistake-box" style="margin-top: 8px;">${sentence}</div>
      </div>

      <div style="font-size: 14px; font-weight: 800; color: #38242A;">
        اختر التصحيح العلمي الصحيح من الخيارات (الصواب: +30 / الخطأ: خصم -15):
      </div>

      <div class="quiz-options-grid" id="fixOptionsGrid"></div>
      <div class="explanation-card" id="fixExplanationCard"></div>
    `;

    const optionsGrid = document.getElementById('fixOptionsGrid');
    const letters = ['A', 'B', 'C', 'D'];
    const shuffledOptions = createShuffledOptions(item.options, item.correctIndex || 0);

    shuffledOptions.forEach((optObj, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.dataset.correct = optObj.isCorrect ? 'true' : 'false';
      const optText = optObj[lang] || optObj.ar || optObj.en;

      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[optIdx] || (optIdx + 1)}</span>
        <span>${optText}</span>
      `;

      btn.addEventListener('click', () => {
        if (!canCurrentPlayerSpin()) return;
        if (isSubmittingAnswer) return;
        isSubmittingAnswer = true;

        const allBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);
        const expCard = document.getElementById('fixExplanationCard');

        if (optObj.isCorrect) {
          btn.classList.add('correct');
          soundController.playSuccess();
          window.gameStateManager.awardActiveTeam(30, myPlayerName);
          expCard.innerHTML = `<strong>✅ ${lang === 'ar' ? 'تصحيح ممتاز! (+30 نقطة)' : 'Correct Fix! (+30 Points)'}</strong><br>${explanation}`;
        } else {
          btn.classList.add('wrong');
          // Highlight the actual correct option button wherever it ended up!
          allBtns.forEach(b => {
            if (b.dataset.correct === 'true') b.classList.add('correct');
          });
          soundController.playBuzzer();
          window.gameStateManager.penalizeActiveTeam(15, myPlayerName);
          expCard.innerHTML = `<strong>❌ ${lang === 'ar' ? 'اختيار خاطئ! (خصم -15 نقطة)' : 'Incorrect! (-15 Points)'}</strong><br>${explanation}`;
        }
        expCard.classList.add('visible');
      });

      optionsGrid.appendChild(btn);
    });
  }

  // 4. Act It Out (Evaluated strictly by Admin)
  function renderActItOutModal(item, segment) {
    const lang = currentLang;
    const promptText = item.prompt[lang] || item.prompt.en;
    const keyword = item.secretKeyword[lang] || item.secretKeyword.en;
    const timeLimit = item.timeLimitSeconds || 45;
    let secondsLeft = timeLimit;

    // Register live challenge in state for Admin to see and grade
    window.gameStateManager.startLiveChallenge('Act It Out (مثّلها بدون كلام)', keyword);

    modalBodyContent.innerHTML = `
      <div class="activity-timer-widget">
        <div class="timer-label-box">
          <span>⏱️</span>
          <span>${UI_TRANSLATIONS[lang].timeRemaining}</span>
          <span class="timer-seconds-display" id="actTimerDisplay">${secondsLeft}s</span>
        </div>
        <div class="timer-progress-track">
          <div class="timer-progress-bar" id="actTimerBar" style="width: 100%;"></div>
        </div>
      </div>

      <div class="challenge-prompt-card" id="actSecretCard" style="cursor: pointer; background: #EBF8FF; border-color: #BEE3F8;">
        <div id="actPromptMask" style="font-size: 18px; font-weight: 800; color: #2B6CB0; padding: 20px 10px;">
          🎭 اضغط هنا لكشف المشهد السري للممثل فقط
        </div>
        <div id="actPromptContent" style="display: none;">
          <span class="prompt-badge" style="background:#BEE3F8; color:#2B6CB0;">🎭 ${keyword}</span>
          <div class="challenge-question-text" style="font-size: 19px;">${promptText}</div>
          <p style="margin-top: 10px; font-size: 13px; color: #718096;">
            ⚠️ ممنوع الكلام أو إصدار أي أصوات!
          </p>
        </div>
      </div>

      <div style="text-align: center;">
        <button class="spin-btn-huge" id="startActTimerBtn" style="font-size: 15px; padding: 12px 28px; background: #4CC9F0;">
          ▶️ بدء مؤقت المشهد
        </button>
      </div>

      <!-- Admin Live Evaluation Waiting Banner -->
      <div id="adminEvalWaitingBanner" style="background:#FFF9E6; border:2px dashed #FFD152; border-radius:12px; padding:14px; text-align:center; font-size:14px; font-weight:800; color:#7A5500; display:flex; align-items:center; justify-content:center; gap:8px;">
        <span>⏳</span> <span>التقييم محمي: بانتظار قرار المشرف من لوحة الإدارة لمنح النقاط أو احتساب الجزاء...</span>
      </div>
    `;

    const secretCard = document.getElementById('actSecretCard');
    const mask = document.getElementById('actPromptMask');
    const content = document.getElementById('actPromptContent');

    secretCard.addEventListener('click', () => {
      soundController.playClick();
      mask.style.display = 'none';
      content.style.display = 'block';
    });

    const startTimerBtn = document.getElementById('startActTimerBtn');
    const timerDisplay = document.getElementById('actTimerDisplay');
    const timerBar = document.getElementById('actTimerBar');

    startTimerBtn.addEventListener('click', () => {
      startTimerBtn.disabled = true;
      mask.style.display = 'none';
      content.style.display = 'block';

      currentTimerInterval = setInterval(() => {
        secondsLeft--;
        if (timerDisplay) timerDisplay.textContent = `${secondsLeft}s`;
        if (timerBar) timerBar.style.width = `${(secondsLeft / timeLimit) * 100}%`;

        if (secondsLeft <= 5 && secondsLeft > 0) {
          soundController.playTimerTick();
        }

        if (secondsLeft <= 0) {
          clearInterval(currentTimerInterval);
          soundController.playBuzzer();
          timerDisplay.textContent = '⏰';
        }
      }, 1000);
    });
  }

  // 5. Explain It Fast (Evaluated strictly by Admin)
  function renderExplainItFastModal(item, segment) {
    const lang = currentLang;
    const targetWord = item.targetWord[lang] || item.targetWord.en;
    const forbidden = item.forbiddenWords[lang] || item.forbiddenWords.en;
    const timeLimit = item.timeLimitSeconds || 30;
    let secondsLeft = timeLimit;

    window.gameStateManager.startLiveChallenge('Explain It Fast (اشرحها بسرعة)', targetWord);

    modalBodyContent.innerHTML = `
      <div class="activity-timer-widget">
        <div class="timer-label-box">
          <span>⏱️</span>
          <span>${UI_TRANSLATIONS[lang].timeRemaining}</span>
          <span class="timer-seconds-display" id="tabooTimerDisplay">${secondsLeft}s</span>
        </div>
        <div class="timer-progress-track">
          <div class="timer-progress-bar" id="tabooTimerBar" style="width: 100%;"></div>
        </div>
      </div>

      <div class="challenge-prompt-card" style="background: #F0FFF4; border-color: #C6F6D5;">
        <span class="prompt-badge" style="background: #9AE6B4; color: #22543D;">
          المصطلح المطلوب شرحه للفريق
        </span>
        <div class="challenge-question-text" style="font-size: 26px; color: #22543D; margin-top: 6px;">
          ${targetWord}
        </div>
      </div>

      <div class="taboo-forbidden-card">
        <div class="forbidden-label">🚫 ${UI_TRANSLATIONS[lang].tabooForbidden}</div>
        <div class="forbidden-tags">
          ${forbidden.map(word => `<span class="forbidden-tag">❌ ${word}</span>`).join('')}
        </div>
      </div>

      <div style="text-align: center;">
        <button class="spin-btn-huge" id="startTabooTimerBtn" style="font-size: 15px; padding: 12px 28px; background: #8AC926;">
          ▶️ بدء عداد الـ 30 ثانية
        </button>
      </div>

      <!-- Admin Live Evaluation Waiting Banner -->
      <div id="adminEvalWaitingBanner" style="background:#FFF9E6; border:2px dashed #FFD152; border-radius:12px; padding:14px; text-align:center; font-size:14px; font-weight:800; color:#7A5500; display:flex; align-items:center; justify-content:center; gap:8px;">
        <span>⏳</span> <span>التقييم محمي: بانتظار تقييم المشرف من لوحة الإدارة للتحقق من عدم نطق الكلمات الممنوعة...</span>
      </div>
    `;

    const startTimerBtn = document.getElementById('startTabooTimerBtn');
    const timerDisplay = document.getElementById('tabooTimerDisplay');
    const timerBar = document.getElementById('tabooTimerBar');

    startTimerBtn.addEventListener('click', () => {
      startTimerBtn.disabled = true;

      currentTimerInterval = setInterval(() => {
        secondsLeft--;
        if (timerDisplay) timerDisplay.textContent = `${secondsLeft}s`;
        if (timerBar) timerBar.style.width = `${(secondsLeft / timeLimit) * 100}%`;

        if (secondsLeft <= 5 && secondsLeft > 0) {
          soundController.playTimerTick();
        }

        if (secondsLeft <= 0) {
          clearInterval(currentTimerInterval);
          soundController.playBuzzer();
          timerDisplay.textContent = '⏰';
        }
      }, 1000);
    });
  }

  // 6. Lucky Bug
  function renderLuckyBugModal(item, segment) {
    const lang = currentLang;
    const title = item.title ? (item.title[lang] || item.title.en) : 'Lucky Surprise!';
    const reward = item.reward[lang] || item.reward.en;
    const detail = item.detail ? (item.detail[lang] || item.detail.en) : '';

    modalBodyContent.innerHTML = `
      <div class="lucky-bug-container">
        <div class="lucky-gift-box" id="mysteryGiftBox">
          🐞
        </div>
        <div style="font-size: 16px; font-weight: 800; color: #6B46C1;" id="luckyBoxPrompt">
          ${UI_TRANSLATIONS[lang].luckyClickBox}
        </div>

        <div class="lucky-reward-card" id="luckyRewardCard">
          <div class="lucky-reward-title">${title}</div>
          <div style="font-size: 21px; font-weight: 900; color: #D82655; margin-bottom: 8px;">
            ${reward}
          </div>
          <div class="lucky-reward-desc">${detail}</div>
        </div>
      </div>
    `;

    const giftBox = document.getElementById('mysteryGiftBox');
    const rewardCard = document.getElementById('luckyRewardCard');
    const promptText = document.getElementById('luckyBoxPrompt');

    giftBox.addEventListener('click', () => {
      soundController.playMagicSparkle();
      giftBox.style.animation = 'none';
      giftBox.style.transform = 'scale(1.2) rotate(15deg)';
      promptText.style.display = 'none';
      rewardCard.classList.add('visible');

      if (item.effect === 'points_50') {
        window.gameStateManager.awardActiveTeam(50, myPlayerName);
      } else if (item.effect === 'steal_20') {
        const teams = window.gameStateManager.getTeams();
        const activeIdx = window.gameStateManager.getState().activeTeamIndex || 0;
        const otherIdx = (activeIdx + 1) % teams.length;
        if (teams[otherIdx]) {
          window.gameStateManager.updateTeamScore(teams[otherIdx].id, -20);
          window.gameStateManager.awardActiveTeam(20, myPlayerName);
        }
      }
    });
  }

  // =========================================================================
  // Certificate of Scientific Achievement & Excellence (Canvas 1200x850 HD)
  // =========================================================================

  function drawCertificate(studentName, teamName, teamAvatar, teamScore, memberScore, questionsSolved, rankName) {
    if (!certCanvas) return;
    const ctx = certCanvas.getContext('2d');
    const width = 1200;
    const height = 850;

    certCanvas.width = width;
    certCanvas.height = height;

    // 1. Background Gradient - Rich Presentation Royal Navy / Emerald Slate
    const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 80, width / 2, height / 2, 720);
    bgGrad.addColorStop(0, '#0F263B');
    bgGrad.addColorStop(0.55, '#0A1C2C');
    bgGrad.addColorStop(1, '#050D15');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Faint Biology Aesthetic Micro Grid & Watermarks
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

    // Vascular heartbeat line watermark across center
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

    // 3. Ornate Golden Borders
    ctx.save();
    // Outer border
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 6;
    ctx.strokeRect(26, 26, width - 52, height - 52);

    // Inner fine gold frame
    ctx.strokeStyle = '#99751C';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(36, 36, width - 72, height - 72);

    // Decorative inner beaded gold frame
    ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
    ctx.setLineDash([4, 8]);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(46, 46, width - 92, height - 92);
    ctx.setLineDash([]); // Reset dash

    // 4 Corner Guilloche / Rosettes
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
    const pillW = 560;
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

    ctx.font = 'bold 15px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#FFD54F';
    ctx.textAlign = 'center';
    ctx.fillText('🔬 مَنْظُومَةُ العَرْضِ التَّقْدِيمِيِّ: الجِهَازُ الدَّوْرِيُّ فِي الحَيَوَانَاتِ وَالحَشَرَاتِ 🐞', width / 2, pillY + 24);
    ctx.restore();

    // 5. Main Certificate Title (Golden Calligraphy)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '900 44px "Tajawal", "Amiri", "Traditional Arabic", serif';
    const titleGrad = ctx.createLinearGradient(300, 140, 900, 140);
    titleGrad.addColorStop(0, '#FFE082');
    titleGrad.addColorStop(0.5, '#FFF8E1');
    titleGrad.addColorStop(1, '#FFCA28');
    ctx.fillStyle = titleGrad;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
    ctx.shadowBlur = 14;
    ctx.fillText('شَـــهَــادَةُ إِنجَـــازٍ وَتَـفَـــوُّقٍ عِلْمِـــيّ', width / 2, 150);

    ctx.shadowBlur = 0;
    ctx.font = 'italic 600 15px "Outfit", "Segoe UI", sans-serif';
    ctx.fillStyle = '#90A4AE';
    ctx.fillText('CERTIFICATE OF SCIENTIFIC EXCELLENCE & ACTIVE CONTRIBUTION', width / 2, 182);
    ctx.restore();

    // 6. Citation Text
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '700 18px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#ECEFF1';
    ctx.fillText('تَشْهَدُ إِدَارَةُ المَسَابَقَةِ وَلَجْنَةُ التَّحْكِيمِ بِأَنَّ الطَّالِبَ / البَاحِثَ المتميّز:', width / 2, 235);

    // 7. Student Name - Large Glowing Gold
    ctx.font = '900 48px "Tajawal", "Amiri", serif';
    const nameGrad = ctx.createLinearGradient(350, 300, 850, 300);
    nameGrad.addColorStop(0, '#FFE57F');
    nameGrad.addColorStop(0.5, '#FFFFFF');
    nameGrad.addColorStop(1, '#FFD54F');
    ctx.fillStyle = nameGrad;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
    ctx.shadowBlur = 20;
    ctx.fillText(studentName || 'الباحث المتميز', width / 2, 300);

    // Name Underline Ribbon Flourish
    ctx.shadowBlur = 0;
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 240, 320);
    ctx.lineTo(width / 2 + 240, 320);
    ctx.stroke();

    // Golden Diamond in Center of underline
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.moveTo(width / 2, 314);
    ctx.lineTo(width / 2 + 8, 320);
    ctx.lineTo(width / 2, 326);
    ctx.lineTo(width / 2 - 8, 320);
    ctx.closePath();
    ctx.fill();

    // 8. Team Affiliation
    ctx.font = 'bold 22px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#4DD0E1';
    ctx.fillText(`عُضْوُ فَرِيقِ: ${teamName} (${teamAvatar})`, width / 2, 360);

    // Praise description matching the 15-slide presentation topics
    ctx.font = '500 16.5px "Tajawal", "Segoe UI", sans-serif';
    ctx.fillStyle = '#B0BEC5';
    ctx.fillText('تَقْدِيراً لِمُشَارَكَتِهِ الفَعَّالَةِ وَتَفَوُّقِهِ المَعْرِفِيِّ فِي اسْتِيعَابِ فِسْيُولُوجْيَا أَنْظِمَةِ الدَّوَرَانِ المَفْتُوحَةِ وَالمُغْلَقَةِ،', width / 2, 400);
    ctx.fillText('وَآلِيَّاتِ تَدَفُّقِ سَائِلِ الهِيمُولِيمْفِ وَكِفَاءَةِ القُلُوبِ الأُنْبُوبِيَّةِ وَصَمَّامَاتِ الأُوسْتْيَا وَتَبَادُلِ الغَازَاتِ فِي الكَائِنَاتِ الحَيَّةِ.', width / 2, 428);
    ctx.restore();

    // 9. Stat Cards Row (3 Cards: Member Score, Questions Solved, Team Score & Rank)
    const cardY = 475;
    const cardH = 100;
    const cardW = 310;
    const gap = 35;
    const startX = (width - (cardW * 3 + gap * 2)) / 2;

    const cardsData = [
      {
        icon: '⭐',
        title: 'النقاط الفردية المكتسبة',
        val: `${memberScore >= 0 ? '+' : ''}${memberScore} نقطة`,
        sub: `إنجاز شخصي مباشر`,
        color: '#69F0AE',
        bg: 'rgba(0, 230, 118, 0.08)',
        border: 'rgba(0, 230, 118, 0.4)'
      },
      {
        icon: '🎯',
        title: 'التحديات المنجزة بنجاح',
        val: `${questionsSolved} أسئلة/أنشطة`,
        sub: `حل علمي دقيق`,
        color: '#40C4FF',
        bg: 'rgba(0, 176, 255, 0.08)',
        border: 'rgba(0, 176, 255, 0.4)'
      },
      {
        icon: '🏆',
        title: 'مجموع سكور الفريق والترتيب',
        val: `${teamScore} نقطة`,
        sub: `${rankName}`,
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
      ctx.font = 'bold 13.5px "Tajawal", "Segoe UI", sans-serif';
      ctx.fillStyle = '#CFD8DC';
      ctx.fillText(`${cd.icon} ${cd.title}`, cx + cardW / 2, cardY + 28);

      ctx.font = '900 24px "Tajawal", "Outfit", sans-serif';
      ctx.fillStyle = cd.color;
      ctx.fillText(cd.val, cx + cardW / 2, cardY + 62);

      ctx.font = '600 12.5px "Tajawal", sans-serif';
      ctx.fillStyle = '#90A4AE';
      ctx.fillText(cd.sub, cx + cardW / 2, cardY + 86);
      ctx.restore();
    });

    // 10. Official Footer (Left Verification, Center Gold 3D Seal, Right Signature & Date)
    const footerY = 640;

    // Left: Digital Verification Box
    ctx.save();
    const verW = 240;
    const verH = 120;
    const verX = 90;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(verX, footerY, verW, verH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 12px "Tajawal", sans-serif';
    ctx.fillStyle = '#FFD54F';
    ctx.fillText('🛡️ كود التحقق والاعتماد الرقمي', verX + verW / 2, footerY + 28);

    ctx.font = 'bold 16px "Outfit", monospace';
    ctx.fillStyle = '#ECEFF1';
    const certCode = 'BIO-' + Math.abs(hashString(studentName + teamName)).toString(16).toUpperCase().padStart(8, '0');
    ctx.fillText(certCode, verX + verW / 2, footerY + 58);

    ctx.font = '500 11.5px "Tajawal", sans-serif';
    ctx.fillStyle = '#78909C';
    ctx.fillText('منظومة التقييم الفوري 2026', verX + verW / 2, footerY + 84);
    ctx.fillText('مسابقة تفاعلية أونلاين', verX + verW / 2, footerY + 104);
    ctx.restore();

    // Center: 3D Official Gold Biology Excellence Seal
    ctx.save();
    const sealX = width / 2;
    const sealY = footerY + 60;
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

    // Inner Seal Circle with Gold Gradient
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

    // Seal Text
    ctx.textAlign = 'center';
    ctx.font = '900 11.5px "Tajawal", sans-serif';
    ctx.fillStyle = '#3E2723';
    ctx.fillText('★ خَتْمُ التَّفَوُّقِ ★', sealX, sealY - 18);
    ctx.font = '900 18px "Outfit", sans-serif';
    ctx.fillText('2026', sealX, sealY + 4);
    ctx.font = '800 9.5px "Outfit", sans-serif';
    ctx.fillText('OFFICIAL MERIT', sealX, sealY + 22);
    ctx.fillText('BIOLOGY SEAL', sealX, sealY + 33);
    ctx.restore();

    // Right: Date & Academic Supervisor Signature
    ctx.save();
    const sigW = 240;
    const sigH = 120;
    const sigX = width - 90 - sigW;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.3)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(sigX, footerY, sigW, sigH, 12);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = 'bold 12px "Tajawal", sans-serif';
    ctx.fillStyle = '#CFD8DC';
    ctx.fillText(`📅 التاريخ: أكتوبر 2026 م`, sigX + sigW / 2, footerY + 28);

    ctx.font = 'italic 700 19px "Amiri", "Traditional Arabic", cursive';
    ctx.fillStyle = '#80DEEA';
    ctx.fillText('د. المشرف الأكاديمي', sigX + sigW / 2, footerY + 64);

    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(sigX + 30, footerY + 76);
    ctx.lineTo(sigX + sigW - 30, footerY + 76);
    ctx.stroke();

    ctx.font = '600 11px "Tajawal", sans-serif';
    ctx.fillStyle = '#90A4AE';
    ctx.fillText('لجنة تحكيم العرض التقديمي والمسابقة', sigX + sigW / 2, footerY + 98);
    ctx.restore();
  }

  function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }

  function openCertificateModal(presetTeamId = null, presetMemberName = null) {
    if (!certModalBackdrop) return;
    populateCertSelectors(presetTeamId || myTeamId, presetMemberName || myPlayerName);
    certModalBackdrop.style.display = 'flex';
    requestAnimationFrame(() => certModalBackdrop.classList.add('active'));
    refreshCertificateView();
  }

  function closeCertificateModal() {
    if (!certModalBackdrop) return;
    certModalBackdrop.classList.remove('active');
    setTimeout(() => {
      certModalBackdrop.style.display = 'none';
    }, 250);
  }

  function populateCertSelectors(selectedTeamId = null, selectedMemberName = null) {
    if (!certTeamSelect) return;
    certTeamSelect.innerHTML = '';
    const teams = window.gameStateManager.getTeams();

    teams.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.id;
      opt.textContent = `${t.avatar} ${t.name}`;
      certTeamSelect.appendChild(opt);
    });

    if (selectedTeamId && teams.some(t => t.id === selectedTeamId)) {
      certTeamSelect.value = selectedTeamId;
    } else if (teams.length > 0) {
      certTeamSelect.value = teams[0].id;
    }

    populateMembersForTeam(certTeamSelect.value, selectedMemberName);
  }

  function populateMembersForTeam(teamId, selectedMemberName = null) {
    if (!certMemberSelect) return;
    certMemberSelect.innerHTML = '';
    const teams = window.gameStateManager.getTeams();
    const team = teams.find(t => t.id === teamId);

    if (team && team.members && team.members.length > 0) {
      team.members.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.name;
        opt.textContent = `👤 ${m.name} (${m.points || 0} نقطة)`;
        certMemberSelect.appendChild(opt);
      });

      if (selectedMemberName && team.members.some(m => m.name === selectedMemberName)) {
        certMemberSelect.value = selectedMemberName;
      } else {
        certMemberSelect.value = team.members[0].name;
      }

      if (certCustomNameInput) {
        certCustomNameInput.value = certMemberSelect.value;
      }
    } else {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '(لا يوجد أعضاء مسجلين بهذا الفريق بعد)';
      certMemberSelect.appendChild(opt);
      if (certCustomNameInput && !certCustomNameInput.value) {
        certCustomNameInput.value = myPlayerName || 'المتسابق المتميز';
      }
    }
  }

  function refreshCertificateView() {
    const teams = window.gameStateManager.getTeams();
    const selectedTeamId = certTeamSelect ? certTeamSelect.value : (myTeamId || (teams[0] ? teams[0].id : null));
    const team = teams.find(t => t.id === selectedTeamId) || teams[0];

    const certLang = certLangSelect ? certLangSelect.value : currentLang;
    const isEn = (certLang === 'en');

    // Compute rank
    const sortedTeams = [...teams].sort((a, b) => (b.score || 0) - (a.score || 0));
    const rankIdx = sortedTeams.findIndex(t => t.id === (team ? team.id : ''));
    const rankNamesAr = ['المركز الأول 🥇', 'المركز الثاني 🥈', 'المركز الثالث 🥉', 'المركز الرابع', 'المركز الخامس', 'المركز السادس', 'المركز السابع', 'المركز الثامن', 'المركز التاسع', 'المركز العاشر'];
    const rankNamesEn = ['1st Place 🥇', '2nd Place 🥈', '3rd Place 🥉', '4th Place', '5th Place', '6th Place', '7th Place', '8th Place', '9th Place', '10th Place'];
    const rankName = isEn
      ? (rankIdx >= 0 ? rankNamesEn[rankIdx] : '1st Place 🥇')
      : (rankIdx >= 0 ? rankNamesAr[rankIdx] : 'المركز الأول 🥇');

    let studentName = (certCustomNameInput && certCustomNameInput.value.trim()) || '';
    if (!studentName && certMemberSelect && certMemberSelect.value) {
      studentName = certMemberSelect.value;
    }
    if (!studentName) studentName = myPlayerName || (isEn ? 'Distinguished Participant' : 'المتسابق المتميز');

    let memberScore = 0;
    let questionsSolved = 0;
    if (team && team.members) {
      const mem = team.members.find(m => m.name === studentName) || team.members.find(m => m.name === (certMemberSelect ? certMemberSelect.value : ''));
      if (mem) {
        memberScore = mem.points || 0;
        questionsSolved = mem.questionsSolved || 0;
      }
    }

    if (window.CertificateRenderer) {
      window.CertificateRenderer.draw(certCanvas, {
        studentName,
        teamName: team ? team.name : (isEn ? 'Contest Team' : 'فريق المسابقة'),
        teamAvatar: team ? team.avatar : '🐞',
        teamScore: team ? team.score : 0,
        memberScore,
        questionsSolved,
        rankName,
        lang: certLang,
        witnessTitle: isEn ? 'Central Admin Control Panel' : 'لوحة تحكم المشرف المركزية'
      });
    }
  }

  function downloadCertificatePng() {
    if (!certCanvas || !window.CertificateRenderer) return;
    const studentName = (certCustomNameInput && certCustomNameInput.value.trim()) || myPlayerName || 'المتسابق';
    window.CertificateRenderer.downloadPng(certCanvas, `شهادة_تفوق_${studentName.replace(/\s+/g, '_')}.png`);
    soundController.playSuccess();
  }

  function printCertificatePdf() {
    if (!certCanvas || !window.CertificateRenderer) return;
    const studentName = (certCustomNameInput && certCustomNameInput.value.trim()) || myPlayerName || 'المتسابق';
    window.CertificateRenderer.printPdf(certCanvas, `شهادة إنجاز - ${studentName}`);
  }

  // Connect Certificate Listeners
  if (openCertBtn) {
    openCertBtn.addEventListener('click', () => {
      soundController.playClick();
      openCertificateModal();
    });
  }

  if (certCloseBtn) {
    certCloseBtn.addEventListener('click', () => {
      closeCertificateModal();
    });
  }

  if (certModalBackdrop) {
    certModalBackdrop.addEventListener('click', (e) => {
      if (e.target === certModalBackdrop) {
        closeCertificateModal();
      }
    });
  }

  if (certTeamSelect) {
    certTeamSelect.addEventListener('change', () => {
      populateMembersForTeam(certTeamSelect.value);
      refreshCertificateView();
    });
  }

  if (certMemberSelect) {
    certMemberSelect.addEventListener('change', () => {
      if (certCustomNameInput && certMemberSelect.value) {
        certCustomNameInput.value = certMemberSelect.value;
      }
      refreshCertificateView();
    });
  }

  if (certCustomNameInput) {
    certCustomNameInput.addEventListener('input', () => {
      refreshCertificateView();
    });
  }

  if (certLangSelect) {
    certLangSelect.addEventListener('change', () => {
      refreshCertificateView();
    });
  }

  if (btnDownloadCertPng) {
    btnDownloadCertPng.addEventListener('click', () => {
      downloadCertificatePng();
    });
  }

  if (btnPrintCertPdf) {
    btnPrintCertPdf.addEventListener('click', () => {
      printCertificatePdf();
    });
  }

  // Initial Boot
  updateLanguage(currentLang);
  renderRecentSpins();
});
