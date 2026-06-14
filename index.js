const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const pino = require('pino');
const config = require('./config');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('session');

    const sock = makeWASocket({
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const text = m.message.conversation || m.message.extendedTextMessage?.text || '';
        const from = m.key.remoteJid;
        const lowerText = text.toLowerCase();

        // Command!menu
        if (text === '!menu') {
            await sock.sendMessage(from, {
                text: `🎌 *BOTANIME MENU*\n\n!menu - Liat menu\n!waifu - Random waifu\n!loli - Random loli\n!nekopoi - Info nekopoi\nBot auto reply aktif`
            });
        }

        if (text === '!waifu') {
            await sock.sendMessage(from, {
                text: `🎌 Waifu kamu hari ini: Rem - Re:Zero\nMoe~ kan Senpai?`
            });
        }

        // ===== FITUR AUTO REPLY =====
        // Bot bales otomatis tanpa prefix!
        if (lowerText.includes('halo bot') || lowerText === 'p') {
            await sock.sendMessage(from, {
                text: `Halo juga Senpai! Ada yang bisa BotAnime bantu? 🎌`
            });
        }

        if (lowerText.includes('p', 'woi', 'nimbrung oi', 'sepi bngt', 'info tmnin call', 'ramein dong', 'sleepcall yok')) {
            await sock.sendMessage(from, {
                text: `Balasan bot nya di sini`
            });
        }
      
        if (lowerText.includes('anime apa') || lowerText.includes('rekomendasi')) {
            await sock.sendMessage(from, {
                text: `Coba nonton *Steins;Gate* Senpai. Sci-fi + romance, dijamin nangis 🥲`
            });
        }

        if (lowerText.includes('waifu terbaik')) {
            await sock.sendMessage(from, {
                text: `Jelas Rem dong! Aqua cuma beban 😤`
            });
        }

        if (lowerText.includes('makasih') || lowerText.includes('thanks')) {
            await sock.sendMessage(from, {
                text: `Sama-sama Senpai~ Mwehe 🎌`
            });
        }
    });

    sock.ev.on('connection.update', (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('🎌 Bot Online! Auto Reply Aktif');
        }
    });
}

startBot();
