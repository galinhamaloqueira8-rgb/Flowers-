const { Client, GatewayIntentBits } = require("discord.js");
const http = require("http");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const TOKEN = process.env.DISCORD_TOKEN;
const INTERVALO = 30 * 60 * 1000;

const perguntas = [
  "🌹 Qual é o seu YouTuber favorito?",
  "🎮 Qual é o seu jogo favorito?",
  "🎵 Qual música você mais gosta?",
  "🍕 Qual é a sua comida favorita?",
  "🎬 Qual é o seu filme favorito?",
  "📺 Qual é a sua série favorita?",
  "🐶 Você prefere cachorro ou gato?",
  "✈️ Se pudesse viajar para qualquer lugar, para onde iria?",
  "💜 Qual é a sua cor favorita?",
  "☀️ Você prefere dia ou noite?",
  "🍫 Qual é o seu chocolate favorito?",
  "🎤 Qual cantor ou cantora você mais gosta?",
  "⚽ Qual é o seu esporte favorito?",
  "🌸 Qual é a sua flor favorita?",
  "😂 Qual foi a coisa mais engraçada que aconteceu com você recentemente?",
  "📱 Qual aplicativo você mais usa?",
  "🍔 Hambúrguer ou pizza?",
  "🌊 Praia ou piscina?",
  "🎨 Se pudesse aprender uma habilidade nova, qual seria?",
  "🦸 Qual super-herói você escolheria para ser?",
  "💰 Se ganhasse R$ 1 milhão, o que faria primeiro?",
  "🎁 Qual presente você gostaria de ganhar?",
  "👀 Qual foi o último vídeo que você assistiu?",
  "🎧 Você prefere música calma ou agitada?",
  "📚 Qual livro você recomenda?",
  "🍦 Qual é o seu sabor de sorvete favorito?",
  "🐾 Qual animal você gostaria de ter?",
  "🔥 Qual assunto você consegue conversar por horas?",
  "🌈 Qual emoji você mais usa?",
  "🎮 PC, celular ou console?",
  "☕ Café, chocolate quente ou refrigerante?",
  "🏆 Qual conquista sua te deixa orgulhoso?",
  "💭 Qual sonho você gostaria de realizar?",
  "🎥 Qual canal do YouTube você recomenda?",
  "🌎 Qual país você gostaria de conhecer?",
  "🎄 Natal ou Ano Novo?",
  "💡 Qual foi a melhor dica que alguém já te deu?"
];

const estados = new Map();

function iniciar(guildId) {
  const estado = estados.get(guildId);
  if (!estado) return;
  clearTimeout(estado.timer);

  const verificar = async () => {
    const atual = estados.get(guildId);
    if (!atual) return;

    if (Date.now() - atual.ultimaMensagem >= INTERVALO) {
      try {
        const canal = await client.channels.fetch(atual.channelId);
        if (canal && canal.isTextBased()) {
          const pergunta = perguntas[Math.floor(Math.random() * perguntas.length)];
          await canal.send(`🌹 **OII, GENTEEE!** Vamos reviver esse chat? 👀💬\n\n${pergunta}`);
          atual.ultimaMensagem = Date.now();
        }
      } catch (e) {
        console.error("Erro:", e.message);
      }
    }
    atual.timer = setTimeout(verificar, INTERVALO);
  };

  estado.timer = setTimeout(verificar, INTERVALO);
}

client.once("ready", () => {
  console.log(`🌹 Flowers online como ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot || !message.guild) return;

  let estado = estados.get(message.guild.id);
  if (!estado) {
    estado = { channelId: message.channel.id, ultimaMensagem: Date.now(), timer: null };
    estados.set(message.guild.id, estado);
    iniciar(message.guild.id);
  } else {
    estado.channelId = message.channel.id;
    estado.ultimaMensagem = Date.now();
  }
});

client.login(TOKEN);

const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
  res.end("🌹 Flowers está online!");
}).listen(port);
