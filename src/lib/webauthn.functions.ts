import { createServerFn } from "@tanstack/react-start";
import { getRequestHost } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const RP_NAME = "CH TRADERS";

function rpID() {
  const host = getRequestHost();
  return host.split(":")[0];
}
function rpOrigin() {
  const host = getRequestHost();
  const proto = host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https";
  return `${proto}://${host}`;
}

async function saveChallenge(key: string, challenge: string, fields: { user_id?: string; email?: string }) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("webauthn_challenges").delete().lt("expires_at", new Date().toISOString());
  await supabaseAdmin.from("webauthn_challenges").upsert({
    key,
    challenge,
    user_id: fields.user_id ?? null,
    email: fields.email ?? null,
    expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  });
}
async function consumeChallenge(key: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.from("webauthn_challenges").select("*").eq("key", key).maybeSingle();
  if (data) await supabaseAdmin.from("webauthn_challenges").delete().eq("key", key);
  return data as { key: string; challenge: string; user_id: string | null; email: string | null; expires_at: string } | null;
}

export const getRegistrationOptions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { generateRegistrationOptions } = await import("@simplewebauthn/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;
    const { data: existing } = await supabaseAdmin
      .from("webauthn_credentials")
      .select("credential_id,transports")
      .eq("user_id", userId);
    const email = (context.claims as any)?.email ?? "user";
    const options = await generateRegistrationOptions({
      rpName: RP_NAME,
      rpID: rpID(),
      userName: email,
      userDisplayName: email,
      attestationType: "none",
      authenticatorSelection: { residentKey: "preferred", userVerification: "required" },
      excludeCredentials: (existing ?? []).map((c: any) => ({ id: c.credential_id, transports: c.transports ?? undefined })),
    });
    await saveChallenge(`reg:${userId}`, options.challenge, { user_id: userId });
    return options;
  });

export const verifyRegistration = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { response: any }) => d)
  .handler(async ({ data, context }) => {
    const { verifyRegistrationResponse } = await import("@simplewebauthn/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const userId = context.userId;
    const ch = await consumeChallenge(`reg:${userId}`);
    if (!ch) throw new Error("Challenge expired. Try again.");
    const verification = await verifyRegistrationResponse({
      response: data.response,
      expectedChallenge: ch.challenge,
      expectedOrigin: rpOrigin(),
      expectedRPID: rpID(),
      requireUserVerification: true,
    });
    if (!verification.verified || !verification.registrationInfo) throw new Error("Verification failed");
    const { credential } = verification.registrationInfo;
    const publicKeyB64 = Buffer.from(credential.publicKey).toString("base64");
    const { error } = await supabaseAdmin.from("webauthn_credentials").insert({
      user_id: userId,
      credential_id: credential.id,
      public_key: publicKeyB64,
      counter: credential.counter ?? 0,
      transports: data.response?.response?.transports ?? null,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listMyCredentials = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("webauthn_credentials")
      .select("id,created_at")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    return data ?? [];
  });

export const deleteCredential = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => d)
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("webauthn_credentials").delete().eq("id", data.id).eq("user_id", context.userId);
    return { ok: true };
  });

export const getAuthenticationOptions = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string }) => d)
  .handler(async ({ data }) => {
    const { generateAuthenticationOptions } = await import("@simplewebauthn/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();
    const { data: usersList } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const user = usersList?.users?.find((u: any) => u.email?.toLowerCase() === email);
    if (!user) throw new Error("No account found for that email");
    const { data: creds } = await supabaseAdmin
      .from("webauthn_credentials")
      .select("credential_id,transports")
      .eq("user_id", user.id);
    if (!creds || creds.length === 0) throw new Error("Fingerprint not set up for this account. Sign in with password first and enable it in My Account.");
    const options = await generateAuthenticationOptions({
      rpID: rpID(),
      userVerification: "required",
      allowCredentials: creds.map((c: any) => ({ id: c.credential_id, transports: c.transports ?? undefined })),
    });
    await saveChallenge(`auth:${email}`, options.challenge, { user_id: user.id, email });
    return options;
  });

export const verifyAuthentication = createServerFn({ method: "POST" })
  .inputValidator((d: { email: string; response: any }) => d)
  .handler(async ({ data }) => {
    const { verifyAuthenticationResponse } = await import("@simplewebauthn/server");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const email = data.email.trim().toLowerCase();
    const ch = await consumeChallenge(`auth:${email}`);
    if (!ch || !ch.user_id) throw new Error("Challenge expired. Try again.");
    const credId = data.response?.id;
    const { data: cred } = await supabaseAdmin
      .from("webauthn_credentials")
      .select("*")
      .eq("credential_id", credId)
      .eq("user_id", ch.user_id)
      .maybeSingle();
    if (!cred) throw new Error("Unknown credential");
    const verification = await verifyAuthenticationResponse({
      response: data.response,
      expectedChallenge: ch.challenge,
      expectedOrigin: rpOrigin(),
      expectedRPID: rpID(),
      requireUserVerification: true,
      credential: {
        id: cred.credential_id,
        publicKey: new Uint8Array(Buffer.from(cred.public_key, "base64")),
        counter: Number(cred.counter),
        transports: (cred.transports ?? undefined) as any,
      },
    });
    if (!verification.verified) throw new Error("Fingerprint verification failed");
    await supabaseAdmin
      .from("webauthn_credentials")
      .update({ counter: verification.authenticationInfo.newCounter })
      .eq("id", cred.id);
    const { data: link, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (linkErr || !link?.properties?.hashed_token) throw new Error(linkErr?.message ?? "Could not create session");
    return { token_hash: link.properties.hashed_token, email };
  });