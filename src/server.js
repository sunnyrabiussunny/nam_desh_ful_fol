#!/usr/bin/env node
// NCFF BATTLE — Pure Node.js Server (ZERO dependencies)
// নাম · দেশ · ফুল · ফল
// No npm install needed — just: node src/server.js
'use strict';

const http   = require('http');
const crypto = require('crypto');
const fs     = require('fs');
const path   = require('path');
const os     = require('os');

const PORT   = parseInt(process.env.PORT) || 3210;
const PUBLIC = path.join(__dirname, '..', 'public');
const isDev  = process.argv.includes('--dev');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
};

const rooms   = new Map();
const sockets = new Map();
let   socketIdCounter = 0;

// ════════════════════════════════════════════════════════════
//  RFC 6455 WebSocket per-connection handler
// ════════════════════════════════════════════════════════════
class NCFFSocket {
  constructor(socket, id) {
    this.socket   = socket;
    this.id       = id;
    this.playerId = null;
    this.roomCode = null;
    this.open     = true;
    this._buf     = Buffer.alloc(0);

    socket.setKeepAlive(true, 15000);
    socket.setNoDelay(true);
    socket.setTimeout(0); // NO timeout ever

    socket.on('data',  (b) => this._onData(b));
    socket.on('end',   ()  => this._close('end'));
    socket.on('error', (e) => this._close('error:' + e.message));
    socket.on('close', ()  => this._close('close'));

    this._ping = setInterval(() => this._sendCtrl(0x89), 8000);
  }

  send(obj) {
    if (!this.open) return;
    const buf = Buffer.from(typeof obj === 'string' ? obj : JSON.stringify(obj), 'utf8');
    this._writeFrame(0x81, buf);
  }

  _sendCtrl(opcode) {
    if (!this.open) return;
    this._writeFrame(opcode, Buffer.alloc(0));
  }

  _writeFrame(opcode, payload) {
    if (!this.open || this.socket.destroyed) return;
    const len = payload.length;
    let hdr;
    if      (len <= 125)   { hdr = Buffer.from([opcode, len]); }
    else if (len <= 65535) { hdr = Buffer.alloc(4); hdr[0]=opcode; hdr[1]=126; hdr.writeUInt16BE(len,2); }
    else                   { hdr = Buffer.alloc(10); hdr[0]=opcode; hdr[1]=127; hdr.writeBigUInt64BE(BigInt(len),2); }
    try { this.socket.write(Buffer.concat([hdr, payload])); } catch(e) { this._close('write-err'); }
  }

  _onData(chunk) {
    this._buf = Buffer.concat([this._buf, chunk]);
    let safety = 0;
    while (this._buf.length >= 2 && safety++ < 100) {
      const b0 = this._buf[0], b1 = this._buf[1];
      const opcode = b0 & 0x0F;
      const masked = (b1 & 0x80) !== 0;
      let plen = b1 & 0x7F, off = 2;
      if      (plen === 126) { if (this._buf.length < 4)  return; plen = this._buf.readUInt16BE(2); off = 4; }
      else if (plen === 127) { if (this._buf.length < 10) return; plen = Number(this._buf.readBigUInt64BE(2)); off = 10; }
      if (masked) { if (this._buf.length < off + 4) return; off += 4; }
      if (this._buf.length < off + plen) return;

      let payload = this._buf.slice(off, off + plen);
      if (masked) {
        const mk = this._buf.slice(off - 4, off);
        payload = Buffer.from(payload);
        for (let i = 0; i < payload.length; i++) payload[i] ^= mk[i % 4];
      }
      this._buf = this._buf.slice(off + plen);

      if      (opcode === 0x1) { this._onText(payload.toString('utf8')); }
      else if (opcode === 0x8) { this._writeFrame(0x88, Buffer.alloc(0)); this._close('client-close'); return; }
      else if (opcode === 0x9) { this._writeFrame(0x8A, payload); }
    }
  }

  _onText(text) {
    let msg; try { msg = JSON.parse(text); } catch(e) { return; }
    if (isDev) console.log(`[← ${this.id}] ${msg.type}`);
    handleMessage(this, msg);
  }

  _close(reason) {
    if (!this.open) return;
    this.open = false;
    clearInterval(this._ping);
    sockets.delete(this.id);
    if (isDev) console.log(`[✗ ${this.id}] ${reason}`);
    handleDisconnect(this);
    if (!this.socket.destroyed) this.socket.destroy();
  }
}

// ════════════════════════════════════════════════════════════
//  HTTP + WebSocket upgrade
// ════════════════════════════════════════════════════════════
const httpServer = http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';

  if (url === '/api/info') {
    const list = [];
    rooms.forEach((r, code) => list.push({ code, players: r.players.size, phase: r.phase }));
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    res.end(JSON.stringify({ ip: getLocalIP(), port: PORT, rooms: list }));
    return;
  }

  const fp = path.join(PUBLIC, url);
  if (!fp.startsWith(PUBLIC)) { res.writeHead(403); res.end('Forbidden'); return; }
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': MIME[path.extname(fp)] || 'text/plain' });
    res.end(data);
  });
});

httpServer.on('upgrade', (req, socket) => {
  if (req.headers.upgrade?.toLowerCase() !== 'websocket') { socket.destroy(); return; }
  const key    = req.headers['sec-websocket-key'];
  const accept = crypto.createHash('sha1')
    .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
  socket.write(
    'HTTP/1.1 101 Switching Protocols\r\n' +
    'Upgrade: websocket\r\nConnection: Upgrade\r\n' +
    `Sec-WebSocket-Accept: ${accept}\r\n\r\n`
  );
  const id = ++socketIdCounter;
  sockets.set(id, new NCFFSocket(socket, id));
  if (isDev) console.log(`[+] Socket ${id} (${sockets.size} open)`);
});

// ════════════════════════════════════════════════════════════
//  GAME LOGIC
// ════════════════════════════════════════════════════════════
function handleMessage(ws, msg) {
  switch (msg.type) {

    case 'create_room': {
      const { clientId, roomCode, player, totalRounds, categories } = msg;
      if (!clientId || !roomCode) return;
      if (rooms.has(roomCode)) clearTimeout(rooms.get(roomCode).timerTimeout);
      rooms.set(roomCode, {
        code: roomCode, players: new Map(), phase: 'lobby',
        round: 0, totalRounds: totalRounds || 10, categories,
        pickerIndex: 0, usedLetters: [], submissions: {},
        timerEnd: null, timerTimeout: null, currentLetter: null,
      });
      const room = rooms.get(roomCode);
      room.players.set(clientId, { ...player, ws, connected: true, isHost: true, score: 0 });
      ws.playerId = clientId; ws.roomCode = roomCode;
      console.log(`[+] Room ${roomCode} created by ${player.name}`);
      broadcastRoomState(roomCode);
      break;
    }

    case 'join': {
      const { clientId, roomCode, player } = msg;
      if (!clientId || !roomCode) return;
      if (!rooms.has(roomCode)) { ws.send({ type: 'error', message: 'Room not found.' }); return; }
      const room = rooms.get(roomCode);
      if (room.phase !== 'lobby') { ws.send({ type: 'error', message: 'Game already started.' }); return; }
      room.players.set(clientId, { ...player, ws, connected: true, isHost: false, score: 0 });
      ws.playerId = clientId; ws.roomCode = roomCode;
      console.log(`[+] ${player.name} joined ${roomCode} (${room.players.size} players)`);
      broadcastRoomState(roomCode);
      break;
    }

    case 'start_game': {
      const room = getRoomOf(ws);
      if (!room || !isHost(ws, room)) return;
      if (room.players.size < 2) { ws.send({ type: 'error', message: 'Need 2+ players.' }); return; }
      room.phase = 'letter-select';
      room.round = 1;
      room.pickerIndex = Math.floor(Math.random() * room.players.size);
      room.submissions = {};
      broadcastToRoom(room, {
        type: 'game_start', categories: room.categories, totalRounds: room.totalRounds,
        round: room.round, pickerIndex: room.pickerIndex, playerIds: [...room.players.keys()],
      });
      console.log(`[▶] Game started in ${ws.roomCode}`);
      break;
    }

    case 'pick_letter': {
      const room = getRoomOf(ws);
      if (!room || room.phase !== 'letter-select') return;
      const pids   = [...room.players.keys()];
      const picker = pids[room.pickerIndex % pids.length];
      if (ws.playerId !== picker) return;
      room.currentLetter = msg.letter.toUpperCase();
      room.usedLetters.push(room.currentLetter);
      room.phase = 'playing'; room.submissions = {};
      broadcastToRoom(room, { type: 'letter_selected', letter: room.currentLetter, round: room.round });
      console.log(`[L] "${room.currentLetter}" in ${ws.roomCode}`);
      break;
    }

    case 'submit_answers': {
      const room = getRoomOf(ws);
      if (!room || room.phase !== 'playing' || room.submissions[ws.playerId]) return;
      room.submissions[ws.playerId] = { answers: msg.answers, submittedAt: Date.now() };
      broadcastToRoom(room, { type: 'player_submitted', playerId: ws.playerId });
      const submitted = Object.keys(room.submissions).length;
      if (submitted === 1) {
        const dur = 30000;
        room.timerEnd = Date.now() + dur;
        broadcastToRoom(room, { type: 'timer_start', endTime: room.timerEnd, duration: dur });
        room.timerTimeout = setTimeout(() => resolveRound(room), dur);
      }
      if (submitted >= room.players.size) {
        clearTimeout(room.timerTimeout);
        setTimeout(() => resolveRound(room), 400);
      }
      break;
    }

    case 'next_round': {
      const room = getRoomOf(ws);
      if (!room || !isHost(ws, room)) return;
      const pids = [...room.players.keys()];
      room.pickerIndex = (room.pickerIndex + 1) % pids.length;
      room.round++; room.phase = 'letter-select'; room.submissions = {};
      broadcastToRoom(room, {
        type: 'game_start', categories: room.categories, totalRounds: room.totalRounds,
        round: room.round, pickerIndex: room.pickerIndex, playerIds: pids,
      });
      break;
    }

    case 'play_again': {
      const room = getRoomOf(ws);
      if (!room || !isHost(ws, room)) return;
      room.players.forEach(p => { p.score = 0; });
      room.round = 0; room.phase = 'lobby'; room.usedLetters = []; room.submissions = {};
      clearTimeout(room.timerTimeout);
      broadcastRoomState(ws.roomCode);
      break;
    }
  }
}

function handleDisconnect(ws) {
  if (!ws.playerId || !ws.roomCode) return;
  const room = rooms.get(ws.roomCode);
  if (!room) return;
  const player = room.players.get(ws.playerId);
  if (!player) return;
  console.log(`[-] ${player.name} left ${ws.roomCode}`);
  room.players.delete(ws.playerId);
  if (room.players.size === 0) {
    clearTimeout(room.timerTimeout); rooms.delete(ws.roomCode);
    console.log(`[x] Room ${ws.roomCode} deleted`); return;
  }
  broadcastToRoom(room, { type: 'player_left', playerId: ws.playerId, name: player.name });
  broadcastRoomState(ws.roomCode);
  if (room.phase === 'playing' && room.players.size < 2) {
    clearTimeout(room.timerTimeout);
    setTimeout(() => resolveRound(room), 500);
  }
}

function resolveRound(room) {
  if (room.phase !== 'playing') return;
  room.phase = 'results';
  clearTimeout(room.timerTimeout);
  const pids = [...room.players.keys()];
  const results = {};
  pids.forEach(pid => {
    results[pid] = { scores: {}, total: 0, answers: room.submissions[pid]?.answers || {} };
  });
  room.categories.forEach(cat => {
    const catId = cat.id, amap = {};
    pids.forEach(pid => {
      const a = results[pid].answers[catId] || '';
      if (!a) return;
      const n = norm(a); if (!amap[n]) amap[n] = []; amap[n].push(pid);
    });
    pids.forEach(pid => {
      const a = results[pid].answers[catId] || '';
      if (!a) { results[pid].scores[catId] = 0; return; }
      const n = norm(a);
      const dup   = amap[n]?.length > 1;
      const valid = isValidAnswer(a, catId, room.currentLetter);
      if (!valid || dup) { results[pid].scores[catId] = 0; }
      else { results[pid].scores[catId] = 10; results[pid].total += 10; }
    });
  });
  pids.forEach(pid => { const p = room.players.get(pid); if (p) p.score = (p.score||0) + results[pid].total; });
  const leaderboard = pids.map(pid => {
    const p = room.players.get(pid);
    return { id: pid, name: p?.name, score: p?.score||0, avatar: p?.avatar, avatarColor: p?.avatarColor, roundScore: results[pid].total };
  }).sort((a,b) => b.score - a.score);
  const playersObj = {};
  room.players.forEach((p, id) => { playersObj[id] = { id, name: p.name, score: p.score, avatar: p.avatar, avatarColor: p.avatarColor, isHost: p.isHost }; });
  const isLast = room.round >= room.totalRounds;
  broadcastToRoom(room, { type: isLast ? 'game_over' : 'round_results', round: room.round, letter: room.currentLetter, results, leaderboard, players: playersObj, categories: room.categories });
  console.log(`[✓] Round ${room.round} | ${room.code} | #1: ${leaderboard[0]?.name} ${leaderboard[0]?.score}pts`);
}

// ════════════════════════════════════════════════════════════
//  WORD VALIDATION
// ════════════════════════════════════════════════════════════
let WORD_LISTS = null;

function loadWordLists() {
  try {
    const raw = fs.readFileSync(path.join(PUBLIC, 'wordlists.js'), 'utf8');
    const lists = {};
    for (const cat of ['person','country','flower','fruit']) {
      const m = raw.match(new RegExp(cat + ':\\s*`([^`]+)`\\.split', 's'));
      if (m) lists[cat] = m[1].split(/\s+/).filter(Boolean);
    }
    WORD_LISTS = lists;
    console.log('[✓] Word lists: ' + Object.entries(lists).map(([k,v]) => `${k}:${v.length}`).join(' '));
  } catch(e) { console.warn('[!] wordlists.js not loaded — validation disabled'); }
}

function norm(s) {
  if (!s) return '';
  return s.trim().toLowerCase()
    .replace(/aa/g,'a').replace(/ee/g,'i').replace(/oo/g,'u').replace(/ii/g,'i')
    // Bangla romanization variants: por/pol/bol/kor often written as par/pal/bal/kar
    .replace(/por/g,'par').replace(/pol/g,'pal').replace(/bol/g,'bal')
    // Double consonants: ll→l, nn→n, tt→t, rr→r
    .replace(/ll/g,'l').replace(/nn/g,'n').replace(/tt/g,'t').replace(/rr/g,'r')
    // Bengali ch variants: litchi→lichu, tch→ch, terminal chi/ji→chu/ju
    .replace(/tch/g,'ch').replace(/chi\b/g,'chu').replace(/ji\b/g,'ju')
    .replace(/\s+/g,' ').trim();
}

function isValidAnswer(answer, catId, letter) {
  if (!answer || answer.trim().length < 2) return false;
  const n = norm(answer);
  if (!n.startsWith(letter.toLowerCase())) return false;
  if (!WORD_LISTS || !WORD_LISTS[catId]) return true;
  const ns = n.replace(/\s+/g,'');
  return WORD_LISTS[catId].some(w => { const wn = norm(w); return wn===n || wn.replace(/\s+/g,'')=== ns || wn===ns; });
}

// ════════════════════════════════════════════════════════════
//  HELPERS
// ════════════════════════════════════════════════════════════
function broadcastToRoom(room, obj) {
  const frame = buildFrame(Buffer.from(JSON.stringify(obj), 'utf8'));
  room.players.forEach(p => { if (p.ws?.open && !p.ws.socket.destroyed) { try { p.ws.socket.write(frame); } catch(e){} } });
}

function buildFrame(payload) {
  const len = payload.length;
  let hdr;
  if      (len <= 125)   { hdr = Buffer.from([0x81, len]); }
  else if (len <= 65535) { hdr = Buffer.alloc(4); hdr[0]=0x81; hdr[1]=126; hdr.writeUInt16BE(len,2); }
  else                   { hdr = Buffer.alloc(10); hdr[0]=0x81; hdr[1]=127; hdr.writeBigUInt64BE(BigInt(len),2); }
  return Buffer.concat([hdr, payload]);
}

function broadcastRoomState(code) {
  const room = rooms.get(code); if (!room) return;
  const po = {};
  room.players.forEach((p,id) => { po[id] = { id, name: p.name, score: p.score||0, avatar: p.avatar, avatarColor: p.avatarColor, isHost: p.isHost }; });
  broadcastToRoom(room, { type: 'room_state', players: po, categories: room.categories, totalRounds: room.totalRounds, gamePhase: room.phase });
}

function getRoomOf(ws) { return ws.roomCode ? (rooms.get(ws.roomCode)||null) : null; }
function isHost(ws, room) { return room.players.get(ws.playerId)?.isHost === true; }

function getLocalIP() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces))
    for (const iface of ifaces[name])
      if (iface.family === 'IPv4' && !iface.internal) return iface.address;
  return '127.0.0.1';
}

// ════════════════════════════════════════════════════════════
//  START
// ════════════════════════════════════════════════════════════
loadWordLists();
httpServer.listen(PORT, '0.0.0.0', () => {
  const ip = getLocalIP();
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Nam Desh Ful Fol — নাম দেশ ফুল ফল          ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  Local:   http://localhost:${PORT}              ║`);
  console.log(`║  Network: http://${ip}:${PORT}         ║`);
  console.log('║  Share Network URL with players on WiFi      ║');
  console.log('╚══════════════════════════════════════════════╝\n');
});
process.on('SIGINT',  () => { console.log('\n[!] Shutting down...'); process.exit(0); });
process.on('SIGTERM', () => process.exit(0));
