---
title: Seguro cibernético para pequeñas empresas
description: Requisitos del seguro cibernético (cyber insurance) en EE. UU.: preguntas de la solicitud, escaneo externo, respaldos inmutables y 595 negocios hispanos.
date: 2026-11-27
updated: 2026-11-27
tags: seguro cibernetico, cyber insurance, pequeñas empresas, negocios latinos, respaldos inmutables
image: /blog/seguro-cibernetico-pequenas-empresas/senales-aseguradora.svg
imageAlt: Porcentaje de negocios de cámaras hispanas de EE. UU. que cumplen las 6 señales externas que revisa el escaneo de una aseguradora, por grupo
lang: es
alternate: cyber-insurance-small-business-checklist
---

# Seguro cibernético (cyber insurance) para pequeñas empresas en EE. UU.: qué pregunta la solicitud, qué escanea la aseguradora y cómo contestar «sí» sin mentir

**Respuesta corta:** la solicitud de un seguro cibernético para un negocio pequeño en Estados Unidos es una lista de preguntas de sí o no sobre unos cuantos controles: **MFA** en correo y acceso remoto, **EDR** en cada equipo, **respaldos cifrados fuera de línea o inmutables** y probados, **parches**, **ningún RDP abierto a internet**, **capacitación contra phishing** y un **plan de incidentes por escrito**. Antes de leer tus respuestas, muchas aseguradoras además corren un **escaneo externo** de tu dominio: autenticación de correo (SPF, DMARC), HTTPS y software expuesto. Medimos esas señales en **595 negocios hispanos de EE. UU.**: solo **17.3 % cumple las seis**. Y lee la póliza dos veces: la **NAIC** advierte que las pólizas cibernéticas estándar con frecuencia **excluyen o limitan mucho la ingeniería social y el fraude por transferencia**, justo la pérdida que más golpea a contratistas y proveedores latinos.

## 1. El mercado en 2026: más pólizas, más reclamos, precios a la baja

El **Report on the Cybersecurity Insurance Market** de la Asociación Nacional de Comisionados de Seguros (NAIC; año 2025, publicado en octubre de 2026) reporta:

| Indicador (EE. UU., 2025) | Valor |
|---|---|
| Prima emitida, incluyendo *alien surplus lines* | **$9,460 millones de USD** (+3.5 %) |
| Pólizas domésticas vigentes | **5.84 millones** (+33 %); casi dos tercios son **endosos** cibernéticos a otras pólizas comerciales |
| Reclamos reportados | **56,323** (+20 %) |
| Siniestralidad de la industria | **53**, desde 48.7 |
| Severidad promedio por reclamo, empresas pequeñas y medianas (datos de aseguradoras citados por la NAIC) | cerca de **$142,000 USD**, desde unos $215,000 en 2024 |
| Precio | el primer trimestre de 2026 fue el **octavo trimestre seguido** de recortes de tarifa en EE. UU. |

Para el dueño de un negocio de 5 a 50 personas: hoy la cobertura es más barata y más fácil de conseguir que en 2021, y muchos dueños «tienen cyber» solo como endoso de su póliza de paquete, con límites bajos. Pregúntale a tu agente cuál de las dos tienes.

## 2. Los 12 controles detrás de casi todas las solicitudes

Marsh, uno de los corredores de seguros más grandes, publica los **12 controles clave** que las aseguradoras asocian con menos reclamos. Corresponden casi uno a uno con las preguntas de la solicitud:

| Control | Cómo suele venir la pregunta | Evidencia que conviene guardar |
|---|---|---|
| 1. MFA en acceso remoto y privilegiado | «¿Exiges MFA en correo, acceso remoto y cuentas de administrador?» | Captura de la política de verificación en dos pasos |
| 2. Filtrado de correo y web | «¿Filtras el correo entrante? ¿Usas SPF/DMARC?» | Consola de filtrado + registro DMARC |
| 3. Respaldos cifrados y probados | «¿Los respaldos están fuera de línea o son inmutables? ¿Cuándo probaste una restauración?» | Fecha y resultado de la última restauración |
| 4. Gestión de accesos privilegiados | «¿Las cuentas de administrador están separadas de las de uso diario?» | Lista de cuentas de administrador |
| 5. EDR | «¿Tienes EDR en todos los equipos y servidores?» | Conteo de equipos en la consola EDR |
| 6. Parches y vulnerabilidades | «¿Aplicas parches críticos en menos de 30 días?» | Reporte de actualizaciones |
| 7. Plan de respuesta a incidentes | «¿Tienes un plan escrito y probado?» | Plan de una hoja con teléfonos |
| 8. Capacitación y simulacros de phishing | «¿Cada cuánto capacitas al personal?» | Bitácora de capacitación |
| 9. RDP cerrado y endurecimiento | «¿Hay RDP expuesto a internet?» | Regla de firewall que lo cierra |
| 10. Bitácoras y monitoreo | «¿Guardas y revisas bitácoras?» | Configuración de retención |
| 11. Sistemas sin soporte | «¿Usas software sin soporte?» | Inventario |
| 12. Riesgo de proveedores digitales | «¿Revisas la seguridad de tus proveedores?» | Lista de proveedores con estado de MFA |

**Nunca contestes «sí» a un control que no tienes.** Una declaración falsa en la solicitud es de las razones comunes para disputar un reclamo. Si vas a medias, escribe «en proceso» y la fecha.

## 3. Dato propio: lo que una aseguradora ve desde fuera antes de leer tus respuestas

El 26 de noviembre de 2026 medimos **595 negocios miembros** de dos cámaras hispanas de comercio de EE. UU. (Fort Worth Hispanic Chamber, Texas, y Statewide Hispanic Chamber of Commerce of New Jersey) que publican dominio de correo y sitio activo ([método](/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos)). Revisamos seis señales que cualquier escaneo externo ve: **(1)** SPF válido, **(2)** DMARC aplicado (`p=quarantine` o `p=reject`), **(3)** HTTPS con certificado válido, **(4)** HTTP que redirige a HTTPS, **(5)** HSTS y **(6)** sin versión de software anunciada.

![Porcentaje de negocios de cámaras hispanas de EE. UU. que cumplen las 6 señales externas que revisa el escaneo de una aseguradora, por grupo](/blog/seguro-cibernetico-pequenas-empresas/senales-aseguradora.svg)

| Señal | Negocios que fallan (de 595) |
|---|---|
| DMARC sin aplicar (ausente o `p=none`) | **377 · 63.4 %** |
| Sin HSTS | **274 · 46.1 %** |
| SPF ausente o inválido | 72 · 12.1 % |
| Versión de software anunciada (ej. `PHP/7.4`) | 69 · 11.6 % |
| HTTP no redirige a HTTPS | 60 · 10.1 % |
| Sin certificado HTTPS válido | 14 · 2.4 % |

- **Solo 103 de 595 (17.3 %) cumplen las seis**; 275 (46.2 %) cumplen cuatro o menos.
- **Construcción:** 8.7 % cumple las seis (n=69). **Salud:** 6.9 % (n=29). **Finanzas y seguros**, el sector que vende y suscribe pólizas: 34.1 % (n=91).
- **Por proveedor de correo:** Google Workspace 7.6 % (n=158), Microsoft 365 22.7 % (n=220), negocios detrás de una pasarela de filtrado 39.1 % (n=69).
- **14 sitios** anuncian todavía una versión de PHP sin soporte de seguridad (anterior a 8.2).

Estas señales no te hacen asegurable por sí solas, pero son las más baratas de arreglar y las primeras que reporta un escaneo externo. Revisa las tuyas en 2 segundos con el [diagnóstico pasivo gratuito](/#diagnostico): su entregable `.md` ya trae estas seis señales y la lista de la solicitud.

## 4. Respaldos inmutables, en palabras simples

Un **respaldo inmutable** es una copia que nadie puede cambiar ni borrar durante un periodo de retención, ni siquiera un administrador con la contraseña robada. Los grupos de *ransomware* atacan primero los respaldos; la inmutabilidad (*object lock* o almacenamiento «WORM») o una copia físicamente fuera de línea es lo que te deja restaurar sin pagar.

- **Regla práctica:** tres copias, en dos tipos de almacenamiento, una fuera de línea o inmutable.
- **Actívalo donde ya pagas:** la mayoría de los servicios de almacenamiento en la nube y de respaldo para Microsoft 365 y Google Workspace ofrecen *object lock* o retención inmutable.
- **Prueba la restauración.** La solicitud pregunta *cuándo* restauraste por última vez, no si tienes respaldos. Anota la fecha y cuánto tardó.

## 5. El hueco que más duele a los contratistas latinos: la ingeniería social

La NAIC lo dice sin rodeos: las pólizas cibernéticas estándar **con frecuencia excluyen, o limitan mucho, las pérdidas por ingeniería social y fraude por transferencia**, y suelen depender de una póliza de **crimen** aparte. Para un subcontratista que cobra por wire o ACH ese es el riesgo central: el compromiso de correo empresarial (BEC) costó **$3,050 millones de USD** a víctimas en EE. UU. en 2025, en 24,768 denuncias (FBI IC3).

Pregúntale a tu agente, por escrito: *«¿Esta póliza cubre ingeniería social / fraude por transferencia? ¿Cuál es el sublímite? ¿Exige verificación por devolución de llamada?»*. Muchas pólizas pagan solo si seguiste un procedimiento de devolución de llamada; ponlo en papel con nuestra [guía de fraude ACH y wire](/blog/fraude-ach-wire-facturas-falsas-contratistas).

## 6. Plan de 7 días antes de tu renovación

1. **Día 1:** Activa MFA en cada buzón y cada administrador; guarda captura de la política.
2. **Día 2:** Publica DMARC en `p=none` con reportes y deja un solo registro SPF ([verificador gratuito](/verificador-dmarc-spf)).
3. **Día 3:** Confirma que el EDR está en cada laptop y servidor; cuenta los equipos.
4. **Día 4:** Haz inmutable o fuera de línea al menos un respaldo y prueba una restauración.
5. **Día 5:** Cierra el RDP a internet; revisa el módem y cualquier máquina en la nube.
6. **Día 6:** Escribe el plan de incidentes de una hoja: línea de la aseguradora, línea de fraude del banco, ic3.gov.
7. **Día 7:** Sube DMARC a `p=quarantine`, vuelve a correr el [diagnóstico](/#diagnostico) y llena la solicitud con evidencia.

Si preparas impuestos o llevas contabilidad, los mismos controles cubren casi todo tu **WISP del IRS** y la **FTC Safeguards Rule**: revisa nuestra [guía WISP](/blog/plan-wisp-irs-ftc-safeguards-preparadores-impuestos). Si usas agentes de IA o un asistente de WhatsApp, inclúyelos en el inventario: a quién le escriben y qué llaves tienen ([agentes seguros en AWS](/blog/seguridad-agentes-ia-aws-bedrock-mcp)).

## 7. Método y límites

- **Muestra:** miembros con registro MX y portada activa de los directorios públicos ChamberMaster de FWHCC (TX) y SHCCNJ (NJ), sin gobierno ni educación. No es una muestra aleatoria de todos los negocios hispanos de EE. UU.
- **Qué hicimos:** releímos la medición del mismo día por DNS-over-HTTPS (SPF, DMARC, MX) y una sola petición a cada portada; sin tráfico nuevo, sin rutas ocultas, sin escaneo de puertos.
- **Qué no es:** el escaneo real de una aseguradora (ellas también buscan puertos abiertos, credenciales filtradas y software sin soporte que no probamos). Solo agregados; ningún negocio se nombra.
- **No es asesoría legal ni de seguros.** Omona hace revisiones **solo defensivas** con autorización escrita del dueño del sistema; no hace pruebas de penetración ni vende seguros.

**Fuentes:** NAIC, *Report on the Cybersecurity Insurance Market, 2025 reporting year* (octubre de 2026); Marsh, *Cyber resilience: 12 key controls to strengthen your security*; FBI IC3, *2025 Internet Crime Report*; medición pasiva propia de Omona del 26 de noviembre de 2026.
