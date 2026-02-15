-- Insert classic poets for WordStack
INSERT INTO public.poets (name, slug, bio, birth_year, death_year, nationality, image_url) VALUES
(
  'Emily Dickinson',
  'emily-dickinson',
  'Emily Dickinson was an American poet known for short, powerful poems about death, faith, and nature. Working largely in isolation, she developed a distinctive style using dashes, slant rhyme, and innovative capitalization. Her work revolutionized American poetry and continues to influence writers today.',
  1830,
  1886,
  'American',
  '/images/emily-dickinson.jpg'
),
(
  'Edgar Allan Poe',
  'edgar-allan-poe',
  'Edgar Allan Poe was an American writer, poet, and literary critic who pioneered the modern detective story and master of gothic atmosphere. His innovative use of mood and atmosphere created some of literature''s most haunting and memorable verses, including "The Raven" and "Annabel Lee."',
  1809,
  1849,
  'American',
  '/images/edgar-allan-poe.jpg'
),
(
  'William Wordsworth',
  'william-wordsworth',
  'William Wordsworth was a co-founder of Romanticism and a key figure in English literature. He believed poetry should use the language of ordinary people to express profound truths about nature, emotion, and the human experience. His "Lyrical Ballads" revolutionized poetry.',
  1770,
  1850,
  'British',
  '/images/william-wordsworth.jpg'
)
ON CONFLICT (slug) DO NOTHING;
