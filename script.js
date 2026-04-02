let carrinho = [];


function adicionar(nome, preco) {
    console.log("Adicionando:", nome);
    const itemExistente = carrinho.find(item => item.nome === nome);

    if (itemExistente) {
        itemExistente.quantidade += 1;
    } else {
        carrinho.push({
        nome: produtoAtual.nome,
        quantidade: 1,
        pao: nomePao,
        molho: molho,
        preco: preco
        });
    }

    atualizarCarrinho();
}


function estaAbertoAgora() {

  return true;

  const agora = new Date();
  const dia = agora.getDay(); // 0=domingo, 6=sábado
  const hora = agora.getHours();
  const minuto = agora.getMinutes();


  // 🔥 Domingo - aberto o dia todo
  if (dia === 0) {
    return true;
  }

  // 🔥 Sexta (5) - 15:00 até 17:30
  if (dia === 5) {
    if (
      (hora > 15 && hora < 17) ||
      (hora === 15) ||
      (hora === 17 && minuto <= 30)
    ) {
      return true;
    }
    return false;
  }

  // 🔥 Sábado (6) - 17:40 até 23:00
  if (dia === 6) {
    if (
      hora > 17 ||
      (hora === 17 && minuto >= 40)
    ) {
      return hora < 23;
    }
    return false;
  }

  // 🔥 Segunda a Quinta (1 a 4) - 15:00 até 23:00
  if (dia >= 1 && dia <= 4) {
    if (hora >= 15 && hora < 23) {
      return true;
    }
    return false;
  }

  return false;
}

function atualizarCarrinho(){
    const lista = document.getElementById("carrinho");
    const infoEntrega = document.getElementById("infoEntrega"); // pega o elemento

    lista.innerHTML = "";

    let total = 0;

    carrinho.forEach((item, index) => {

        total += item.preco * item.quantidade;

        lista.innerHTML += `
            <li class="item-carrinho">
                <span>${item.nome}</span>

                <div class="controle">
                    <button onclick="diminuir(${index})">−</button>
                    <span>${item.quantidade}</span>
                    <button onclick="aumentar(${index})">+</button>
                </div>

                <span>R$ ${(item.preco * item.quantidade).toFixed(2)}</span>
            </li>
        `;
    });

    // 🔥 lógica da entrega AQUI dentro
    let localEl = document.getElementById("localEntrega");
    let local = localEl ? localEl.value :"";

    if(local === "setorb"){
      infoEntrega.innerText = "Entrega grátis (Setor B)";
    }else{
      if(total < 50){
          let falta = 50 - total;
          infoEntrega.innerText = `Taxa: R$7,00 | Faltam R$${falta.toFixed(2)} para entrega grátis`;
      }else{
        infoEntrega.innerText = `Entrega grátis`;
      }
    }

    document.getElementById("total").innerText = total.toFixed(2);
    document.getElementById("contador").innerText =
        carrinho.reduce((soma, item) => soma + item.quantidade, 0);
}

function aumentar(index){
    carrinho[index].quantidade += 1;
    atualizarCarrinho();
}

function diminuir(index){
    if (carrinho[index].quantidade > 1){
        carrinho[index].quantidade -= 1;
    } else {
        carrinho.splice(index, 1);
    }
    atualizarCarrinho();
}

function removerItem(index){
    if (carrinho[index].quantidade > 1) {
        carrinho[index].quantidade -= 1;
    } else {
        carrinho.splice(index, 1);
    }

    atualizarCarrinho();
}


function enviarPedido(){

    if(!estaAbertoAgora()){
      alert("Estamos fechados no momento.");
      return;
    }

    if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
}
  
    let agora = new Date().getHours();

    

    let mensagem = "Olá, quero pedir:%0A%0A";

   carrinho.forEach(item => {
    mensagem += `- ${item.quantidade}x ${item.nome} (R$${item.preco})%0A`;

    if(item.pao){
        mensagem += `  Pão: ${item.pao}%0A`;
    }

    if(item.molho){
        mensagem += `  Molho: ${item.molho}%0A`;
    }

    mensagem += `%0A`;

    if(item.opcao){
  mensagem += `  Opção: ${item.opcao}%0A`;
}

if(item.sabores){
  mensagem += `  Sabores: ${item.sabores}%0A`;
}

if(item.frutas){
  mensagem += `  Frutas: ${item.frutas}%0A`;
}

if(item.sabor){
  mensagem += `  Sabor: ${item.sabor}%0A`;
}

});


   let tipoEntrega = document.querySelector('input[name="tipoEntrega"]:checked').value;

  let totalValor = parseFloat(document.getElementById("total").textContent);
  let taxaEntrega = 0;

  if(tipoEntrega === "entrega"){

  let endereco = document.getElementById("endereco").value.trim();
  let numeroCasa = document.getElementById("numeroCasa").value.trim();
  let referencia = document.getElementById("referencia").value.trim();

  if(!endereco || !numeroCasa){
    alert("Preencha o endereço e número!");
    return;
  }

  // 🔥 AQUI entra o código que você mandou
  let local = document.getElementById("localentrega")?.value || "";

  if(local === "setorb"){
    taxaEntrega = 0;
  } else {
    if(totalValor < 50){
      taxaEntrega = 7;
    } else {
      taxaEntrega = 0;
    }
  }
  mensagem += `%0AEntrega:%0A`;
  mensagem += `Endereço: ${endereco}, Nº ${numeroCasa}%0A`;

  if(referencia){
    mensagem += `Referência: ${referencia}%0A`;
  }

  if(taxaEntrega > 0){
    mensagem += `Taxa de entrega: R$${taxaEntrega.toFixed(2)}%0A`;
  } else {
    mensagem += `Entrega: Grátis 🎉%0A`;
  }

} else {
  mensagem += `%0ARetirada na lanchonete%0A`;
}


    let observacao = document.getElementById("observacao").value;

    if(observacao.trim() !== ""){
        mensagem += `%0AObservação:%0A${observacao}%0A`;
    }

    let maionese = document.getElementById("maionese").value;

if(maionese){
  if(maionese == "1"){
    mensagem += `Maionese: 1 sachê (R$1,50)%0A`;
    totalValor += 1.5;
  }

  if(maionese == "2"){
    mensagem += `Maionese: 2 sachês (R$2,50)%0A`;
    totalValor += 2.5;
  }

  if(maionese == "3"){
    mensagem += `Maionese: Kit (R$3,00)%0A`;
    totalValor += 3;
  }
}
    
   let totalFinal = totalValor + taxaEntrega;
    mensagem += `%0ATotal: R$${totalFinal.toFixed(2)}`;

    let numero = "5585998554871";
    window.open(`https://wa.me/${numero}?text=${mensagem}`);
}

document.querySelectorAll('input[name="tipoEntrega"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const tipo = document.querySelector('input[name="tipoEntrega"]:checked').value;

    document.getElementById("dadosEntrega").style.display =
      tipo === "entrega" ? "block" : "none";
  });
});


function verificarHorario(){
  let status = document.getElementById("status");
  let botao = document.getElementById("enviar");

  if(estaAbertoAgora()){
    status.innerHTML = "🟢 Estamos ABERTOS";
    botao.disabled = false;
    botao.classList.remove("fechar");
  } else {
    status.innerHTML = "🔴 Estamos FECHADOS";
    botao.disabled = true;
    botao.classList.add("fechar");
  }
}

function transicao(event) {
    event.preventDefault(); 
    document.body.classList.add("fade-out");

    setTimeout(() => {
        window.location.href = event.target.href;
    }, 500);
}

function filtrar(categoria) {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        if (categoria === "todos") {
            card.style.display = "block";
        } else {
            if (card.dataset.categoria === categoria) {
                card.style.display = "block";
            } else {
                card.style.display = "none";
            }
        }
    });
}

function abrirCarrinho(){
    document.getElementById("popup-carrinho").style.display = "flex";
}

function fecharCarrinho(){
    document.getElementById("popup-carrinho").style.display = "none";
}

const modal = document.getElementById("modalIngredientes");
const textoIngredientes = document.getElementById("textoIngredientes");
const fechar = document.querySelector(".fechar");

document.querySelectorAll(".btn-ingrediente").forEach(botao => {
    botao.addEventListener("click", function() {
        const ingredientes = this.getAttribute("data-ingredientes");
        textoIngredientes.textContent = ingredientes;
        modal.style.display = "flex";
    });
});

document.querySelectorAll("#modalIngredientes .fechar").forEach(btn => {
  btn.addEventListener("click", () => {
    document.getElementById("modalIngredientes").style.display = "none";
  });
});


window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

function abrirPersonalizacao(nome, opcoesPao, opcoesMolho){

  produtoAtual = {
    nome: nome,
    opcoesPao: opcoesPao,
    opcoesMolho: opcoesMolho
  };

  const containerPao = document.getElementById("opcoesPao");
  const selectMolho = document.getElementById("molho");

  containerPao.innerHTML = "";
  selectMolho.innerHTML = "";

  opcoesPao.forEach(op => {
    containerPao.innerHTML += `
      <label>
        <input type="radio" name="pao" 
        value="${op.preco}" 
        data-nome="${op.nome}">
        ${op.nome} - R$ ${op.preco}
      </label><br>
    `;
  });

  opcoesMolho.forEach(m => {
  selectMolho.innerHTML += `
    <option value="${m.preco}" data-nome="${m.nome}">
      ${m.nome} ${m.preco > 0 ? `( +R$${m.preco} )` : ''}
    </option>
  `;
});

  document.getElementById("modalPersonalizar").style.display = "flex";
}

function fecharModal(){
  document.getElementById("modalPersonalizar").style.display = "none";
}




function confirmarPersonalizacao(){

  let paoSelecionado = document.querySelector('input[name="pao"]:checked');

  if(!paoSelecionado){
    alert("Escolha o tipo de pão!");
    return;
  }

  const selectMolho = document.getElementById("molho");

  const precoMolho = parseFloat(selectMolho.value);
  const molhoNome = selectMolho.options[selectMolho.selectedIndex].dataset.nome;

  let preco = parseFloat(paoSelecionado.value) + precoMolho;

  let nomePao = paoSelecionado.dataset.nome.trim();

  let itemExistente = carrinho.find(item =>
    item.nome === produtoAtual.nome &&
    item.pao === nomePao &&
    item.molho === molhoNome
  );

  if(itemExistente){
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome: produtoAtual.nome,
      quantidade: 1,
      pao: nomePao,
      molho: `${molhoNome} (R$${precoMolho.toFixed(2)})`,
      preco: preco
    });
  }

  atualizarCarrinho();
  mostrarToast("Adicionado ao carrinho ✅");
  fecharModal();
}

function adicionarProdutoSimples(nome, preco){

  let itemExistente = carrinho.find(item =>
    item.nome === nome &&
    !item.pao &&
    !item.molho
  );

  if(itemExistente){
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome: nome,
      quantidade: 1,
      preco: preco
    });
  }

  atualizarCarrinho();
  mostrarToast("Adicionado ao carrinho ✅");

}

let vitaminaAtual = null;

function abrirOpcaoVitamina(nome, preco){
  vitaminaAtual = { nome, preco };
  document.getElementById("modalVitaminaSimples").style.display = "flex";
}

function fecharVitaminaSimples(){
  document.getElementById("modalVitaminaSimples").style.display = "none";
}

function confirmarVitaminaSimples(){
  const sabor = document.getElementById("saborVitamina").value;

  if(!sabor){
    alert("Escolha um sabor!");
    return;
  }

  let itemExistente = carrinho.find(item =>
    item.nome === vitaminaAtual.nome &&
    item.sabor === sabor
  );

  if(itemExistente){
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome: vitaminaAtual.nome,
      preco: vitaminaAtual.preco,
      quantidade: 1,
      sabor: sabor
    });
  }

  atualizarCarrinho();
  mostrarToast("Adicionado ao carrinho ✅");

  fecharVitaminaSimples();

  // limpa seleção
  document.getElementById("saborVitamina").value = "";
}




let cuscuzAtual = null;

function abrirOpcaoCuscuz(nome, preco){
  cuscuzAtual = { nome, preco };
  document.getElementById("modalCuscuz").style.display = "flex";
}

function fecharModalCuscuz(){
  document.getElementById("modalCuscuz").style.display = "none";
}

function confirmarCuscuz(){
  const opcaoEl = document.querySelector('input[name="opcCuscuz"]:checked');

  if(!opcaoEl){
    alert("Escolha uma opção!");
    return;
  }

  const opcao = opcaoEl.value.trim();

  // procura item igual (mesmo produto + mesma opção)
  let itemExistente = carrinho.find(item =>
    item.nome === cuscuzAtual.nome &&
    item.opcao === opcao
  );

  if(itemExistente){
    itemExistente.quantidade += 1;
  }else{
    carrinho.push({
      nome: cuscuzAtual.nome,
      preco: cuscuzAtual.preco,
      quantidade: 1,
      opcao: opcao
    });
  }

  atualizarCarrinho();
  mostrarToast("Adicionado ao carrinho ✅");

  fecharModalCuscuz();

  // limpa seleção pro próximo uso
  document.querySelectorAll('input[name="opcCuscuz"]').forEach(r => r.checked = false);
}

let paobolaAtual = null;

function abrirOpcaopaobola(nome, preco){
  paobolaAtualAtual = { nome, preco };
  document.getElementById("modalPaobola").style.display = "flex";
}

function fecharModalPaobola(){
  document.getElementById("modalPaobola").style.display = "none";
}

function abrirCuscuzRecheado(){
  document.getElementById("modalCuscuzRecheado").style.display = "flex";
}

function fecharCuscuzRecheado(){
  document.getElementById("modalCuscuzRecheado").style.display = "none";
}

function confirmarCuscuzRecheado(){
  const s1 = document.getElementById("sabor1").value.trim();
  const s2 = document.getElementById("sabor2").value.trim();
  

  if(!s1 || !s2 ){
    alert("Escolha os 2 sabores!");
    return;
  }

  const sabores = [s1, s2 ].join(", ");
  const nome = "Cuscuz Recheado";
  const preco = 13;

  // Para somar automaticamente quando for o mesmo trio (mesma ordem)
  let itemExistente = carrinho.find(item =>
    item.nome === nome &&
    item.sabores === sabores
  );

  if(itemExistente){
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome: nome,
      preco: preco,
      quantidade: 1,
      sabores: sabores
    });
  }

  atualizarCarrinho();
  mostrarToast("Adicionado ao carrinho ✅");

  fecharCuscuzRecheado();

  // limpar selects
  document.getElementById("sabor1").value = "";
  document.getElementById("sabor2").value = "";
  
}

function atualizarBloqueioSabores() {
  const selects = [
    document.getElementById("sabor1"),
    document.getElementById("sabor2")
    
  ];

  const escolhidos = selects.map(s => s.value).filter(v => v);

  selects.forEach(sel => {
    [...sel.options].forEach(opt => {
      if (!opt.value) return; // ignora "Selecione"
      // desabilita se o sabor já foi escolhido em outro select
      opt.disabled = escolhidos.includes(opt.value) && sel.value !== opt.value;
    });
  });
}

["sabor1","sabor2","sabor3"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", atualizarBloqueioSabores);
});

function abrirVitamina(){
  document.getElementById("modalVitamina").style.display = "flex";
}

function fecharVitamina(){
  document.getElementById("modalVitamina").style.display = "none";
}

function confirmarVitamina(){

  const tamanhoSelecionado = document.querySelector('input[name="tamanhoVitamina"]:checked');

  if(!tamanhoSelecionado){
    alert("Escolha o tamanho!");
    return;
  }

  const tamanho = tamanhoSelecionado.value;
  const preco = Number(tamanhoSelecionado.dataset.preco);

  const frutasSelecionadas = [...document.querySelectorAll('#modalVitamina input[type="checkbox"]:checked')]
    .map(cb => cb.value);

  if(frutasSelecionadas.length === 0){
    alert("Escolha pelo menos uma fruta!");
    return;
  }

  const frutasTexto = frutasSelecionadas.join(", ");

  const nomeFinal = `Vitamina  ${tamanho}ml`;

  let itemExistente = carrinho.find(item =>
    item.nome === nomeFinal &&
    item.frutas === frutasTexto
  );

  if(itemExistente){
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({
      nome: nomeFinal,
      preco: preco,
      quantidade: 1,
      frutas: frutasTexto
    });
  }

  atualizarCarrinho();
  mostrarToast("Adicionado ao carrinho ✅");

  fecharVitamina();

  // limpar seleção
  document.querySelectorAll('input[name="tamanhoVitamina"]').forEach(r => r.checked = false);
  document.querySelectorAll('#modalVitamina input[type="checkbox"]').forEach(c => c.checked = false);
}

function animarCard(botao){
  const card = botao.closest(".card");
  if(!card) return;

  card.classList.remove("added"); // reinicia se clicar rápido
  void card.offsetWidth;          // força reflow
  card.classList.add("added");
}

let toastTimer;

function mostrarToast(texto){
  const t = document.getElementById("toast");
  if(!t) return;

  t.textContent = texto;
  t.classList.add("show");

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 900);
}

function limparCarrinho(){
  if(carrinho.length === 0){
    alert("O carrinho já está vazio!");
    return;
  }

  if(confirm("Tem certeza que deseja limpar o carrinho?")){
    carrinho = [];
    atualizarCarrinho();
  }
}

function pegarPratinhoDoDia() {
    const hoje = new Date().getDay();;

    if (hoje === 2) {
        return `
        <h3>Pratinho - Terça</h3>
        <p>Panqueca - R$10,00</p>
        <small>Acompanha: arroz, purê, batata doce e batata palha</small>
        <button onclick="adicionarProdutoSimples('Pratinho Panqueca', 10)">Adicionar</button>

        <p>Lasanha - R$10,00</p>
        <button onclick="adicionarProdutoSimples('Pratinho Lasanha', 10)">Adicionar</button>
        `;
    }

    if (hoje === 3) {
        return `
        <h3>Pratinho - Quarta</h3>
        <p>Creme de galinha - R$10,00</p>
        <small>Acompanha: arroz, farofa, salada de maionese e batata palha</small>
        <button onclick="adicionarProdutoSimples('Pratinho Creme de Galinha', 10)">Adicionar</button>
        `;
    }

    return `
        <h3>Pratinho</h3>
        <p>Hoje não temos disponível</p>
    `;
}

document.getElementById("pratinhoCard").innerHTML = pegarPratinhoDoDia();


document.querySelectorAll('input[name="tipoEntrega"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const tipo = document.querySelector('input[name="tipoEntrega"]:checked').value;

    if(tipo === "entrega"){
      document.getElementById("dadosEntrega").style.display = "block";
    } else {
      document.getElementById("dadosEntrega").style.display = "none";
    }
  });
});





verificarHorario();
setInterval(verificarHorario, 60000); // verifica a cada 1 minuto