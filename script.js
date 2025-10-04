const dataFinal = new Date("Oct 13, 2025 11:40:00").getTime(); 

const x = setInterval(function() {
  const agora = new Date().getTime();
  const distancia = dataFinal - agora;

  const dias = Math.floor(distancia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((distancia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((distancia % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((distancia % (1000 * 60)) / 1000);

  document.getElementById("dias").innerText = dias.toString().padStart(2, '0');
  document.getElementById("horas").innerText = horas.toString().padStart(2, '0');
  document.getElementById("minutos").innerText = minutos.toString().padStart(2, '0');
  document.getElementById("segundos").innerText = segundos.toString().padStart(2, '0');

  if (distancia < 0) {
    clearInterval(x);
    document.getElementById("countdown").innerHTML = "Chegou a hora de te ver!";
  }
}, 1000);

var map = L.map('map').setView([-23.49887235841029, -46.43901243464019], 12);

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var heartIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/833/833472.png', 
    iconSize: [24, 24], 
    iconAnchor: [12, 24],
    popupAnchor: [0, -26] 
});

const lugares = [
    {
        lat: -23.498044713589277, 
        lng: -46.44100490765261,
        titulo: "Márcia Maria",
        descricao: "Nosso primeiro date."
    },
    {
        lat: -23.50166664048565,
        lng: -46.43975313464013,
        titulo: "Mc Donald's",
        descricao: "Um lanche nunca foi tão especial."
    },
    {
        lat: -23.501077045195515,
        lng: -46.439966807652475,
        titulo: "Doce preço",
        descricao: "De lei."
    },
    {
        lat: -23.582430419250322,
        lng: -46.47044554813027,
        titulo: "Sesc Itaquera",
        descricao: "O esporte para nós."
    },
    {
        lat: -23.49887235841029,
        lng: -46.43901243464019,
        titulo: "IF",
        descricao: "Nosso lar, muitas memórias."
    },
    {
        lat: -23.494662876241172,
        lng: -46.519742592311225,
        titulo: "Parque ecológico",
        descricao: "Foguetes!!!"
    },
    {
        lat: -23.50331898793386,
        lng: -46.4430093211462,
        titulo: "Ponto da Esfiha",
        descricao: "Coxinha e Bolinho de Queijo"
    },
    {
        lat: -23.508688527094467,
        lng: -46.44423762114588,
        titulo: "Pepe",
        descricao: "Pão do Pepe"
    }
];

lugares.forEach(lugar => {
    let marker = L.marker([lugar.lat, lugar.lng], { icon: heartIcon }).addTo(map);
    marker.bindPopup(`<b>${lugar.titulo}</b><br>${lugar.descricao}`);
});

// -------------------- LÓGICA DO GRAN FINALE --------------------

// Elementos do HTML que vamos manipular
const gerarTicketBtn = document.getElementById('gerarTicketBtn');
const exportarTicketBtn = document.getElementById('exportarTicketBtn');
const ticketContainer = document.getElementById('ticketContainer');
const cooldownMsg = document.getElementById('cooldownMsg');

const ticketNumeroEl = document.getElementById('ticketNumero');
const ticketDataHoraEl = document.getElementById('ticketDataHora');
const ticketDiv = document.getElementById('ticket');

const COOLDOWN_MINUTOS = 15; // 15 minutos de cooldown

// Função para formatar a data e hora
function formatarDataHora(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} às ${horas}:${minutos}`;
}

// Função para iniciar o timer visual de cooldown
function iniciarCooldown(tempoRestante) {
    gerarTicketBtn.disabled = true;

    const intervalo = setInterval(() => {
        const minutos = Math.floor(tempoRestante / (1000 * 60));
        const segundos = Math.floor((tempoRestante % (1000 * 60)) / 1000);

        cooldownMsg.textContent = `Você pode resgatar outro ticket em ${minutos}m ${segundos}s.`;
        tempoRestante -= 1000;

        if (tempoRestante < 0) {
            clearInterval(intervalo);
            cooldownMsg.textContent = '';
            gerarTicketBtn.disabled = false;
            gerarTicketBtn.textContent = 'Resgatar Vale-Chamada!';
        }
    }, 1000);
    
    gerarTicketBtn.textContent = 'Aguarde...';
}

// Função principal que é chamada ao clicar no botão
gerarTicketBtn.addEventListener('click', () => {
    // Pegar o número atual de tickets e a data do último resgate do armazenamento local
    let numeroTicket = parseInt(localStorage.getItem('numeroTicket')) || 0;
    const ultimoResgate = parseInt(localStorage.getItem('ultimoResgate')) || 0;
    const agora = new Date().getTime();

    // Atualizar o número do ticket
    numeroTicket++;
    
    // Atualizar os dados no ticket
    ticketNumeroEl.textContent = String(numeroTicket).padStart(5, '0');
    ticketDataHoraEl.textContent = formatarDataHora(new Date());
    
    // Salvar os novos dados no armazenamento local
    localStorage.setItem('numeroTicket', numeroTicket);
    localStorage.setItem('ultimoResgate', agora);
    
    // Mostrar o ticket e esconder o botão principal
    ticketContainer.style.display = 'flex';
    gerarTicketBtn.style.display = 'none'; // Esconde o botão de gerar
    cooldownMsg.style.display = 'none';   // Esconde a msg de cooldown

    alert('Vale-Chamada resgatado com sucesso! Baixe seu ticket abaixo.');
});

// Lógica para exportar o ticket
exportarTicketBtn.addEventListener('click', () => {
    html2canvas(ticketDiv, {
        backgroundColor: null // Fundo transparente para a captura
    }).then(canvas => {
        // Cria um link temporário para o download
        const link = document.createElement('a');
        link.download = `vale-chamada-${ticketNumeroEl.textContent}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
});


// Função que verifica o estado do cooldown QUANDO A PÁGINA CARREGA
function verificarEstadoInicial() {
    const ultimoResgate = parseInt(localStorage.getItem('ultimoResgate')) || 0;
    const agora = new Date().getTime();
    const tempoPassado = agora - ultimoResgate;
    const tempoDeCooldown = COOLDOWN_MINUTOS * 60 * 1000;

    if (tempoPassado < tempoDeCooldown) {
        // Se ainda está em cooldown, inicia o timer
        const tempoRestante = tempoDeCooldown - tempoPassado;
        iniciarCooldown(tempoRestante);
    } else {
        // Se não está em cooldown, garante que o botão está habilitado
        gerarTicketBtn.disabled = false;
    }
}

// Roda a verificação assim que a página é carregada
document.addEventListener('DOMContentLoaded', verificarEstadoInicial);