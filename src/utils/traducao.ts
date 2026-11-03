/**
 * O DummyJSON entrega os pratos em inglês. Traduzimos na hora de exibir,
 * sem tocar na API — assim a busca e a edição também ficam em português.
 */

/** Remove acentos e caixa, para a busca funcionar digitando "macarrao". */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const COZINHAS: Record<string, string> = {
  italian: 'Italiana',
  asian: 'Asiática',
  american: 'Americana',
  mexican: 'Mexicana',
  mediterranean: 'Mediterrânea',
  pakistani: 'Paquistanesa',
  japanese: 'Japonesa',
  moroccan: 'Marroquina',
  korean: 'Coreana',
  greek: 'Grega',
  thai: 'Tailandesa',
  indian: 'Indiana',
  turkish: 'Turca',
  smoothie: 'Vitaminas',
  russian: 'Russa',
  lebanese: 'Libanesa',
  brazilian: 'Brasileira',
  spanish: 'Espanhola',
  vietnamese: 'Vietnamita',
  cocktail: 'Coquetel',
  hawaiian: 'Havaiana',
}

const PRATOS: Record<string, string> = {
  'classic margherita pizza': 'Pizza Margherita Clássica',
  'vegetarian stir-fry': 'Refogado Vegetariano',
  'chocolate chip cookies': 'Cookies com Gotas de Chocolate',
  'chicken alfredo pasta': 'Macarrão Alfredo com Frango',
  'mango salsa chicken': 'Frango com Salsa de Manga',
  'quinoa salad with avocado': 'Salada de Quinoa com Abacate',
  'tomato basil bruschetta': 'Bruschetta de Tomate e Manjericão',
  'beef and broccoli stir-fry': 'Refogado de Carne com Brócolis',
  'caprese salad': 'Salada Caprese',
  'shrimp scampi pasta': 'Macarrão com Camarão ao Alho',
  'chicken biryani': 'Biryani de Frango',
  'chicken karahi': 'Frango Karahi',
  'aloo keema': 'Carne com Batata (Aloo Keema)',
  'chapli kebabs': 'Kebab Chapli',
  'saag (spinach) with makki di roti': 'Espinafre com Pão Makki di Roti (Saag)',
  'japanese ramen soup': 'Sopa de Ramen Japonesa',
  'moroccan chickpea tagine': 'Tagine Marroquino de Grão-de-Bico',
  'korean bibimbap': 'Bibimbap Coreano',
  'greek moussaka': 'Moussaka Grega',
  'butter chicken (murgh makhani)': 'Frango com Manteiga (Murgh Makhani)',
  'thai green curry': 'Curry Verde Tailandês',
  'mango lassi': 'Lassi de Manga',
  'italian tiramisu': 'Tiramisù Italiano',
  'turkish kebabs': 'Kebab Turco',
  'blueberry banana smoothie': 'Vitamina de Banana com Mirtilo',
  'mexican street corn (elote)': 'Milho de Rua Mexicano (Elote)',
  'russian borscht': 'Borscht Russo',
  'south indian masala dosa': 'Masala Dosa do Sul da Índia',
  'lebanese falafel wrap': 'Wrap de Falafel Libanês',
  'brazilian caipirinha': 'Caipirinha Brasileira',
  'spanish patatas bravas': 'Patatas Bravas Espanholas',
  'vietnamese fresh spring rolls': 'Rolinhos Primavera Frescos Vietnamitas',
  'mediterranean quinoa salad': 'Salada Mediterrânea de Quinoa',
  'japanese matcha green tea ice cream': 'Sorvete de Matcha Japonês',
  'brazilian chocolate brigadeiros': 'Brigadeiros de Chocolate Brasileiros',
  'mexican chicken enchiladas': 'Enchiladas Mexicanas de Frango',
  'thai coconut shrimp curry': 'Curry Tailandês de Camarão com Coco',
  'greek spanakopita': 'Spanakopita Grega',
  'moroccan couscous salad': 'Salada Marroquina de Cuscuz',
  'classic mojito': 'Mojito Clássico',
  'caprese bruschetta': 'Bruschetta Caprese',
  'teriyaki chicken stir-fry': 'Refogado de Frango Teriyaki',
  'mango avocado salsa': 'Salsa de Manga com Abacate',
  'shrimp and asparagus stir-fry': 'Refogado de Camarão com Aspargos',
  'italian margherita pizza': 'Pizza Margherita Italiana',
  'pesto pasta with cherry tomatoes': 'Macarrão ao Pesto com Tomate-Cereja',
  'hawaiian chicken skewers': 'Espetinhos de Frango Havaiano',
  'cucumber avocado rolls': 'Rolinhos de Pepino com Abacate',
  'mediterranean chickpea salad': 'Salada Mediterrânea de Grão-de-Bico',
  'pineapple coconut smoothie': 'Vitamina de Abacaxi com Coco',
}

/** Nome do prato em português. Nomes já criados pela dupla passam intactos. */
export function traduzirPrato(nome: string): string {
  return PRATOS[nome.trim().toLowerCase()] ?? nome
}

/** Cozinha em português (ou o texto original, se for uma cozinha digitada). */
export function traduzirCozinha(cozinha: string): string {
  return COZINHAS[cozinha.trim().toLowerCase()] ?? cozinha
}

/** Texto usado pela busca: já traduzido e sem acento. */
export function textoBuscavel(nome: string, cozinha: string): string {
  return `${normalizar(traduzirPrato(nome))} ${normalizar(traduzirCozinha(cozinha))}`
}
