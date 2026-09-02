-- Contador de vistas del tutorial, por cuenta y no por navegador.
--
-- Antes el tutorial se gobernaba sólo con localStorage
-- ('omona_tutorial_completed'), así que volvía a aparecer en cada navegador,
-- dispositivo o ventana de incógnito del MISMO usuario. Ahora vive en el
-- perfil: se muestra las dos primeras entradas a la cuenta y ya.
--
-- Y arregla algo más grave: onboarding_completed y onboarding_step NO EXISTEN
-- en la base productiva, aunque el código las lea (AuthGuard) y las escriba
-- (middleware.ts al crear el perfil de un usuario nuevo). Ese write falla en
-- silencio, así que el perfil nunca se crea, la organización queda huérfana y
-- cada petición posterior choca con el slug duplicado y devuelve 500.
-- Verificado el 2026-09-01 contra producción: la tabla profiles tenía 0 filas.
-- Sin esta migración nadie puede completar el registro.
--
-- Todo va con IF NOT EXISTS: reejecutarla no debe fallar.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS onboarding_step      INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tutorial_views       INTEGER NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.profiles.tutorial_views IS
  'Veces que se le ha mostrado el tutorial de 10 pasos. Se muestra mientras sea < 2.';

-- Los usuarios que ya existen ya vieron (y cerraron) el tutorial: dejarlos en 0
-- se lo mostraría otras dos veces a todos, incluidos los clientes activos.
-- Sólo las cuentas nuevas arrancan en 0.
UPDATE public.profiles
   SET tutorial_views = 2
 WHERE tutorial_views = 0;

COMMIT;
