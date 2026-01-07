//variavel global
const produtos = [];

//amarzena os valores dos inputs
function amarzenarvalor() {
    const produto = {
        produto:
        document.getElementById('estoque').value,
    estoqueFisico:
    Number(document.getElementById('estoqueFisico').value),
    estoqueVirtual:
    Number(document.getElementById('estoqueVirtual').value),
 vendaTotal:
    Number(document.getElementById('vendaTotal').value),
    tempoRepo:
    Number(document.getElementById('tempoRepo').value),
    totalPedidos :
    Number(document.getElementById('totalDePedidos').value),
     periodo:
    document.getElementById('periodo').value,
          }
          if (!produto.produto || produto.estoqueFisico < 0 || produto.estoqueVirtual < 0 || produto.vendaTotal < 0 || produto.tempoRepo < 0 || produto.totalPedidos <= 0) {
    alert("Por favor, preencha todos os campos corretamente.");
    return; 
  }


          
         produtos.push(produto);
salvarLocalStorage();
  mostrarTabela(); 
     document.getElementById("informacoes").reset();     
  
}

//faaz os calculos e a tabela
function mostrarTabela() {
    

const grafico =
document.getElementById('graficos');
grafico.innerHTML = "";

produtos.forEach( (item, index)=> {
    const produt= item.produto;
    
        const giroDeEstoque =item.vendaTotal/
    (( item.estoqueFisico + item.estoqueVirtual)/2);
    
let faltou = item.totalPedidos - item.vendaTotal;


if (faltou < 0) { faltou = 0; }


const indiceDeRuptura = (faltou /item.totalPedidos) * 100;
let dias;

if (item.periodo === "Dia") {
    dias=1;
}
else if (item.periodo === "mes") {
    dias = 30;
}
else if (item.periodo === "Ano") {
    dias = 365;
}
    const consumoMedio = item.vendaTotal/dias;
    const coberturaDeEstoque=
    ((item.estoqueFisico + item.estoqueVirtual)/consumoMedio);
    

    console.log("Giro de Estoque:", giroDeEstoque.toFixed(0));
console.log("Cobertura de Estoque (dias):", coberturaDeEstoque.toFixed(0));
console.log("Índice de Ruptura (%):", indiceDeRuptura.toFixed(1),"%");

const larguraBarra = Math.min(coberturaDeEstoque, 100);





const barra = document.createElement("div");
barra.classList.add("linha");

const preenchimento = document.createElement("div");
preenchimento.classList.add("preenchimentop");
preenchimento.innerHTML= `
<p>${produt}</p>
<p>${giroDeEstoque.toFixed(1)}</p>
<p>${consumoMedio.toFixed(2)}</p>
<p>${coberturaDeEstoque.toFixed(0)}</p>
<p>${indiceDeRuptura.toFixed(1)}</p>
<button class="excluir" onclick="excluirItem(${index})">Excluir</button>
`;

barra.appendChild(preenchimento);
grafico.appendChild(barra);
});
gerarGraficoGiro();
gerarGraficoConsumo();
gerarGraficoCbertura();
gerarGraficoRuptura();

} 

//botao de Excluir calculo
document.getElementById('apagarTudo').addEventListener("click", () =>{
produtos.length = 0;
salvarLocalStorage();
mostrarTabela();
});

//Excluir o item unico
function excluirItem(index) {
  produtos.splice(index, 1);
  salvarLocalStorage();
  mostrarTabela();
}

//grafico de Giro de Estoque
function gerarGraficoGiro() {
  const canvas = document.getElementById("graficoGiro");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const valores = produtos.map(p =>
    p.vendaTotal / ((p.estoqueFisico + p.estoqueVirtual) / 2)
  );

  const max = Math.max(...valores, 1);
const larguraBarra = 40;
const gap = 20;
 const margem = 30;
canvas.width = margem + produtos.length * (larguraBarra + gap) + 100;
canvas.height = 300;

  valores.forEach((valor, i) => {
    const altura = (valor / max) * 200;
let corTexto;

if (valor >=3) {
    ctx.strokeStyle = "#80ffa2";
    ctx.fillStyle = "rgba(128, 255, 162, 0.3)";
    corTexto = "#080";
} 
else if (valor >=1.6) {
    ctx.strokeStyle = "orange";
    ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
    corTexto = "#e65c00"; 
}
else {
    ctx.strokeStyle = "red";
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    corTexto = "#c00"; 
}
const x = 50 + i * (larguraBarra + gap);
ctx.lineWidth = 2;
ctx.strokeRect(
    x,
  250 - altura,
  larguraBarra,
  altura
    )
ctx.fillRect(
  x,
  250 - altura,
  larguraBarra,
  altura
);
const ytopo = 250 - altura;
ctx.textAlign = "center";
ctx.fillStyle = corTexto;
ctx.fillText(valor.toFixed(0), x + larguraBarra/2, ytopo-5);

ctx.fillStyle = "#fff";
ctx.fillText(produtos[i].produto, x + larguraBarra/2, 270);
  });
}

//grafico de Consumo
function gerarGraficoConsumo() {
    
    const canvas =
    document.getElementById("graficoConsumo");
    const ctx = canvas.getContext("2d");


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const valores = produtos.map(p => {
      
      
 let dias = 1;
    if (p.periodo === "mes") dias = 30;
    else if (p.periodo === "Ano") dias = 365;

    return p.vendaTotal / dias;
    }
);

  const max = Math.max(...valores, 1);

const larguraBarra = 40;
const gap = 20;

const margem = 30;
canvas.width = margem + produtos.length * (larguraBarra + gap) + 100;
canvas.height = 300;
  valores.forEach((valor, i) => {
      const item= produtos[i];
    const altura = (valor / max) * 200;
let corTexto;
  const valortotal=item.estoqueFisico + item.estoqueVirtual;
if (valor > valortotal) {
  ctx.strokeStyle = "red";
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    corTexto = "#c00"; 
} 
else if (valor >=valortotal * 0.5){
      ctx.strokeStyle = "#80ffa2";
    ctx.fillStyle = "rgba(128, 255, 162, 0.3)";
    corTexto = "#080";
}
else {
    ctx.strokeStyle = "orange";
    ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
    corTexto = "#e65c00"; 
}

const x = 50 + i * (larguraBarra + gap);
ctx.lineWidth = 2;
ctx.strokeRect(
    x,
  250 - altura,
  larguraBarra,
  altura
    )
ctx.fillRect(
  x,
  250 - altura,
  larguraBarra,
  altura
);
const ytopo = 250 - altura;
ctx.textAlign = "center";
ctx.fillStyle = corTexto;
ctx.fillText(valor.toFixed(0), x + larguraBarra/2, ytopo-5);

ctx.fillStyle = "#fff";
ctx.fillText(produtos[i].produto, x + larguraBarra/2, 270);


  });
}

//grafico de Cobretura
function gerarGraficoCbertura() {
    const canvas =
    document.getElementById("graficoCobertura");
    const ctx = canvas.getContext("2d");


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const valores = produtos.map(p => {
     
    let dias = 1;
    if (p.periodo === "mes") dias = 30;
    else if (p.periodo === "Ano") dias = 365;
    const consumoMedio = p.vendaTotal/dias;
    if (consumoMedio === 0)return 0;
    
    const coberturaDeEstoque=
    ((p.estoqueFisico + p.estoqueVirtual)/consumoMedio);
    return coberturaDeEstoque;
    
  });
  

  const max = Math.max(...valores, 1);

const larguraBarra = 40;
const gap = 20;

const margem = 30;
canvas.width = margem + produtos.length * (larguraBarra + gap) + 100;
canvas.height = 300;
  valores.forEach((valor, i) => {
      const item=produtos[i];
    const altura = (valor / max) * 200;
    let dias = 1;
  if (item.periodo === "mes") dias = 30;
  else if (item.periodo === "Ano") dias = 365;
    let corTexto;
    const consumoMedio = item.vendaTotal / dias;
const cobertura = (item.estoqueFisico + item.estoqueVirtual) / consumoMedio;

if (cobertura >= item.tempoRepo){
      ctx.strokeStyle = "#80ffa2";
    ctx.fillStyle = "rgba(128, 255, 162, 0.3)";
    corTexto = "#080";
}
else if(cobertura >= item.tempoRepo *0.5){
    ctx.strokeStyle = "orange";
    ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
    corTexto = "#e65c00"; 
}
else {
  ctx.strokeStyle = "red";
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    corTexto = "#c00"; 
} 




const x = 50 + i * (larguraBarra + gap);
ctx.lineWidth = 2;
ctx.strokeRect(x, 250 - altura, larguraBarra, altura);
ctx.fillRect(
  x,
  250 - altura,
  larguraBarra,
  altura
);
const ytopo = 250 - altura;
ctx.textAlign = "center";
ctx.fillStyle = corTexto;
ctx.fillText(valor.toFixed(0), x + larguraBarra/2, ytopo-5);

ctx.fillStyle = "#fff";
ctx.fillText(produtos[i].produto, x+ larguraBarra/2, 270);


  });
}

//grafico de Ruptura
function gerarGraficoRuptura() {
  const canvas = document.getElementById("graficoRuptura");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const valores = produtos.map(p => {
      
 let faltou = p.totalPedidos - p.vendaTotal;
    if (faltou < 0) faltou = 0;
    return (faltou / p.totalPedidos) * 100;    });

  const max = 100;
const larguraBarra = 40;
const gap = 20;
 const margem = 30;
canvas.width = margem + produtos.length * (larguraBarra + gap) + 100;
canvas.height = 300;

// 2. Desenha a escala lateral
ctx.fillStyle = "#fff";
ctx.textAlign = "right";
for (let i = 0; i <= 5; i++) { // 0%, 20%, 40%, 60%, 80%, 100%
    const y = 250 - (i / 5) * 200;
    ctx.fillText((i * 20) + "%", 40, y + 5);
// +5 pra alinhar verticalmente
    ctx.strokeStyle = "#555";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(45, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
}

  valores.forEach((valor, i) => {
    const altura = (valor / max) * 200;
let corTexto;

if (valor <=10) {
    ctx.strokeStyle = "#80ffa2";
    ctx.fillStyle = "rgba(128, 255, 162, 0.3)";
    corTexto = "#080";
} 
else if (valor <=30) {
    ctx.strokeStyle = "orange";
    ctx.fillStyle = "rgba(255, 165, 0, 0.3)";
    corTexto = "#e65c00"; 
}
else {
    ctx.strokeStyle = "red";
    ctx.fillStyle = "rgba(255, 0, 0, 0.3)";
    corTexto = "#c00"; 
}
const x = 50 + i * (larguraBarra + gap);
ctx.lineWidth = 2;
ctx.strokeRect(
    x,
  250 - altura,
  larguraBarra,
  altura
    )
ctx.fillRect(
  x,
  250 - altura,
  larguraBarra,
  altura
);
const ytopo = 250 - altura;
ctx.textAlign = "center";
ctx.fillStyle = corTexto;
ctx.fillText(valor.toFixed(0)+ "%", x + larguraBarra/2, ytopo-5);

ctx.fillStyle = "#fff";
ctx.fillText(produtos[i].produto, x + larguraBarra/2, 270);
  });
}

// salvar alterações no navegador
function salvarLocalStorage() {
    localStorage.setItem("produtos", JSON.stringify(produtos));
}

//carrega os dados no navegador
function carregarDados() {
    const dados =
    localStorage.getItem("produtos");
    if (dados) {
        produtos.length=0;
        produtos.push(...JSON.parse(dados));
        mostrarTabela();
    }
}
window.addEventListener("load", carregarDados);