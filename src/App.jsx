import { useState, useEffect } from 'react';
import { produtos } from './data/produtos';

function App() {
  const [carrinho, setCarrinho] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  
  const [dadosCliente, setDadosCliente] = useState({ nome: '', telefone: '', endereco: '' });
  const [historicoPedidos, setHistoricoPedidos] = useState([]);
  const [metodoPagamento, setMetodoPagamento] = useState('');
  const [troco, setTroco] = useState('');

  useEffect(() => {
    const clienteSalvo = localStorage.getItem('@PizzaLanche:cliente');
    const historicoSalvo = localStorage.getItem('@PizzaLanche:historico');
    
    if (clienteSalvo) {
      setDadosCliente(JSON.parse(clienteSalvo));
    }
    if (historicoSalvo) {
      setHistoricoPedidos(JSON.parse(historicoSalvo));
    }
  }, []);

  const adicionarAoCarrinho = (produto) => {
    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find(item => item.id === produto.id);
      if (itemExistente) {
        return carrinhoAtual.map(item => 
          item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      }
      return [...carrinhoAtual, { ...produto, quantidade: 1 }];
    });
  };

  const removerDoCarrinho = (produtoId) => {
    setCarrinho((carrinhoAtual) => {
      const itemExistente = carrinhoAtual.find(item => item.id === produtoId);
      
      if (itemExistente.quantidade === 1) {
        return carrinhoAtual.filter(item => item.id !== produtoId);
      } else {
        return carrinhoAtual.map(item => 
          item.id === produtoId ? { ...item, quantidade: item.quantidade - 1 } : item
        );
      }
    });
  };

  const valorTotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
  const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

  const finalizarPedido = () => {
    if (!dadosCliente.nome || !dadosCliente.telefone || !dadosCliente.endereco) {
      alert("Por favor, preencha todos os seus dados de entrega!");
      return;
    }

    if (!metodoPagamento) {
      alert("Por favor, selecione a forma de pagamento!");
      return;
    }

    const novoPedido = {
      id: Date.now(),
      data: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      itens: carrinho,
      total: valorTotal
    };
    
    const novoHistorico = [novoPedido, ...historicoPedidos];
    
    setHistoricoPedidos(novoHistorico);
    localStorage.setItem('@PizzaLanche:cliente', JSON.stringify(dadosCliente));
    localStorage.setItem('@PizzaLanche:historico', JSON.stringify(novoHistorico));

    let mensagem = `*Novo Pedido - Pizza e Lanche Du Coração* 🍕\n\n`;
    mensagem += `*Cliente:* ${dadosCliente.nome}\n`;
    mensagem += `*Telefone:* ${dadosCliente.telefone}\n`;
    mensagem += `*Endereço:* ${dadosCliente.endereco}\n\n`;
    mensagem += `*Resumo do Pedido:*\n`;

    carrinho.forEach(item => {
      mensagem += `- ${item.quantidade}x ${item.nome} (R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')})\n`;
    });

    mensagem += `\n*Total a pagar:* R$ ${valorTotal.toFixed(2).replace('.', ',')}\n`;
    mensagem += `*Forma de Pagamento:* ${metodoPagamento}`;
    
    if (metodoPagamento === 'Dinheiro' && troco) {
      mensagem += `\n*Troco para:* R$ ${troco}`;
    }

    setCarrinho([]); 
    setIsCheckoutOpen(false);

    const textoCodificado = encodeURIComponent(mensagem);
    const numeroWhatsApp = "5521999999999"; 
    window.open(`https://wa.me/${numeroWhatsApp}?text=${textoCodificado}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 pb-32 relative">
      <div className="max-w-2xl mx-auto">
        
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-red-600 text-center mb-2 drop-shadow-sm">
              Pizza e Lanche Du Coração 🍕
            </h1>
            {dadosCliente.nome ? (
              <p className="text-center text-green-600 font-medium">Bem-vindo de volta, {dadosCliente.nome}! 👋</p>
            ) : (
              <p className="text-center text-gray-500 font-medium">Faça seu pedido abaixo</p>
            )}
          </div>
          
          {historicoPedidos.length > 0 && (
            <button 
              onClick={() => setIsHistoricoOpen(true)}
              className="absolute top-4 right-4 bg-white text-red-600 text-sm font-bold px-3 py-2 rounded-lg shadow border border-red-100 hover:bg-red-50"
            >
              Meus Pedidos
            </button>
          )}
        </div>

        <div className="space-y-4">
          {produtos.map((produto) => {
            const quantidadeNoCarrinho = carrinho.find(item => item.id === produto.id)?.quantidade || 0;

            return (
              <div key={produto.id} className="bg-white p-4 rounded-xl shadow-sm flex gap-4 items-center border border-gray-100 transition-transform hover:scale-[1.01]">
                <div className="text-5xl bg-gray-50 w-20 h-20 flex items-center justify-center rounded-lg flex-shrink-0 border border-gray-100">
                  {produto.imagem}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-800 leading-tight">{produto.nome}</h2>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{produto.descricao}</p>
                  <p className="text-green-600 font-bold mt-2">
                    R$ {produto.preco.toFixed(2).replace('.', ',')}
                  </p>
                </div>
                
                <div className="flex-shrink-0">
                  {quantidadeNoCarrinho > 0 ? (
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full p-1 shadow-inner">
                      <button 
                        onClick={() => removerDoCarrinho(produto.id)}
                        className="bg-white text-red-500 w-8 h-8 flex items-center justify-center rounded-full shadow hover:bg-gray-100 transition-colors font-bold text-lg"
                      >
                        -
                      </button>
                      <span className="font-bold text-gray-800 w-4 text-center">{quantidadeNoCarrinho}</span>
                      <button 
                        onClick={() => adicionarAoCarrinho(produto)}
                        className="bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow hover:bg-red-600 transition-colors font-bold text-lg"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => adicionarAoCarrinho(produto)}
                      className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white w-10 h-10 flex items-center justify-center rounded-full transition-colors shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isCheckoutOpen && carrinho.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">{totalItens} {totalItens === 1 ? 'item' : 'itens'}</p>
              <p className="font-bold text-xl text-gray-800">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
            </div>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold shadow-md hover:bg-red-700 active:bg-red-800 transition-colors"
            >
              Ver Pedido
            </button>
          </div>
        </div>
      )}

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center sm:p-4 transition-opacity overflow-y-auto">
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl p-6 shadow-2xl animate-[slideUp_0.3s_ease-out] my-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Finalizar Pedido</h2>
              <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg mb-4 max-h-32 overflow-y-auto border border-gray-100">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Resumo do Carrinho</h3>
              {carrinho.map(item => (
                <div key={item.id} className="flex justify-between text-sm text-gray-700 mb-1">
                  <span>{item.quantidade}x {item.nome}</span>
                  <span className="font-medium">R$ {(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                  value={dadosCliente.nome}
                  onChange={(e) => setDadosCliente({...dadosCliente, nome: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (WhatsApp)</label>
                <input 
                  type="tel" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                  placeholder="(21) 99999-9999"
                  value={dadosCliente.telefone}
                  onChange={(e) => setDadosCliente({...dadosCliente, telefone: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço de Entrega</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none resize-none"
                  rows="2"
                  value={dadosCliente.endereco}
                  onChange={(e) => setDadosCliente({...dadosCliente, endereco: e.target.value})}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none bg-white"
                  value={metodoPagamento}
                  onChange={(e) => setMetodoPagamento(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  <option value="Pix">Pix</option>
                  <option value="Cartão de Crédito">Cartão de Crédito</option>
                  <option value="Cartão de Débito">Cartão de Débito</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              {metodoPagamento === 'Dinheiro' && (
                <div className="animate-[slideUp_0.2s_ease-out]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Troco para quanto?</label>
                  <input 
                    type="text" 
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                    value={troco}
                    onChange={(e) => setTroco(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 font-medium">Total a pagar:</span>
                <span className="text-2xl font-bold text-gray-900">R$ {valorTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <button 
              onClick={finalizarPedido}
              className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-colors shadow-lg"
            >
              Enviar Pedido no WhatsApp
            </button>
          </div>
        </div>
      )}

      {isHistoricoOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Meus Pedidos Anteriores</h2>
              <button onClick={() => setIsHistoricoOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto pr-2 space-y-4 flex-1">
              {historicoPedidos.map((pedido) => (
                <div key={pedido.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                  <div className="flex justify-between text-sm text-gray-500 mb-2 border-b border-gray-200 pb-2">
                    <span>{pedido.data}</span>
                    <span className="font-bold text-gray-800">R$ {pedido.total.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {pedido.itens.map((item) => (
                      <li key={item.id}>• {item.quantidade}x {item.nome}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App;