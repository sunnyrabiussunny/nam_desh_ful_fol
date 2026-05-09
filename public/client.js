// ═══════════════════════════════════════════════════════════════
//  NCFF BATTLE — Browser WebSocket Client
//  Replaces Android bridge for Linux/web version
//  Communicates with Node.js server via native WebSocket API
// ═══════════════════════════════════════════════════════════════

(function () {
  'use strict';

  let ws = null;
  let reconnectTimer = null;
  let reconnectCount = 0;
  const MAX_RECONNECT = 10;

  // ── Connect to server ───────────────────────────────────────
  function connectWS(host, port, onOpen) {
    if (ws && ws.readyState === WebSocket.OPEN) ws.close();

    const url = `ws://${host}:${port}`;
    ws = new WebSocket(url);

    ws.onopen = () => {
      reconnectCount = 0;
      console.log('[WS] Connected to', url);
      if (onOpen) onOpen();
    };

    ws.onmessage = (e) => {
      let msg;
      try { msg = JSON.parse(e.data); } catch (err) { return; }
      console.log('[WS →]', msg.type);

      // Visible debug bar
      if (typeof window._dbgLog === 'undefined') window._dbgLog = [];
      window._dbgLog.unshift(msg.type);
      window._dbgLog = window._dbgLog.slice(0, 6);
      let dbgEl = document.getElementById('_dbg');
      if (!dbgEl) {
        dbgEl = document.createElement('div');
        dbgEl.id = '_dbg';
        dbgEl.style.cssText = 'position:fixed;bottom:60px;left:8px;right:8px;background:rgba(0,0,0,0.8);color:#5ae0a0;font-family:monospace;font-size:11px;padding:5px 8px;border-radius:6px;z-index:9999;pointer-events:none';
        document.body.appendChild(dbgEl);
      }
      dbgEl.textContent = '📡 ' + window._dbgLog.join(' → ');

      routeServerMessage(msg);
    };

    ws.onerror = (e) => {
      console.error('[WS error]', e);
    };

    ws.onclose = () => {
      console.warn('[WS] Disconnected');
      if (state.screen !== 'home' && reconnectCount < MAX_RECONNECT) {
        reconnectCount++;
        const delay = Math.min(1000 * reconnectCount, 8000);
        toast(`🔄 Reconnecting (${reconnectCount})...`);
        reconnectTimer = setTimeout(() => {
          const host = state._serverHost;
          const port = state._serverPort;
          if (host && port) connectWS(host, port, () => {
            // Re-join after reconnect
            if (!state.isHost && state.myId && state.room) {
              const av = getAvatar(state.myId);
              sendToServer({
                type: 'join', clientId: state.myId,
                roomCode: state.room.code,
                player: { id: state.myId, name: state.myName, score: 0,
                          avatar: av.emoji, avatarColor: av.color, isHost: false }
              });
            }
          });
        }, delay);
      } else if (reconnectCount >= MAX_RECONNECT) {
        toast('❌ Could not reconnect. Please refresh.');
      }
    };
  }

  function sendToServer(obj) {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(obj));
    } else {
      console.warn('[WS] Cannot send — not connected');
    }
  }

  // ── Route all incoming server messages ───────────────────────
  function routeServerMessage(msg) {
    // error from server
    if (msg.type === 'error') {
      toast('⚠️ ' + msg.message);
      return;
    }
    // player_left notification
    if (msg.type === 'player_left') {
      toast(`${msg.name} left the game`);
      // fall through so room_state (sent next by server) updates UI
      return;
    }
    handleServerMessage(msg);
  }

  // ── OVERRIDE: hostGame ──────────────────────────────────────
  window.hostGame = function () {
    const name = document.getElementById('host-name').value.trim();
    if (!name) { toast('Enter your name first!'); return; }

    state.myId        = generateId();
    state.myName      = name;
    state.isHost      = true;
    state.totalRounds = parseInt(document.getElementById('host-rounds').value);
    state.categories  = editCategories.map(c => ({ ...c }));
    state.serverMode  = 'server';

    const av = getAvatar(state.myId);
    state.players = {};
    state.players[state.myId] = {
      id: state.myId, name, score: 0,
      avatar: av.emoji, avatarColor: av.color, isHost: true, connected: true,
    };
    state.room        = { code: generateRoomCode(), round: 0 };
    state.round       = 0;
    state.usedLetters = new Set();
    state.pickerIndex = 0;
    state.gamePhase   = 'lobby';

    // Connect to same server (localhost or LAN)
    const port = 3000;
    const host = window.location.hostname || 'localhost';
    state._serverHost = host;
    state._serverPort = port;

    connectWS(host, port, () => {
      sendToServer({
        type:        'create_room',
        clientId:    state.myId,
        roomCode:    state.room.code,
        player:      state.players[state.myId],
        totalRounds: state.totalRounds,
        categories:  state.categories,
      });
    });

    renderLobby();
    showScreen('lobby');

    // Show server URL info
    setTimeout(() => {
      const el = document.getElementById('lobby-server-info');
      if (el) el.innerHTML = `
        <div class="network-info">
          🌐 Room Code: <strong style="color:var(--accent)">${state.room.code}</strong><br>
          Players join at: <strong style="color:var(--accent4)">${window.location.origin}</strong><br>
          <span style="font-size:11px;color:var(--text-dim)">Everyone must be on the same WiFi</span>
        </div>`;
    }, 300);
  };

  // ── OVERRIDE: joinGame ──────────────────────────────────────
  window.joinGame = function () {
    const name     = document.getElementById('join-name').value.trim();
    const code     = document.getElementById('join-code').value.trim().toUpperCase();
    const hostAddr = document.getElementById('join-host').value.trim();

    if (!name) { toast('Enter your name!'); return; }
    if (!code || code.length < 4) { toast('Enter room code!'); return; }

    state.myId       = generateId();
    state.myName     = name;
    state.isHost     = false;
    state.room       = { code };
    state.serverMode = 'server';

    // Parse host address
    const parts = hostAddr ? hostAddr.split(':') : [window.location.hostname, '3210'];
    const host  = parts[0].trim() || window.location.hostname;
    const port  = parseInt(parts[1] || '3210');
    state._serverHost = host;
    state._serverPort = port;

    toast('Connecting to ' + host + ':' + port + '...');
    connectWS(host, port, () => {
      const av = getAvatar(state.myId);
      sendToServer({
        type:     'join',
        clientId: state.myId,
        roomCode: code,
        player:   {
          id: state.myId, name, score: 0,
          avatar: av.emoji, avatarColor: av.color, isHost: false,
        },
      });
      showScreen('lobby');
      renderLobby();
    });
  };

  // ── OVERRIDE: startGame ─────────────────────────────────────
  window.startGame = function () {
    if (!state.isHost) return;
    if (Object.keys(state.players).length < 2) {
      toast('Need at least 1 other player!'); return;
    }
    sendToServer({ type: 'start_game', clientId: state.myId });
  };

  // ── OVERRIDE: broadcast → sendToServer ─────────────────────
  // In server mode, host sends commands to server which relays to all
  window.broadcast = function (msg) {
    if (state.serverMode === 'server') {
      // Map internal broadcast types to server message types
      if (msg.type === 'game_start') {
        // server handles this on its own after start_game/next_round
        return;
      }
      if (msg.type === 'letter_selected') {
        // Already sent via pickLetter → pick_letter message
        return;
      }
      if (msg.type === 'room_state') {
        renderLobby();
        return;
      }
      // Everything else: host UI updates locally
      if (msg.type !== 'room_state') handleServerMessage(msg);
    } else {
      // Demo mode fallback
      if (msg.players) msg = { ...msg, players: JSON.parse(JSON.stringify(msg.players)) };
      if (msg.type === 'room_state') { renderLobby(); }
      else { handleServerMessage(msg); }
    }
  };

  // ── OVERRIDE: pickLetter ────────────────────────────────────
  window.pickLetter = function (letter) {
    if (state.usedLetters.has(letter)) return;
    state.usedLetters.add(letter);
    sendToServer({ type: 'pick_letter', clientId: state.myId, letter });
  };

  // ── OVERRIDE: submitAnswers ─────────────────────────────────
  const _origSubmit = window.submitAnswers;
  window.submitAnswers = function () {
    if (state.hasSubmitted) return;
    const answers = {};
    state.categories.forEach(cat => {
      const inp = document.getElementById('ans-' + cat.id);
      answers[cat.id] = inp ? inp.value.trim() : '';
    });
    state.hasSubmitted = true;
    state.myAnswers    = answers;

    document.getElementById('submit-btn').style.display   = 'none';
    document.getElementById('submitted-notice').style.display = 'flex';
    document.querySelectorAll('.answer-input').forEach(i => i.disabled = true);

    sendToServer({ type: 'submit_answers', clientId: state.myId, answers });
    if (navigator.vibrate) navigator.vibrate(50);
  };

  // ── OVERRIDE: nextRound ─────────────────────────────────────
  window.nextRound = function () {
    if (!state.isHost) return;
    sendToServer({ type: 'next_round', clientId: state.myId });
  };

  // ── OVERRIDE: playAgain ─────────────────────────────────────
  window.playAgain = function () {
    if (state.isHost) {
      sendToServer({ type: 'play_again', clientId: state.myId });
    } else {
      showScreen('lobby');
    }
  };

  // ── Room discovery ──────────────────────────────────────────
  window.discoverRooms = function () {
    showOverlay('discover');
    const list = document.getElementById('discover-list');
    list.innerHTML = '<div class="info-text" style="padding:12px">🔍 Scanning...</div>';
    fetch('/api/info')
      .then(r => r.json())
      .then(data => {
        if (!data.rooms || data.rooms.length === 0) {
          list.innerHTML = '<div class="info-text" style="padding:12px">No open rooms found.<br>Ask host for the room code.</div>';
          return;
        }
        list.innerHTML = '';
        data.rooms.filter(r => r.phase === 'lobby').forEach(room => {
          const item = document.createElement('div');
          item.className = 'player-item';
          item.innerHTML = `
            <div style="font-size:24px">🎮</div>
            <div style="flex:1">
              <div style="font-weight:700">${room.code}</div>
              <div style="font-size:12px;color:var(--text-dim)">${room.players} player(s)</div>
            </div>
            <button class="btn btn-primary btn-sm"
              onclick="quickJoin('${room.code}','${data.ip}',${data.port})">Join</button>`;
          list.appendChild(item);
        });
      })
      .catch(() => {
        list.innerHTML = '<div class="info-text" style="padding:12px">Could not reach server.</div>';
      });
  };

  window.quickJoin = function (code, host, port) {
    document.getElementById('join-code').value  = code;
    document.getElementById('join-host').value  = host + ':' + port;
    closeOverlay('discover');
    document.querySelectorAll('.tab')[1].click();
  };

  // ── Copy room code ──────────────────────────────────────────
  window.copyCode = function () {
    const code = document.getElementById('lobby-code').textContent;
    navigator.clipboard?.writeText(code).then(() => toast('Copied: ' + code));
  };

  // ── Back button ─────────────────────────────────────────────
  window.handleBackButton = function () {
    if (state.screen !== 'home') leaveRoom();
    return true;
  };

  // ── Vibration hooks ─────────────────────────────────────────
  const _origReveal = window.revealLetter;
  window.revealLetter = function (letter, round) {
    if (navigator.vibrate) navigator.vibrate(100);
    _origReveal(letter, round);
  };

  console.log('[NCFF Browser Client] Ready | Server mode via WebSocket');
})();
