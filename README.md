# Convite de Casamento

Estrutura inicial de um site de convite de casamento usando Node.js, CSS e Supabase.

## Páginas
- `/` ou `/home` — Home
- `/banner` — Banner
- `/info` — Informações
- `/mapa` — Mapa
- `/presenca` — Presença / RSVP

## Como rodar
1. Instale dependências:
   ```bash
   npm install
   ```
2. Crie um arquivo `.env` com as variáveis:
   ```env
   SUPABASE_URL=your-supabase-url
   SUPABASE_KEY=your-supabase-key
   ```
3. Inicie o servidor:
   ```bash
   npm start
   ```

## Estrutura
- `server.js` — servidor Express
- `src/supabaseClient.js` — configuração do Supabase
- `pages/` — páginas HTML
- `public/css/styles.css` — estilos globais
- `public/js/app.js` — script de RSVP

## Supabase esperada
- `guests` — armazena convidados
  - `id` (uuid)
  - `name` (texto)
  - `email` (texto)
  - `attending` (booleano)
- `companions` — armazena acompanhantes vinculados ao convidado
  - `id` (uuid)
  - `guest_id` (foreign key para `guests.id`)
  - `name` (texto)
  - `attending` (booleano)

O script SQL de criação está em `supabase-schema.sql`.

## Próximos passos
- criar layout visual do convite
- integrar mapa real (Google Maps ou Leaflet)
- configurar tabela `rsvp` no Supabase
- adicionar imagens e conteúdo definitivo
