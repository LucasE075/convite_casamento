import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { initSupabase } from './src/supabaseClient.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

const supabase = initSupabase();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/main', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'main.html'));
});

app.get('/banner', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'main.html'));
});

app.get('/info', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'main.html'));
});

app.get('/mapa', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'main.html'));
});

app.get('/presenca', (req, res) => {
  res.redirect('/');
});

app.get('/presenca.html', (req, res) => {
  res.redirect('/');
});

app.get('/api/guests', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('guests')
      .select('id, name')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    res.json({ success: true, guests: data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/rsvp', async (req, res) => {
  const { guestId, tel, attending, companions = [] } = req.body;
  const attendingBoolean = attending === true || attending === 'true';

  if (!guestId) {
    return res.status(400).json({ success: false, error: 'É necessário selecionar um nome.' });
  }

  try {
    const { data: guestData, error: guestError } = await supabase
      .from('guests')
      .update({ tel, attending: attendingBoolean })
      .eq('id', guestId)
      .select('id, name')
      .single();

    if (guestError || !guestData) {
      throw guestError || new Error('Convidado não encontrado.');
    }

    let companionsResult = null;

    if (attendingBoolean && Array.isArray(companions) && companions.length > 0) {
      const companionsData = companions
        .map((companion) => companion?.trim())
        .filter((companionName) => companionName);

      if (companionsData.length > 0) {
        const { data: companionInsertData, error: companionError } = await supabase
          .from('companions')
          .insert(
            companionsData.map((companionName) => ({
              guest_id: guestId,
              name: companionName,
              attending: true
            }))
          );

        if (companionError) {
          throw companionError;
        }

        companionsResult = companionInsertData;
      }
    }

    res.json({ success: true, guest: guestData, companions: companionsResult });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor iniciado em http://localhost:${port}`);
});
