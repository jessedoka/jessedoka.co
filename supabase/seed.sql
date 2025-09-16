insert into public.packs
(slug, title, description, cover_url, preview_urls, r2_prefix, version, stripe_price_id, price)
values
    (
        'gallery',
        'Gallery',
        'Industrial textures, clean gradients—built for OLED.',
        'https://img.jessedoka.co/raw/gallery/A7402412-w640.webp',
        '["https://img.jessedoka.co/raw/gallery/A7402412-w640.webp"]',
        'raw/gallery',
        'v1',
        'price_1S5BDD18o1oJgteRkPtveu8m',
        1500
    ),
    (
        'gallery2',
        'Gallery 2',
        'Industrial textures, clean gradients—built for OLED.',
        'https://img.jessedoka.co/raw/gallery/A7402412-w640.webp',
        '["https://img.jessedoka.co/raw/gallery/A7402412-w640.webp"]',
        'raw/gallery',
        'v1',
        'price_1S5BDD18o1oJgteRkPtveu8n',
        1500
    ),
    (
        'gallery3',
        'Gallery 3',
        'Industrial textures, clean gradients—built for OLED.',
        'https://img.jessedoka.co/raw/gallery/A7402412-w640.webp',
        '["https://img.jessedoka.co/raw/gallery/A7402412-w640.webp"]',
        'raw/gallery',
        'v1',
        'price_1S5BDD18o1oJgteRkPtveu8o',
        1500
    );
    
-- Insert sample orders
insert into public.orders
(id, pack_id, email, stripe_session_id, amount, currency, status)
values
    (
        '450d99f2-acc5-4c81-bbbb-691077d8b377',
        (select id from public.packs where slug = 'gallery'),
        'customer1@example.com',
        'cs_test_1234567890abcdef',
        1500,
        'gbp',
        'paid'
    ),
    (
        '550d99f2-acc5-4c81-bbbb-691077d8b378',
        (select id from public.packs where slug = 'gallery'),
        'customer2@example.com',
        'cs_test_2345678901bcdefg',
        1500,
        'gbp',
        'paid'
    ),
    (
        '650d99f2-acc5-4c81-bbbb-691077d8b379',
        (select id from public.packs where slug = 'gallery'),
        'customer3@example.com',
        'cs_test_3456789012cdefgh',
        1500,
        'gbp',
        'paid'
    );

-- Insert sample downloads
insert into public.downloads
(id, order_id, path, token, expires_at, remaining)
values
    (
        'f70f9e15-34ef-4664-9cfc-5d61b74e1723',
        '450d99f2-acc5-4c81-bbbb-691077d8b377',
        'raw/gallery/A7402412.jpg',
        'OX54wa_u_9AdqEEJ2Ia2BCMj7ZqbxW8R',
        now() + interval '7 days',
        5
    ),
    (
        'f80f9e15-34ef-4664-9cfc-5d61b74e1724',
        '550d99f2-acc5-4c81-bbbb-691077d8b378',
        'raw/gallery/A7402412.jpg',
        'BX65xb_v_0BdrFFK3Jb3CDNk8ZrcyX9S',
        now() + interval '5 days',
        3
    ),
    (
        'f90f9e15-34ef-4664-9cfc-5d61b74e1725',
        '650d99f2-acc5-4c81-bbbb-691077d8b379',
        'raw/gallery/A7402412.jpg',
        'CX76yc_w_1CesGGH4Kc4DEOl9asdzY0T',
        now() + interval '2 days',
        1
    );