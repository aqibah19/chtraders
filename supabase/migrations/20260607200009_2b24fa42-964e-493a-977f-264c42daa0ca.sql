
CREATE TABLE public.webauthn_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  credential_id text NOT NULL UNIQUE,
  public_key text NOT NULL,
  counter bigint NOT NULL DEFAULT 0,
  transports text[],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.webauthn_credentials TO authenticated;
GRANT ALL ON public.webauthn_credentials TO service_role;
ALTER TABLE public.webauthn_credentials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users read own creds" ON public.webauthn_credentials FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.webauthn_challenges (
  key text PRIMARY KEY,
  challenge text NOT NULL,
  user_id uuid,
  email text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '5 minutes')
);
GRANT ALL ON public.webauthn_challenges TO service_role;
ALTER TABLE public.webauthn_challenges ENABLE ROW LEVEL SECURITY;
