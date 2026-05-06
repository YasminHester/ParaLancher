document.addEventListener('DOMContentLoaded', function() {
    console.log('Site Pará Lancher carregado');

    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    
    const iconeCarrinho = document.getElementById('iconeCarrinho');
    const contadorCarrinho = document.querySelector('.contador-carrinho');
    const modalCarrinho = document.getElementById('modalCarrinho');
    const botaoFecharCarrinho = document.getElementById('botaoFecharCarrinho');
    const itensCarrinho = document.getElementById('itensCarrinho');
    const totalCarrinho = document.getElementById('totalCarrinho');
    const valorTotal = document.getElementById('valorTotal');
    const botaoFinalizarPedido = document.getElementById('botaoFinalizarPedido');
    const isLandingPage = document.querySelector('.secao-principal') !== null;
    const isCardapioPage = document.querySelector('.titulo-cardapio') !== null;
    const isSobrePage = document.querySelector('.titulo-sobre') !== null;
    const isHistoriaPage = document.querySelector('.titulo-historia') !== null;
    
    // atualizar contador do carrinho
    function atualizarContadorCarrinho() {
        const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
        if (contadorCarrinho) {
            contadorCarrinho.textContent = totalItens;
        }
    }
    
    // abrir carrinho
    function abrirCarrinho() {
        if (modalCarrinho) {
            modalCarrinho.style.display = 'flex';
            setTimeout(() => {
                modalCarrinho.classList.add('ativo');
            }, 10);
            document.body.style.overflow = 'hidden';
            atualizarCarrinho();
        }
    }
    
    // fechar carrinho
    function fecharCarrinho() {
        if (modalCarrinho) {
            modalCarrinho.classList.remove('ativo');
            setTimeout(() => {
                modalCarrinho.style.display = 'none';
            }, 300);
            document.body.style.overflow = 'auto';
        }
    }
    
    // atualizar visualização do carrinho
    function atualizarCarrinho() {
        if (!itensCarrinho || !totalCarrinho || !valorTotal || !botaoFinalizarPedido) {
            console.error('Elementos do carrinho não encontrados!');
            return;
        }
        
        if (carrinho.length === 0) {
            itensCarrinho.innerHTML = `
                <div class="carrinho-vazio">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Seu carrinho está vazio</p>
                </div>
            `;
            totalCarrinho.style.display = 'none';
            botaoFinalizarPedido.style.display = 'none';
            return;
        }
        
        let html = '';
        let total = 0;
        
        carrinho.forEach((item, indice) => {
            const itemTotal = item.preco * item.quantidade;
            total += itemTotal;
            
            html += `
                <div class="item-carrinho">
                    <div class="info-item-carrinho">
                        <h4>${item.nome}</h4>
                        <div class="preco-item-carrinho">R$ ${item.preco.toFixed(2)}</div>
                    </div>
                    <div class="acoes-item-carrinho">
                        <button class="botao-acao-carrinho diminuir-quantidade" data-indice="${indice}">-</button>
                        <span class="quantidade-item-carrinho">${item.quantidade}</span>
                        <button class="botao-acao-carrinho aumentar-quantidade" data-indice="${indice}">+</button>
                        <button class="botao-acao-carrinho botao-remover-item remover-item" data-indice="${indice}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });
        
        itensCarrinho.innerHTML = html;
        valorTotal.textContent = total.toFixed(2).replace('.', ',');
        totalCarrinho.style.display = 'flex';
        botaoFinalizarPedido.style.display = 'block';
        
        // adicionar eventos aos botões do carrinho
        adicionarEventosCarrinho();
    }
    
    // adicionar eventos aos botões do carrinho
    function adicionarEventosCarrinho() {
        document.querySelectorAll('.diminuir-quantidade').forEach(botao => {
            botao.addEventListener('click', function() {
                const indice = parseInt(this.getAttribute('data-indice'));
                alterarQuantidadeItem(indice, -1);
            });
        });
        
        document.querySelectorAll('.aumentar-quantidade').forEach(botao => {
            botao.addEventListener('click', function() {
                const indice = parseInt(this.getAttribute('data-indice'));
                alterarQuantidadeItem(indice, 1);
            });
        });
        
        document.querySelectorAll('.remover-item').forEach(botao => {
            botao.addEventListener('click', function() {
                const indice = parseInt(this.getAttribute('data-indice'));
                removerItem(indice);
            });
        });
    }
    
    // funções auxiliares do carrinho
    function alterarQuantidadeItem(indice, mudanca) {
        if (carrinho[indice].quantidade + mudanca > 0) {
            carrinho[indice].quantidade += mudanca;
        } else {
            carrinho.splice(indice, 1);
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();
        atualizarCarrinho();
    }
    
    function removerItem(indice) {
        carrinho.splice(indice, 1);
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        atualizarContadorCarrinho();
        atualizarCarrinho();
    }
    
    // adicionar item ao carrinho
    function adicionarAoCarrinho(itemNome, itemPreco, quantidade = 1) {
        // verificar se item já existe no carrinho
        const itemExistente = carrinho.find(item => item.nome === itemNome);
        
        if (itemExistente) {
            itemExistente.quantidade += quantidade;
        } else {
            carrinho.push({
                nome: itemNome,
                preco: itemPreco,
                quantidade: quantidade
            });
        }
        
        // atualizar localStorage
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        
        // atualizar contador
        atualizarContadorCarrinho();
        
        return true;
    }
    
    // feedback visual para adição
    function mostrarFeedbackAdicao(botao) {
        const originalHTML = botao.innerHTML;
        const originalBG = botao.style.backgroundColor;
        
        botao.innerHTML = '<i class="fas fa-check"></i> Adicionado!';
        botao.style.backgroundColor = '#2e8b57';
        botao.style.animation = 'adicionado 0.3s ease';
        
        setTimeout(() => {
            botao.innerHTML = originalHTML;
            botao.style.backgroundColor = originalBG;
            botao.style.animation = '';
        }, 1000);
    }

    if (isLandingPage) {
        console.log('Configurando funcionalidades da Landing Page');

        const botaoMenuMovel = document.querySelector('.botao-menu-movel');
        const navegacao = document.querySelector('.navegacao');
        
        if (botaoMenuMovel && navegacao) {
            botaoMenuMovel.addEventListener('click', function() {
                navegacao.classList.toggle('ativo');
            });
            
            // fechar menu ao clicar em link
            document.querySelectorAll('.navegacao a').forEach(link => {
                link.addEventListener('click', () => {
                    navegacao.classList.remove('ativo');
                });
            });
        }
        
        document.querySelectorAll('.botao-pergunta-frequente').forEach(botao => {
            botao.addEventListener('click', function() {
                const item = this.parentElement;
                item.classList.toggle('ativo');
            });
        });
        
        // adicionar itens ao carrinho
        document.querySelectorAll('.botao-adicionar-carrinho').forEach(botao => {
            botao.addEventListener('click', function() {
                const itemNome = this.getAttribute('data-item');
                const itemPreco = parseFloat(this.getAttribute('data-preco'));
                
                console.log('Adicionando item da landing page:', itemNome, itemPreco);
                
                adicionarAoCarrinho(itemNome, itemPreco, 1);
                mostrarFeedbackAdicao(this);
            });
        });
    }
    
    if (isCardapioPage) {
        console.log('Configurando funcionalidades da Página do Cardápio');
        
        document.querySelectorAll('.controle-quantidade').forEach(controle => {
            const botaoDiminuir = controle.querySelector('.diminuir');
            const botaoAumentar = controle.querySelector('.aumentar');
            const quantidade = controle.querySelector('.quantidade-atual');
            
            if (botaoDiminuir && quantidade) {
                botaoDiminuir.addEventListener('click', function() {
                    let valor = parseInt(quantidade.textContent);
                    if (valor > 1) {
                        quantidade.textContent = valor - 1;
                    }
                });
            }
            
            if (botaoAumentar && quantidade) {
                botaoAumentar.addEventListener('click', function() {
                    let valor = parseInt(quantidade.textContent);
                    quantidade.textContent = valor + 1;
                });
            }
        });
        
        document.querySelectorAll('.botao-adicionar-direto').forEach(botao => {
            botao.addEventListener('click', function() {
                const itemNome = this.getAttribute('data-item');
                const itemPreco = parseFloat(this.getAttribute('data-preco'));
                const quantidade = parseInt(this.closest('.controles-item').querySelector('.quantidade-atual').textContent);
                
                console.log('Adicionando item do cardápio:', itemNome, itemPreco, 'Quantidade:', quantidade);
                
                adicionarAoCarrinho(itemNome, itemPreco, quantidade);
                mostrarFeedbackAdicao(this);
                
                // reseta quantidade
                const quantidadeElement = this.closest('.controles-item').querySelector('.quantidade-atual');
                if (quantidadeElement) {
                    quantidadeElement.textContent = '1';
                }
            });
        });
    }
    
    if (isHistoriaPage) {
        console.log('Configurando funcionalidades da Página História dos Pratos');
        
        const botoesPratos = document.querySelectorAll('.botao-prato');
        const secoesPratos = document.querySelectorAll('.secao-prato');
        
        if (botoesPratos.length > 0) {
            botoesPratos.forEach(botao => {
                botao.addEventListener('click', function() {
                    // reemove classe ativo de todos os botões
                    botoesPratos.forEach(b => b.classList.remove('ativo'));
                    // adiciona classe ativo ao botão clicado
                    this.classList.add('ativo');
                    
                    const pratoId = this.getAttribute('data-prato');
                    
                    // esconde todas as seções
                    secoesPratos.forEach(secao => {
                        secao.classList.remove('ativo');
                    });
                    
                    // mostra a seção correspondente
                    const secaoAtiva = document.getElementById(pratoId);
                    if (secaoAtiva) {
                        secaoAtiva.classList.add('ativo');
                        
                        // rolagem suave para o topo da seção
                        secaoAtiva.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        }
        
        document.querySelectorAll('.imagem-prato img').forEach(img => {
            img.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.05)';
            });
            
            img.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animado');
                }
            });
        }, observerOptions);
        
        // observar elementos para animação
        document.querySelectorAll('.secao-prato, .valor-item, .cartao-pilar').forEach(el => {
            observer.observe(el);
        });
    }

    if (iconeCarrinho) {
        iconeCarrinho.addEventListener('click', abrirCarrinho);
        console.log('Ícone do carrinho configurado');
    } else {
        console.log('Ícone do carrinho não encontrado nesta página');
    }
    
    if (botaoFecharCarrinho) {
        botaoFecharCarrinho.addEventListener('click', fecharCarrinho);
    }
    
    // Fechar modal ao clicar fora
    if (modalCarrinho) {
        modalCarrinho.addEventListener('click', function(e) {
            if (e.target === modalCarrinho) {
                fecharCarrinho();
            }
        });
    }
    
    if (botaoFinalizarPedido) {
        botaoFinalizarPedido.addEventListener('click', function() {
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            
            // montar mensagem do pedido
            let mensagem = 'Olá! Gostaria de fazer um pedido:\n\n';
            let total = 0;
            
            carrinho.forEach(item => {
                const itemTotal = item.preco * item.quantidade;
                mensagem += `• ${item.quantidade}x ${item.nome} - R$ ${itemTotal.toFixed(2)}\n`;
                total += itemTotal;
            });
            
            mensagem += `\nTotal: R$ ${total.toFixed(2)}`;
            mensagem += `\n\nNome: \nEndereço: \nTelefone: \nForma de pagamento: `;
            
            // codificar a mensagem para URL
            const mensagemCodificada = encodeURIComponent(mensagem);
            
            // abrir WhatsApp
            const numeroWhatsApp = '5567992061385';
            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`, '_blank');
            
            // limpar carrinho após pedido
            carrinho = [];
            localStorage.removeItem('carrinho');
            atualizarContadorCarrinho();
            atualizarCarrinho();
            fecharCarrinho();
        });
    }
    
    const botaoWhatsAppFlutuante = document.createElement('a');
    botaoWhatsAppFlutuante.href = 'https://wa.me/5567992061385';
    botaoWhatsAppFlutuante.target = '_blank';
    botaoWhatsAppFlutuante.className = 'botao-whatsapp-flutuante';
    botaoWhatsAppFlutuante.innerHTML = '<i class="fab fa-whatsapp"></i>';
    botaoWhatsAppFlutuante.title = 'Pedir no WhatsApp';
    document.body.appendChild(botaoWhatsAppFlutuante);
    
    function verificarAnimacao() {
        const elementos = document.querySelectorAll('.aparecer');
        
        elementos.forEach(elemento => {
            const elementoTopo = elemento.getBoundingClientRect().top;
            const alturaJanela = window.innerHeight;
            
            if (elementoTopo < alturaJanela - 100) {
                elemento.classList.add('visivel');
            }
        });
    }
    
    // inicializar animações apenas se houver elementos com classe 'aparecer'
    if (document.querySelectorAll('.aparecer').length > 0) {
        window.addEventListener('scroll', verificarAnimacao);
        verificarAnimacao();
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // só aplica scroll suave para links internos que não são botões de categoria/prato
            if (href !== '#' && !this.classList.contains('botao-categoria') && !this.classList.contains('botao-prato')) {
                e.preventDefault();
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    atualizarContadorCarrinho();
    
});