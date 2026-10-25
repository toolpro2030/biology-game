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

  // State
  let currentLang = window.activityManager.getLanguage() || 'ar';
  let recentSpins = [];
  let currentTimerInterval = null;
  let lastProcessedTrigger = 0;
  let lastProcessedEvalTimestamp = 0;

  // Registered Student in this browser
  let myTeamId = localStorage.getItem('my_registered_team_id');
  let myPlayerName = localStorage.getItem('my_registered_player_name');

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
      waitingAdminResume: 'في انتظار إشارة الاستئناف من المشرف...'
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
      waitingAdminResume: 'Waiting for admin to resume...'
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
  }

  function updatePlayerBadge() {
    if (myTeamId && myPlayerName) {
      const teams = window.gameStateManager.getTeams();
      const t = teams.find(team => team.id === myTeamId);
      if (t) {
        playerTeamBadge.style.display = 'inline-flex';
        playerTeamBadgeText.textContent = `${currentLang === 'ar' ? 'فريقك المثبت:' : 'Your Team:'} ${t.name} (👤 ${myPlayerName})`;
        joinTeamBtn.style.display = 'none'; // Lock from joining another team
      } else {
        myTeamId = null;
        myPlayerName = null;
        localStorage.removeItem('my_registered_team_id');
        localStorage.removeItem('my_registered_player_name');
        playerTeamBadge.style.display = 'none';
        joinTeamBtn.style.display = 'inline-flex';
      }
    } else {
      playerTeamBadge.style.display = 'none';
      joinTeamBtn.style.display = 'inline-flex';
    }
  }

  // Wheel Initialization
  const spinner = new SpinnerWheel('wheelCanvas', {
    onSpinStart: () => {
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

      card.innerHTML = `
        ${idx === activeIdx ? `<div class="team-turn-badge">${UI_TRANSLATIONS[currentLang].turnBadge}</div>` : ''}

        <div class="team-header-row">
          <div class="team-info">
            <div class="team-avatar" style="position:relative;">
              ${team.avatar}
              ${rankBadge ? `<span style="position:absolute; bottom:-6px; right:-6px; font-size:16px;" title="ترتيب المتصدرين">${rankBadge}</span>` : ''}
            </div>
            <div>
              <div class="team-name-text">${team.name}</div>
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
              <span style="font-weight: 800; color: #2C2623;">👤 ${m.name}</span>
              <div style="display: flex; gap: 8px; font-weight: 800;">
                <span style="${(m.points || 0) < 0 ? 'color: #D32F2F;' : 'color: #D82655;'}">⭐ ${m.points || 0} نقطة ${(m.points || 0) < 0 ? '⚠️' : ''}</span>
                <span style="color: #2E7D32;">🎯 ${m.questionsSolved || 0} حلول</span>
              </div>
            </div>
          `).join('') : '<span style="font-size: 11.5px; color: #9E9E9E; text-align: center;">بانتظار انضمام الأعضاء...</span>'}
        </div>
      `;

      list.appendChild(card);
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
      } else if (res.error === 'ALREADY_JOINED') {
        showJoinMsg(currentLang === 'ar' ? `أنت مسجل بالفعل في ${res.teamName}!` : `You are already registered!`, 'info');
      }
    } else {
      soundController.playSuccess();
      myTeamId = res.teamId;
      myPlayerName = name;
      localStorage.setItem('my_registered_team_id', res.teamId);
      localStorage.setItem('my_registered_player_name', name);

      showJoinMsg(currentLang === 'ar' ? `🎉 أهلاً بك يا ${name}! تم تثبيتك بنجاح في "${res.teamName}" (عضو رقم ${res.memberCount} من 5)!` : `🎉 Welcome ${name}! Successfully joined "${res.teamName}"!`, 'success');

      updatePlayerBadge();
      renderJoinTeamsList();
      setTimeout(() => {
        joinTeamModalBackdrop.classList.remove('active');
      }, 1800);
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

  // 1. Quick Quiz (Multiple Choice with -15 deduction)
  function renderQuickQuizModal(item, segment) {
    const lang = currentLang;
    const qText = item.question[lang] || item.question.en;
    const options = item.options[lang] || item.options.en;
    const activeTeam = window.gameStateManager.getActiveTeam();

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

    options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[optIdx]}</span>
        <span>${optText}</span>
      `;

      btn.addEventListener('click', () => {
        clearInterval(currentTimerInterval);
        const allBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);

        const expCard = document.getElementById('quizExplanationCard');
        const expText = item.explanation ? (item.explanation[lang] || item.explanation.en) : '';

        if (optIdx === item.correctIndex) {
          btn.classList.add('correct');
          soundController.playSuccess();
          window.gameStateManager.awardActiveTeam(30);
          expCard.innerHTML = `<strong>🎉 ${lang === 'ar' ? 'إجابة صحيحة! (+30 نقطة)' : 'Correct! (+30 Points)'}</strong><br>${expText}`;
        } else {
          btn.classList.add('wrong');
          allBtns[item.correctIndex].classList.add('correct');
          soundController.playBuzzer();
          window.gameStateManager.penalizeActiveTeam(15);
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
        allBtns.forEach(b => b.disabled = true);
        allBtns[item.correctIndex].classList.add('correct');
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

    // Options for Mystery
    const optionsGrid = document.getElementById('mysteryOptionsGrid');
    const letters = ['A', 'B', 'C', 'D'];

    options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[optIdx]}</span>
        <span>${optText}</span>
      `;

      btn.addEventListener('click', () => {
        const allBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);
        const ansCard = document.getElementById('mysteryAnswerCard');

        if (optIdx === (item.correctIndex || 0)) {
          btn.classList.add('correct');
          soundController.playSuccess();
          window.gameStateManager.awardActiveTeam(30);
          ansCard.innerHTML = `<strong>🎉 ${lang === 'ar' ? 'تخمين عبقري صحيح! (+30 نقطة)' : 'Brilliant Guess! (+30 Points)'}</strong><br>الحل: ${answer}<br>${funFact}`;
        } else {
          btn.classList.add('wrong');
          allBtns[item.correctIndex || 0].classList.add('correct');
          soundController.playBuzzer();
          window.gameStateManager.penalizeActiveTeam(15);
          ansCard.innerHTML = `<strong>❌ ${lang === 'ar' ? 'تخمين غير صحيح! (خصم -15 نقطة)' : 'Wrong Guess! (-15 Points)'}</strong><br>الحل الصحيح هو: ${answer}<br>${funFact}`;
        }
        ansCard.classList.add('visible');
      });

      optionsGrid.appendChild(btn);
    });
  }

  // 3. Fix the Mistake (Multiple Choice Options with -15 deduction)
  function renderFixMistakeModal(item, segment) {
    const lang = currentLang;
    const sentence = item.sentence[lang] || item.sentence.en;
    const options = item.options ? (item.options[lang] || item.options.en) : [];
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

    options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="quiz-option-letter">${letters[optIdx]}</span>
        <span>${optText}</span>
      `;

      btn.addEventListener('click', () => {
        const allBtns = optionsGrid.querySelectorAll('.quiz-option-btn');
        allBtns.forEach(b => b.disabled = true);
        const expCard = document.getElementById('fixExplanationCard');

        if (optIdx === (item.correctIndex || 0)) {
          btn.classList.add('correct');
          soundController.playSuccess();
          window.gameStateManager.awardActiveTeam(30);
          expCard.innerHTML = `<strong>✅ ${lang === 'ar' ? 'تصحيح ممتاز! (+30 نقطة)' : 'Correct Fix! (+30 Points)'}</strong><br>${explanation}`;
        } else {
          btn.classList.add('wrong');
          allBtns[item.correctIndex || 0].classList.add('correct');
          soundController.playBuzzer();
          window.gameStateManager.penalizeActiveTeam(15);
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
        window.gameStateManager.awardActiveTeam(50);
      } else if (item.effect === 'steal_20') {
        const teams = window.gameStateManager.getTeams();
        const activeIdx = window.gameStateManager.getState().activeTeamIndex || 0;
        const otherIdx = (activeIdx + 1) % teams.length;
        if (teams[otherIdx]) {
          window.gameStateManager.updateTeamScore(teams[otherIdx].id, -20);
          window.gameStateManager.awardActiveTeam(20);
        }
      }
    });
  }

  // Initial Boot
  updateLanguage(currentLang);
  renderRecentSpins();
});
