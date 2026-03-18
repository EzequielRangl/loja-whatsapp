# 🍕 Loja WhatsApp - Delivery App

![Status do Projeto](https://img.shields.io/badge/Status-Finalizado-green)
![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

Um aplicativo web moderno e *mobile-first* criado para facilitar o processo de pedidos de delivery. O cliente monta o carrinho, preenche os dados de entrega e o aplicativo gera uma mensagem formatada, enviando o pedido completo diretamente para o WhatsApp do lojista.

🔗 **[Acesse o projeto rodando ao vivo aqui](COLOQUE_AQUI_SEU_LINK_DA_VERCEL)**

---

## 🚀 Funcionalidades Principais

* **Vitrine Dinâmica:** Listagem de produtos lidos a partir de uma estrutura de dados, facilitando a manutenção do cardápio.
* **Carrinho de Compras:** Lógica de estado (`useState`) para adicionar itens, somar quantidades e calcular o valor total em tempo real.
* **Integração com WhatsApp:** Utilização de `encodeURIComponent` para formatar o resumo do pedido e redirecionar para a API do WhatsApp.
* **Renderização Condicional:** O campo de "Troco" surge dinamicamente apenas se o cliente selecionar a opção de pagamento em "Dinheiro".
* **Persistência de Dados (LocalStorage):** O app possui "memória". O nome, telefone e endereço do cliente ficam salvos no navegador para os próximos pedidos, junto com um histórico de compras anteriores.
* **Design Responsivo:** Interface construída com Tailwind CSS, otimizada para a melhor experiência em smartphones.

---

## 💻 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **[React](https://react.dev/):** Biblioteca JavaScript para construção da interface de usuário baseada em componentes.
* **[Vite](https://vitejs.dev/):** Ferramenta de build super rápida e servidor de desenvolvimento.
* **[Tailwind CSS (v4)](https://tailwindcss.com/):** Framework CSS utility-first para estilização rápida e responsiva.
* **JavaScript (ES6+):** Lógica de negócios, manipulação de arrays (`map`, `reduce`, `find`) e gerenciamento de LocalStorage.

---

## 🛠️ Como rodar o projeto localmente

Siga os passos abaixo para rodar o projeto na sua máquina:

1. Clone este repositório:
   ```bash
   git clone [https://github.com/SEU_USUARIO/loja-whatsapp.git](https://github.com/SEU_USUARIO/loja-whatsapp.git)