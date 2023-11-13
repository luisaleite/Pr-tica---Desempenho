const { Pool } = require('pg');
const redis = require('redis');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432,
});

// Configuração do Redis
const redisClient = redis.createClient();

// Query SELECT
const query = 'SELECT * FROM compras';

// Tenta obter os dados do Redis primeiro
redisClient.get(query, (err, cachedData) => {
  if (err) {
    console.error('Erro ao obter dados do cache Redis:', err);
  } else if (cachedData) {
    // Se os dados estiverem no cache, usa esses dados
    console.log('Dados obtidos do cache Redis:', JSON.parse(cachedData));
    // Não é necessário fechar a conexão aqui, pois não houve consulta ao banco de dados
  } else {
    // Se os dados não estiverem no cache, consulta o banco de dados
    pool.query(query, (err, res) => {
      if (err) {
        console.error('Erro na consulta:', err);
      } else {
        console.log('Linhas retornadas:', res.rowCount);
        console.log('Dados:', res.rows);

        // Armazena os dados no cache Redis
        redisClient.set(query, JSON.stringify(res.rows), 'EX', 60); // Cache válido por 60 segundos
      }

      // Fecha a conexão com o banco de dados
      pool.end();

      // Fecha a conexão com o Redis
      redisClient.quit();
    });
  }
});
