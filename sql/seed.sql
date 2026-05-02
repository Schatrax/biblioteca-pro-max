-- Seed idempotente: usa ON DUPLICATE KEY UPDATE para preservar contas existentes.
-- Senha em texto plano dos 3 usuários: 123456
-- Hash gerado com: node -e "console.log(require('bcryptjs').hashSync('123456', 10))"

INSERT INTO usuarios (id, nome, email, senha, tipo) VALUES
  (1, 'Admin Master',     'admin@biblioteca.com', '$2a$10$0LBTu0kBOfcz5vqFlk8wTuY1TCHoBWTTmz6sd/bflLB5yObRb566W', 3),
  (2, 'João Funcionário', 'func@biblio.com',      '$2a$10$0LBTu0kBOfcz5vqFlk8wTuY1TCHoBWTTmz6sd/bflLB5yObRb566W', 2),
  (3, 'Maria Aluna',      'aluna@teste.com',      '$2a$10$0LBTu0kBOfcz5vqFlk8wTuY1TCHoBWTTmz6sd/bflLB5yObRb566W', 1)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  tipo = VALUES(tipo);

INSERT INTO livros (id, nome, autor, paginas, descricao, imagem_url, estoque, preco) VALUES
  (1, 'Clean Code',   'Robert C. Martin', 464, 'Um guia completo sobre boas práticas de programação',
      'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg', 5, 49.90),
  (2, 'Harry Potter', 'J.K. Rowling',     309, 'O primeiro livro da saga do bruxinho mais famoso',
      'https://m.media-amazon.com/images/I/81ibfYk4qmL._SY466_.jpg', 3, 39.90)
ON DUPLICATE KEY UPDATE
  nome = VALUES(nome),
  autor = VALUES(autor),
  paginas = VALUES(paginas);
