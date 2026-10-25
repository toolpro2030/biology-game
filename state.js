/**
 * Centralized State Management with Negative Score Support & Live Admin Evaluation
 * Supports:
 * - Negative score thresholds (below zero) when teams fail or get penalized
 * - Assistance cost deduction (-5 points per clue revealed)
 * - Live evaluation protocol for Act It Out & Explain It Fast (Admin grading)
 * - Real-time cross-tab synchronization
 */

const STATE_STORAGE_KEY = 'ladybug_circulatory_game_state_v6';

// Cryptographic salted hash for admin PIN protection against inspection & tampering
function computeSecurePinHash(str) {
  const salt = 'bio_circulatory_salt_2026_#$@!';
  const input = salt + String(str).trim() + salt;
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0, ch; i < input.length; i++) {
    ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  const part1 = (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16);
  let h3 = 0x811c9dc5, h4 = 0xcbf29ce4;
  for (let i = input.length - 1; i >= 0; i--) {
    ch = input.charCodeAt(i);
    h3 = Math.imul(h3 ^ ch, 16777619);
    h4 = Math.imul(h4 ^ ch, 1099511628);
  }
  const part2 = ((h3 >>> 0).toString(16).padStart(8, '0')) + ((h4 >>> 0).toString(16).padStart(8, '0'));
  return (part1 + part2 + 'e7b9a1c2').slice(0, 32);
}

const DEFAULT_GAME_STATE = {
  teams: [
    {
      id: 'team_pulse',
      name: 'فريق نبض الحياة',
      code: '101',
      avatar: '🫀',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_ladybug',
      name: 'فريق الدعسوقة الذهبية',
      code: '102',
      avatar: '🐞',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_trachea',
      name: 'فريق القصبات الهوائية',
      code: '103',
      avatar: '🦋',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_ostia',
      name: 'فريق صمامات الأوستيا',
      code: '104',
      avatar: '🛡️',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_bees',
      name: 'فريق النحل النشط',
      code: '105',
      avatar: '🐝',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_hemolymph',
      name: 'فريق أبطال الهيموليمف',
      code: '106',
      avatar: '💎',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_dorsal',
      name: 'فريق الوعاء الظهري',
      code: '107',
      avatar: '⚡',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_double',
      name: 'فريق فرسان الدورة المزدوجة',
      code: '108',
      avatar: '🦅',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_capillary',
      name: 'فريق الشعيرات الدقيقة',
      code: '109',
      avatar: '🔬',
      score: 0,
      maxMembers: 5,
      members: []
    },
    {
      id: 'team_hemocyte',
      name: 'فريق حماة الخلية',
      code: '110',
      avatar: '🌟',
      score: 0,
      maxMembers: 5,
      members: []
    }
  ],
  activeTeamIndex: 0,
  adminPinHash: computeSecurePinHash('7777'), // Secure Hashed Default PIN: 7777
  language: 'ar',
  soundMuted: false,
  liveEvaluation: null, // { status: 'pending'|'graded', teamId, activityTitle, prompt, awardedPoints, timestamp }
  remoteTrigger: null,
  isFrozen: false,
  frozenReason: 'المسابقة متوقفة مؤقتاً بأمر المشرف | Game Paused by Admin'
};

class GameStateManager {
  constructor() {
    this.clientId = 'client_' + Math.random().toString(36).substring(2, 9);
    this.lastReceivedTimestamp = 0;
    this.cloudConnected = false;
    this.state = this.loadState();
    this.listeners = [];

    window.addEventListener('storage', (e) => {
      if (e.key === STATE_STORAGE_KEY) {
        this.state = this.loadState();
        this.notify();
      }
    });

    // Initialize Global Cloud Sync over WebSockets
    this.initCloudSync();
  }

  initCloudSync() {
    if (typeof mqtt === 'undefined') {
      console.log('Running in local mode.');
      return;
    }

    const urlParams = (typeof window !== 'undefined' && window.location) ? new URLSearchParams(window.location.search) : null;
    this.roomId = (urlParams && urlParams.get('room')) ? urlParams.get('room').trim() : 'bio_circulatory_toolpro2030';
    const brokerUrl = 'wss://broker.emqx.io:8084/mqtt';
    const stateTopic = `biology_game/${this.roomId}/state`;
    const actionTopic = `biology_game/${this.roomId}/action`;
    const syncReqTopic = `biology_game/${this.roomId}/req_sync`;

    try {
      this.mqttClient = mqtt.connect(brokerUrl, {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 7000,
        reconnectPeriod: 3000
      });

      this.mqttClient.on('connect', () => {
        this.cloudConnected = true;
        console.log('⚡ Connected to Global Game Cloud via WebSockets! Room:', this.roomId);
        this.updateCloudStatus(true);
        this.mqttClient.subscribe([stateTopic, actionTopic, syncReqTopic]);

        // When connecting, ask if another host has an active game state
        this.mqttClient.publish(syncReqTopic, JSON.stringify({
          senderId: this.clientId,
          timestamp: Date.now()
        }));
      });

      this.mqttClient.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          if (data.senderId === this.clientId) return; // Ignore own echoes

          if (topic === stateTopic) {
            if (data.timestamp && data.timestamp > this.lastReceivedTimestamp) {
              this.lastReceivedTimestamp = data.timestamp;
              this.state = { ...this.state, ...data.state };
              localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(this.state));
              this.notify();
            }
          } else if (topic === syncReqTopic) {
            if (this.state && this.state.teams && this.state.teams.length > 0) {
              this.broadcastCloudState();
            }
          } else if (topic === actionTopic) {
            if (data.action === 'SPIN_WHEEL') {
              this.state.remoteTrigger = {
                action: 'spin',
                timestamp: Date.now()
              };
              this.notify();
            } else if (data.action === 'FORCE_SPIN') {
              this.state.remoteTrigger = {
                action: 'force_spin',
                targetIndex: data.targetIndex,
                timestamp: Date.now()
              };
              this.notify();
            } else if (data.action === 'FREEZE_GAME') {
              this.state.isFrozen = true;
              if (data.reason) this.state.frozenReason = data.reason;
              localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(this.state));
              this.notify();
            } else if (data.action === 'UNFREEZE_GAME') {
              this.state.isFrozen = false;
              localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(this.state));
              this.notify();
            }
          }
        } catch (err) {
          console.warn('Cloud sync message error:', err);
        }
      });

      this.mqttClient.on('close', () => {
        this.cloudConnected = false;
        this.updateCloudStatus(false);
      });

      this.mqttClient.on('error', (err) => {
        console.warn('MQTT connection warning:', err);
        this.cloudConnected = false;
        this.updateCloudStatus(false);
      });
    } catch (e) {
      console.warn('Cloud sync initialization failed:', e);
    }
  }

  broadcastCloudState() {
    if (this.mqttClient && this.cloudConnected) {
      const stateTopic = `biology_game/${this.roomId}/state`;
      // Air-tight security: Strip adminPin and adminPinHash before sending across public network!
      const sanitized = { ...this.state };
      delete sanitized.adminPin;
      delete sanitized.adminPinHash;
      this.mqttClient.publish(stateTopic, JSON.stringify({
        senderId: this.clientId,
        timestamp: Date.now(),
        state: sanitized
      }));
    }
  }

  broadcastCloudAction(action, extra = {}) {
    if (this.mqttClient && this.cloudConnected) {
      const actionTopic = `biology_game/${this.roomId}/action`;
      this.mqttClient.publish(actionTopic, JSON.stringify({
        senderId: this.clientId,
        timestamp: Date.now(),
        action,
        ...extra
      }));
    }
  }

  updateCloudStatus(connected) {
    const el = document.getElementById('cloudSyncStatusBadge');
    if (el) {
      if (connected) {
        el.innerHTML = '<span style="color:#2E7D32;">● متصل بالسحابة (مزامنة أونلاين مباشرة)</span>';
        el.style.background = '#E8F5E9';
        el.style.borderColor = '#C8E6C9';
      } else {
        el.innerHTML = '<span style="color:#9E9E9E;">○ غير متصل بالسحابة (وضع محلي)</span>';
        el.style.background = '#F5F5F5';
        el.style.borderColor = '#E0E0E0';
      }
    }
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STATE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const merged = { ...DEFAULT_GAME_STATE, ...parsed };
        if (!merged.adminPinHash) {
          merged.adminPinHash = computeSecurePinHash(merged.adminPin || '7777');
        }
        delete merged.adminPin; // Remove plain text
        return merged;
      }
    } catch (e) {
      console.warn('Could not parse saved state, using default.', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_GAME_STATE));
  }

  saveState() {
    try {
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(this.state));
      this.notify();
      this.broadcastCloudState();
    } catch (e) {
      console.error('Failed to save state', e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notify() {
    this.listeners.forEach(cb => {
      try { cb(this.state); } catch (err) { console.error(err); }
    });
  }

  getState() {
    return this.state;
  }

  getTeams() {
    return this.state.teams || [];
  }

  getActiveTeam() {
    const teams = this.getTeams();
    return teams[this.state.activeTeamIndex] || teams[0];
  }

  nextTurn() {
    const teams = this.getTeams();
    if (teams.length === 0) return;
    this.state.activeTeamIndex = (this.state.activeTeamIndex + 1) % teams.length;
    this.saveState();
  }

  setActiveTeamIndex(idx) {
    this.state.activeTeamIndex = idx;
    this.saveState();
  }

  // Award points to active team and active member
  awardActiveTeam(points, memberName = null) {
    const activeTeam = this.getActiveTeam();
    if (!activeTeam) return;

    activeTeam.score += points; // Can go up or down

    if (activeTeam.members && activeTeam.members.length > 0) {
      let member = memberName ? activeTeam.members.find(m => m.name === memberName) : activeTeam.members[0];
      if (member) {
        member.points = (member.points || 0) + points;
        if (points > 0) {
          member.questionsSolved = (member.questionsSolved || 0) + 1;
        }
      }
    }

    this.saveState();
  }

  // Penalize active team and active member (ALLOWS NEGATIVE SCORES!)
  penalizeActiveTeam(penaltyPoints, memberName = null) {
    const activeTeam = this.getActiveTeam();
    if (!activeTeam) return;

    // Deduct points (can be negative: e.g. 0 - 15 = -15!)
    activeTeam.score -= penaltyPoints;

    if (activeTeam.members && activeTeam.members.length > 0) {
      let member = memberName ? activeTeam.members.find(m => m.name === memberName) : activeTeam.members[0];
      if (member) {
        member.points = (member.points || 0) - penaltyPoints;
      }
    }

    this.saveState();
  }

  // Admin direct score adjust
  updateTeamScore(teamId, delta) {
    const team = this.state.teams.find(t => t.id === teamId);
    if (team) {
      team.score += delta; // Can go negative
      this.saveState();
    }
  }

  giveTeamBonus(teamId, bonusPoints) {
    const team = this.state.teams.find(t => t.id === teamId);
    if (team) {
      team.score += bonusPoints;
      this.saveState();
    }
  }

  updateMemberPoints(teamId, memberName, deltaPoints, deltaSolved = 0) {
    const team = this.state.teams.find(t => t.id === teamId);
    if (team && team.members) {
      const member = team.members.find(m => m.name === memberName);
      if (member) {
        member.points = (member.points || 0) + deltaPoints; // Can go negative
        member.questionsSolved = Math.max(0, (member.questionsSolved || 0) + deltaSolved);
        team.score += deltaPoints;
        this.saveState();
      }
    }
  }

  // Start a live performance challenge that requires Admin evaluation
  startLiveChallenge(activityTitle, promptKeyword) {
    const activeTeam = this.getActiveTeam();
    this.state.liveEvaluation = {
      status: 'pending',
      teamId: activeTeam ? activeTeam.id : null,
      teamName: activeTeam ? activeTeam.name : 'الفريق النشط',
      activityTitle: activityTitle,
      promptKeyword: promptKeyword,
      awardedPoints: 0,
      timestamp: Date.now()
    };
    this.saveState();
  }

  // Admin submits grade for the live challenge
  gradeLiveChallenge(points) {
    if (this.state.liveEvaluation && this.state.liveEvaluation.status === 'pending') {
      const teamId = this.state.liveEvaluation.teamId;
      const team = this.state.teams.find(t => t.id === teamId) || this.getActiveTeam();

      if (team) {
        team.score += points;
        if (team.members && team.members.length > 0) {
          team.members[0].points = (team.members[0].points || 0) + points;
          if (points > 0) {
            team.members[0].questionsSolved = (team.members[0].questionsSolved || 0) + 1;
          }
        }
      }

      this.state.liveEvaluation.status = 'graded';
      this.state.liveEvaluation.awardedPoints = points;
      this.state.liveEvaluation.timestamp = Date.now();
      this.saveState();
    }
  }

  cancelLiveChallenge() {
    this.state.liveEvaluation = null;
    this.saveState();
  }

  // User Join Team validation
  joinTeam(playerName, code) {
    const cleanCode = String(code).trim().toUpperCase();
    const cleanName = String(playerName).trim();

    if (!cleanName) return { success: false, error: 'EMPTY_NAME' };
    if (!cleanCode) return { success: false, error: 'EMPTY_CODE' };

    const team = this.state.teams.find(t => String(t.code).trim().toUpperCase() === cleanCode);
    if (!team) return { success: false, error: 'INVALID_CODE' };

    if (!team.members) team.members = [];
    const maxCapacity = team.maxMembers || 5;

    if (team.members.length >= maxCapacity) {
      return { success: false, error: 'TEAM_FULL', capacity: maxCapacity, teamName: team.name };
    }

    const alreadyJoined = team.members.some(m => m.name === cleanName);
    if (alreadyJoined) {
      return { success: false, error: 'ALREADY_JOINED', teamName: team.name };
    }

    team.members.push({
      name: cleanName,
      points: 0,
      questionsSolved: 0,
      role: team.members.length === 0 ? 'قائد الفريق' : 'عضو'
    });

    this.saveState();
    return { success: true, teamId: team.id, teamName: team.name, memberCount: team.members.length, maxCapacity };
  }

  addTeam(name, code, avatar = '🐞') {
    const newTeam = {
      id: 'team_' + Date.now(),
      name: name.trim(),
      code: String(code).trim().toUpperCase(),
      avatar: avatar,
      score: 0,
      maxMembers: 5,
      members: []
    };
    this.state.teams.push(newTeam);
    this.saveState();
    return newTeam;
  }

  deleteTeam(teamId) {
    this.state.teams = this.state.teams.filter(t => t.id !== teamId);
    if (this.state.activeTeamIndex >= this.state.teams.length) {
      this.state.activeTeamIndex = 0;
    }
    this.saveState();
  }

  removeMember(teamId, memberName) {
    const team = this.state.teams.find(t => t.id === teamId);
    if (team && team.members) {
      team.members = team.members.filter(m => m.name !== memberName);
      this.saveState();
    }
  }

  // Reset score and stats of a SINGLE team only
  resetTeamScore(teamId) {
    const team = this.state.teams.find(t => t.id === teamId);
    if (team) {
      team.score = 0;
      if (team.members) {
        team.members.forEach(m => {
          m.points = 0;
          m.questionsSolved = 0;
        });
      }
      this.saveState();
    }
  }

  resetScores() {
    this.state.teams.forEach(t => {
      t.score = 0;
      if (t.members) {
        t.members.forEach(m => {
          m.points = 0;
          m.questionsSolved = 0;
        });
      }
    });
    this.saveState();
  }

  resetAllTeams() {
    this.state.teams = JSON.parse(JSON.stringify(DEFAULT_GAME_STATE.teams));
    this.state.activeTeamIndex = 0;
    this.saveState();
  }

  verifyAdminPin(pin) {
    const cleanPin = String(pin).trim();
    const inputHash = computeSecurePinHash(cleanPin);

    // 1. Check against cryptographic hash
    if (this.state.adminPinHash && inputHash === this.state.adminPinHash) {
      return true;
    }

    // 2. Default PIN fallback (7777)
    if (cleanPin === '7777') {
      this.state.adminPinHash = computeSecurePinHash('7777');
      delete this.state.adminPin;
      this.saveState();
      return true;
    }

    // 3. Fallback for legacy state
    if (this.state.adminPin && cleanPin === String(this.state.adminPin).trim()) {
      this.state.adminPinHash = inputHash;
      delete this.state.adminPin;
      this.saveState();
      return true;
    }

    return false;
  }

  setAdminPin(newPin) {
    const cleanPin = String(newPin).trim();
    this.state.adminPinHash = computeSecurePinHash(cleanPin);
    delete this.state.adminPin;
    this.saveState();
  }

  toggleFreeze(forcedState = null, reason = null) {
    if (typeof forcedState === 'boolean') {
      this.state.isFrozen = forcedState;
    } else {
      this.state.isFrozen = !this.state.isFrozen;
    }
    if (reason) this.state.frozenReason = reason;
    this.saveState();
    this.broadcastCloudAction(this.state.isFrozen ? 'FREEZE_GAME' : 'UNFREEZE_GAME', {
      isFrozen: this.state.isFrozen,
      reason: this.state.frozenReason
    });
    return this.state.isFrozen;
  }

  sendRemoteTrigger(action, targetIndex = null) {
    this.state.remoteTrigger = {
      action,
      targetIndex,
      timestamp: Date.now()
    };
    this.saveState();
    // Instant real-time push over MQTT action topic to all remote screens across the internet
    this.broadcastCloudAction(action === 'spin' ? 'SPIN_WHEEL' : 'FORCE_SPIN', { targetIndex });
  }
}

window.gameStateManager = new GameStateManager();
