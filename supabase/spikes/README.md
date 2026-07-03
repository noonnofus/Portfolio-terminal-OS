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
