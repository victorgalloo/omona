---
title: Fraude ACH y wire: facturas y W-9 falsos
description: Cómo frenar el fraude ACH, wire y las facturas falsas en negocios latinos en EE. UU.: regla de llamada, Positive Pay, reglas Nacha 2026 y datos propios.
date: 2026-11-26
updated: 2026-11-26
tags: fraude bancario, fraude ach, wire transfer, facturas falsas, formulario w9, negocios latinos estados unidos
image: /blog/fraude-ach-wire-facturas-falsas-contratistas/suplantables-por-proveedor.svg
imageAlt: Porcentaje de dominios suplantables por proveedor de correo en 604 dominios de miembros de cámaras hispanas de EE. UU.
lang: es
alternate: wire-fraud-ach-fraud-small-business
---

# Fraude ACH y wire en negocios latinos de EE. UU.: cómo frenar el correo de «cambiamos de cuenta» antes de que te cueste una nómina

**Respuesta corta:** casi todo fraude por *wire* o ACH contra un negocio pequeño empieza con un solo correo: un proveedor, un subcontratista, la *title company* o un empleado que «actualiza» su cuenta bancaria. Se frena con cuatro controles baratos: **(1)** una **regla escrita de devolución de llamada** a un número que ya tenías, **(2)** **dos aprobaciones** para todo beneficiario nuevo, **(3)** **Positive Pay / ACH Positive Pay** y bloqueo de débitos con tu banco, y **(4)** un dominio que no se pueda suplantar (**DMARC en `p=reject`** con DKIM). Desde el **19 de junio de 2026**, las reglas de Nacha además obligan a toda empresa que origina pagos ACH a tener monitoreo de fraude basado en riesgo.

Si tienes una constructora, una transportista, una inmobiliaria o una distribuidora, esta guía es para ti: son los giros donde más dinero se mueve por transferencia a proveedores y cuadrillas.

## 1. Las cifras: 3,050 millones de dólares en 2025, y cada vez es más difícil recuperarlos

El **Internet Crime Report 2025** del FBI (IC3, publicado en abril de 2026) registró **24,768 denuncias de *Business Email Compromise*** (BEC, el fraude por correo empresarial) con **$3,046,598,558 dólares en pérdidas**, contra 21,442 denuncias y $2,770 millones en 2024. Es el segundo delito con más pérdidas, solo detrás del fraude de inversión.

La velocidad decide si recuperas el dinero. En 2025 el Recovery Asset Team del IC3 activó su **Financial Fraud Kill Chain** en **3,900 incidentes** con **$1,160 millones** en intentos de robo y congeló **$679 millones (58 %)**: $507 millones en 3,574 transferencias nacionales y $172 millones en 326 internacionales. La instrucción del propio FBI en ese reporte: si descubres una transferencia fraudulenta, **llama de inmediato a tu banco y pide el retiro (*recall*) de los fondos**, y denuncia en **ic3.gov** con todos los datos de la transacción, sin importar el monto.

## 2. Dato propio: qué configuración de correo deja suplantables a los negocios hispanos

El 26 de noviembre de 2026 tomamos los **604 dominios con correo** que publican los miembros de dos cámaras de comercio hispanas de EE. UU. (Fort Worth Hispanic Chamber, Texas, y Statewide Hispanic Chamber of Commerce of New Jersey; [método en nuestra guía WISP](/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos)) y leímos, solo por DNS público, quién les aloja el correo y si un extraño puede mandar correos a su nombre.

![Porcentaje de dominios suplantables por proveedor de correo en 604 dominios de miembros de cámaras hispanas de EE. UU.](/blog/fraude-ach-wire-facturas-falsas-contratistas/suplantables-por-proveedor.svg)

| Proveedor de correo (registro MX) | Dominios | Participación | Suplantables (sin DMARC o `p=none`) | DMARC `p=reject` | DKIM en selector por defecto |
|---|---|---|---|---|---|
| Microsoft 365 | 225 | 37.3 % | **48.4 %** | 23.1 % | 67.1 % |
| Google Workspace | 159 | 26.3 % | **84.9 %** | 3.8 % | 39.6 % |
| Otro hosting | 139 | 23.0 % | **77.7 %** | 10.8 % | — |
| Pasarela de filtrado (Proofpoint, Mimecast…) | 72 | 11.9 % | **25.0 %** | 56.9 % | — |
| **Los 604 dominios** | 604 | 100 % | **62.7 %** | 18.9 % | 55.7 % de 384 medibles |

Qué significa para el dueño:

- **Google Workspace es la configuración más débil que medimos.** 135 de 159 dominios (84.9 %) se pueden suplantar y solo 6 bloquean con `p=reject`. Google no firma con DKIM tu dominio propio hasta que un administrador genera la llave: solo 39.6 % la publica en el selector `google` (es un piso: los selectores personalizados no se ven con este método).
- **Microsoft 365 sale mejor, no bien.** La mitad (48.4 %) sigue suplantable.
- **Quien paga una pasarela de filtrado sí aplica DMARC** (56.9 % en `p=reject`). El control es gratis; la diferencia es que alguien se hace cargo.
- **Los giros que más pagan por transferencia no están más protegidos.** En construcción, equipo, transporte, inmobiliarias, manufactura/mayoreo y suministros industriales (129 dominios), **65.9 % son suplantables** y solo 15.5 % aplica `p=reject`. MTA-STS, que protege el correo en tránsito, aparece en apenas 1.7 % del total.

Revisa tu propio dominio gratis con el [verificador SPF y DMARC](/verificador-dmarc-spf) o corre el [diagnóstico pasivo de dominio](/#diagnostico): su entregable `.md` ahora incluye una lista contra desvío de pagos ajustada a Microsoft 365 o Google Workspace.

## 3. Cómo ocurre el fraude (y dónde lo corta cada control)

| Paso del fraude | Lo que ve el dueño | Control que lo rompe |
|---|---|---|
| 1. Suplantan tu dominio o el de un proveedor, o toman un buzón real | Un correo «de» un contacto conocido | DMARC `p=reject` + DKIM; MFA en todos los buzones |
| 2. Una regla oculta reenvía o esconde las respuestas | Nada: la conversación se ve normal | Bloquear el reenvío automático externo; revisar reglas cada mes |
| 3. «Cambiamos de banco», con un W-9 nuevo y carta membretada | Un PDF creíble, muchas veces a fin de año | **El formulario W-9 no tiene campos bancarios.** Un W-9 que llega junto con datos de cuenta nuevos es señal de alerta |
| 4. Sale el pago por *wire* o ACH | Una aprobación de rutina | Regla de llamada + dos aprobaciones + retener 24 h el primer pago a cuenta nueva |
| 5. El dinero sale de la cuenta receptora en horas | El proveedor real pregunta por su pago | *Recall* con tu banco el mismo día + denuncia en ic3.gov |

Las reglas de Nacha llaman a esto **«False Pretenses»** (pretextos falsos): un pago provocado por alguien que miente sobre su identidad, sobre su autoridad para actuar por otra persona o sobre quién es dueño de la cuenta a la que se abona. Es exactamente el BEC, la suplantación de proveedores y el desvío de nómina.

## 4. Las reglas Nacha 2026, en español claro

- **Fase 1, 20 de marzo de 2026:** todos los bancos originadores (ODFI) y las empresas o procesadores que originaron 6 millones o más de entradas ACH en 2023 deben tener procesos basados en riesgo para identificar pagos no autorizados u obtenidos con *False Pretenses*.
- **Fase 2, 19 de junio de 2026:** desaparece el umbral. **Todo originador que no es consumidor** (es decir, toda empresa que manda pagos ACH), y sus procesadores, debe cumplir y revisar el proceso al menos una vez al año. Los bancos receptores también deben vigilar los abonos que llegan.
- **Descripciones estándar:** desde el 20 de marzo de 2026, la nómina debe ir con la descripción `PAYROLL` y los cargos por compras en línea de consumidores con `PURCHASE`, lo que ayuda a los bancos a detectar anomalías.

Para un negocio de 5 a 50 personas, un «proceso basado en riesgo» razonable cabe en una hoja: quién puede dar de alta beneficiarios, cómo se verifica un cambio de cuenta, qué monto requiere dos aprobaciones y qué se revisa cada mes. Pregunta a tu banco qué herramientas te ofrece; casi todos ya las venden.

## 5. La hoja de una página (pégala junto a cuentas por pagar)

1. **Regla de llamada, por escrito.** Toda cuenta bancaria nueva o cambiada se confirma por teléfono a un número de tus registros o del contrato original, nunca al que viene en el correo o en el PDF. Anota quién llamó y cuándo.
2. **Dos personas, siempre.** Una captura el beneficiario y otra lo aprueba. Lo mismo para todo *wire* o ACH arriba de tu límite.
3. **Retén el primer pago.** 24 horas para cualquier primer pago a una cuenta nueva; los microdepósitos de prueba no son verificación.
4. **Herramientas del banco.** Positive Pay para cheques, ACH Positive Pay o bloqueo de débitos ACH en la cuenta operativa, y alertas en cada *wire* saliente.
5. **Verifica el TIN del subcontratista.** Si presentas formularios 1099, el programa *TIN Matching* del IRS comprueba el nombre y el TIN del W-9 antes de pagarle a un subcontratista nuevo.
6. **Cierra el buzón.** MFA para todos, sin reenvío automático externo, y DMARC de `p=none` a `p=quarantine` y luego a `p=reject`.
7. **Ensaya el mal día.** La línea de fraude de tu banco, el número de siniestros de tu aseguradora e ic3.gov en la misma hoja. Los cuestionarios de *cyber insurance* suelen preguntar por estos mismos controles.

## 6. Si usas IA o WhatsApp con clientes y proveedores

Un asistente bilingüe que atiende proveedores por WhatsApp o correo **nunca debe aceptar ni confirmar un cambio de datos bancarios**: esa solicitud siempre pasa a una persona con la regla de llamada. Deja sus permisos en solo lectura, no le permitas guardar números de cuenta y registra cada traspaso a humano. Más en nuestra página de [procesos comerciales con IA bilingüe](/comercial-ia) y en los [servicios de seguridad defensiva](/seguridad).

## 7. Método y límites

- **Muestra:** los mismos 604 dominios con MX de miembros de los directorios públicos ChamberMaster de FWHCC (TX) y SHCCNJ (NJ), sin la categoría de gobierno y educación. Los miembros de una cámara que publican su sitio no son una muestra aleatoria de todos los negocios hispanos de EE. UU.
- **Qué hicimos:** solo consultas DNS-over-HTTPS (MX, DKIM en el selector por defecto del proveedor, `_mta-sts`), cruzadas con las lecturas SPF/DMARC del mismo día. Cero contacto con los servidores de los negocios.
- **Qué publicamos:** solo agregados; nunca nombramos dominios con debilidades.
- **No es asesoría legal ni bancaria.** Omona hace revisiones **solo defensivas** con autorización escrita del dueño del sistema; no hace pruebas de penetración.

**Fuentes:** FBI IC3, *2025 Internet Crime Report* (abril de 2026); Nacha, *Risk Management Topics – Fraud Monitoring Phase 1 y Phase 2* y *Company Entry Descriptions*; formulario W-9 y programa *TIN Matching* del IRS; medición propia de Omona del 26-nov-2026.
