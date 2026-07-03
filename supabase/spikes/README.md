# Supabase security spikes

These SQL files validate assumptions against the linked development project.
They are not migrations and must leave no persistent database objects.

Rules:

- Every spike runs inside an explicit transaction and ends with `rollback`.
- Never add production data or secrets to a spike.
- Run only against the development Supabase project.
- A passing spike does not replace the reviewed migration and pgTAP tests.

Run the account mapping spike:

```bash
npx supabase db query --linked \
  --file supabase/spikes/phase0_account_mapping.sql
```

Run the account deletion atomicity spike:

```bash
npx supabase db query --linked \
  --file supabase/spikes/phase0_account_deletion.sql
```

After completing a second OAuth login for the same GitHub user, run the
deletion session-binding spike:

```bash
npx supabase db query --linked \
  --file supabase/spikes/phase0_deletion_session_binding.sql
```
