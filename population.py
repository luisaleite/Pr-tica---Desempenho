import psycopg2
import random
import string

# Parâmetros de conexão com o banco de dados
db_params = {
    "host": "localhost",
    "database": "postgres",
    "user": "postgres",
    "password": "password",
}

# Função para gerar dados de compra aleatórios
def generate_purchase_data():
    product = ''.join(random.choice(string.ascii_letters) for _ in range(10))
    price = round(random.uniform(1.0, 1000.0), 2)
    quantity = random.randint(1, 10)
    return product, price, quantity

# Estabelecer uma conexão com o banco de dados
conn = psycopg2.connect(**db_params)
cursor = conn.cursor()

# Inserir 1000 linhas de dados de compra
for _ in range(1000):
    product, price, quantity = generate_purchase_data()
    cursor.execute("INSERT INTO compras (produto, preco, quantidades) VALUES (%s, %s, %s)", (product, price, quantity))

# Confirmar as alterações no banco de dados
conn.commit()

# Fechar o cursor e a conexão
cursor.close()
conn.close()
