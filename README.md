# 🌱 EcoTrack-IA

Sistema Inteligente de Monitoramento e Otimização de Coleta de Resíduos Urbanos.

O **EcoTrack-IA** é uma solução de Smart City que integra IoT, Mobile e Web para monitoramento em tempo real do nível de resíduos em lixeiras públicas, permitindo priorização inteligente de rotas de coleta e maior eficiência operacional.

---

## 🚀 Objetivo do Projeto

O projeto visa:

- Monitorar o nível de ocupação das lixeiras utilizando sensores ultrassônicos conectados a microcontroladores (ESP32)
- Enviar os dados para um backend central
- Classificar automaticamente a prioridade de coleta
- Disponibilizar as informações para agentes de coleta via aplicativo mobile
- Permitir visualização estratégica para gestores públicos via painel web

---

## 🧠 Como Funciona

1. 📡 Sensores ultrassônicos medem o nível de resíduos na lixeira.
2. 🔌 O ESP32 envia os dados via Wi-Fi para a API.
3. 🧮 O backend classifica a prioridade (Alta, Média ou Baixa).
4. 📱 O aplicativo mobile exibe as lixeiras ordenadas por prioridade.
5. 🖥️ O painel web permite monitoramento e gestão estratégica.

---

## 📱 Aplicativo Mobile (Expo + React Native)

Voltado para o **Agente de Coleta**.

### Funcionalidades atuais (MVP):

- Login
- Dashboard com resumo de prioridades
- Lista de lixeiras ordenadas por nível de ocupação
- Classificação automática:
  - 🔴 Alta (>80%)
  - 🟡 Média (50–79%)
  - 🟢 Baixa (<50%)
- Logout

### Tecnologias utilizadas:

- Expo
- React Native
- Expo Router
- TypeScript

---

## 🖥️ Frontend Web (Em desenvolvimento)

Voltado para a **Prefeitura / Administração Pública**.

Planejado:

- Dashboard com métricas gerais
- Visualização em mapa
- Filtros por bairro
- Relatórios e exportações
- Monitoramento em tempo real

---

## 🔧 Backend (Em desenvolvimento)

Responsável por:

- Receber dados dos dispositivos IoT
- Processar e classificar prioridade
- Disponibilizar API REST para Mobile e Web
- Armazenar histórico de medições

---

## 📡 Protótipo IoT

Hardware utilizado:

- ESP32
- Sensor Ultrassônico
- Comunicação Wi-Fi

Função:

- Medir distância até o topo do resíduo
- Calcular percentual de ocupação
- Enviar dados periodicamente para o servidor

---

## 🏗️ Arquitetura do Sistema

IoT (ESP32 + Sensor)
        ↓
Backend (API REST)
        ↓
Mobile (Agente de Coleta)
        ↓
Web (Administração Pública)

---

## 🎯 Status Atual

✅ Estrutura base do aplicativo mobile implementada  
✅ Navegação com Expo Router configurada  
✅ Lista de lixeiras com priorização automática  
🔄 Backend em desenvolvimento  
🔄 Protótipo IoT em desenvolvimento  
🔄 Painel Web em planejamento  

---

## 🌍 Impacto Esperado

- Redução de custos operacionais
- Otimização de rotas de coleta
- Diminuição de resíduos acumulados
- Melhor aproveitamento da equipe de coleta
- Base tecnológica para cidades inteligentes

---

## 👨‍💻 Equipe

Projeto desenvolvido no curso de **Desenvolvimento Web** do **IFSULDEMINAS** para participação em evento acadêmico / edital de Trilha Nacional de Pré-Incubação Brasil Inovador.

- **Juan Andrade (Líder)** — Frontend / Mobile / Backend  
- **Mauricio Ferreira da Silva** — Protótipo IoT  
- **Nelson de Oliveira Sousa** — Backend / Testes / Supervisão  
- **Roberto Nunes Duarte** — Tutor / Professor  

---

## 📌 Próximos Passos

- Integração do aplicativo mobile com API real
- Implementação de mapa com localização das lixeiras
- Desenvolvimento do painel web administrativo
- Testes integrados com o protótipo físico
- Implementação de geração automática de relatórios

---

## � Uso com Docker

O backend e o frontend podem ser executados em containers para facilitar desenvolvimento e implantação.

### Preparação
1. Certifique‑se de ter [Docker](https://www.docker.com/) e `docker compose` instalados.
2. Ajuste variáveis de ambiente no `docker-compose.yml` conforme necessário (ex.: `DATABASE_URL`, `REACT_APP_API_URL`).

### Comandos úteis
```bash
# construir imagens (rebuild quando alterar código ou dependências)
docker compose build

# subir serviços em primeiro plano (logs são exibidos)
docker compose up

# subir em segundo plano (detached)
docker compose up -d

# visualizar logs do backend
docker compose logs backend --follow --tail 200

# parar e remover contêineres
docker compose down
```

O backend ficará disponível em `http://localhost:5000` e o app Expo/React Native em `http://localhost:8081` (ou porta especificada).

Se preferir, você pode entrar no container para executar comandos Python ou inspecionar arquivos:
```bash
docker exec -it ecotrack-back /bin/sh
```

---

## �📄 Licença

Projeto acadêmico desenvolvido para fins educacionais e de inovação tecnológica.
