# paulopimenta6.github.io

Página pessoal de [Paulo Pimenta](https://github.com/paulopimenta6) — meteorologista pelo IAG-USP e mestrando em Estatística Aplicada à Saúde na FMUSP.

Disponível em: https://paulopimenta6.github.io

## Estrutura

- `index.html` — página única com hero, sobre, o que faço, método, projetos, pesquisa, notas, trajetória, fotos e contato.
- `404.html` — página de erro personalizada.
- `sitemap.xml` e `robots.txt` — arquivos para buscadores.
- `assets/css/style.css` — estilos (tema escuro padrão, com alternância para o claro).
- `assets/js/main.js` — tema, menu móvel, animações de entrada e lightbox acessível da galeria.
- `assets/images/` — retrato, fotos, favicon, imagem de compartilhamento e figuras dos projetos (WebP com fallback JPG).

## Rodando localmente

Não há build nem dependências. Basta servir a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

Depois abra http://localhost:8000.

## Publicação

O site é publicado automaticamente pelo GitHub Pages a partir da branch `main` (raiz do repositório). Qualquer push para `main` atualiza o site em alguns minutos.
