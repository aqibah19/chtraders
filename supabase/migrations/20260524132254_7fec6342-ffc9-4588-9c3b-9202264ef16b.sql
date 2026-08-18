
-- Add images column for multiple product images (max 5 enforced in app + trigger)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images text[] NOT NULL DEFAULT '{}';

CREATE OR REPLACE FUNCTION public.enforce_product_images_limit()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.images IS NOT NULL AND array_length(NEW.images, 1) > 5 THEN
    RAISE EXCEPTION 'A product can have at most 5 images';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS products_images_limit ON public.products;
CREATE TRIGGER products_images_limit
BEFORE INSERT OR UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION public.enforce_product_images_limit();

-- Storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Public read product images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins upload product images" ON storage.objects;
CREATE POLICY "Admins upload product images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins update product images" ON storage.objects;
CREATE POLICY "Admins update product images" ON storage.objects
FOR UPDATE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins delete product images" ON storage.objects;
CREATE POLICY "Admins delete product images" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
