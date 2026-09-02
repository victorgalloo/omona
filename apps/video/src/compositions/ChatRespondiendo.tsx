import { Interactive } from "remotion";
import { Frame, LoopBody } from "../ui/Frame";
import { Bubble, MonoLabel, Typing } from "../ui/Chat";
import type { LoopProps } from "../theme";

/**
 * El loop del hero: un cliente pregunta a las 11:40 de la noche y el agente
 * cotiza, califica y avanza la venta. El copy es el mismo de t.hero.chat,
 * para que el video y la página cuenten exactamente la misma historia.
 */
export const ChatRespondiendo: React.FC<LoopProps> = ({ theme }) => {
  return (
    <Frame theme={theme} title="whatsapp — ferretería industrial">
      <LoopBody>
        <Interactive.Div name="Hilo" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <MonoLabel theme={theme} at={4}>
            lunes 11:40 p.m. · nadie en la tienda
          </MonoLabel>

          <Bubble
            theme={theme}
            at={14}
            turn={{ role: "cliente", text: "¿Tienen compresores de 5 HP? Los necesito para el jueves" }}
          />

          <Typing theme={theme} at={44} until={72} />

          <Bubble
            theme={theme}
            at={72}
            typeOver={62}
            turn={{
              role: "agente",
              text: "Sí, el de 5 HP trifásico queda en $18,400 + IVA con entrega en 48 h. ¿Es para uso continuo o intermitente?",
            }}
          />

          <Bubble theme={theme} at={158} turn={{ role: "cliente", text: "Continuo, es para un taller" }} />

          <Typing theme={theme} at={186} until={210} />

          <Bubble
            theme={theme}
            at={210}
            typeOver={38}
            turn={{
              role: "agente",
              text: "Entonces te conviene el de tanque de 300 L. Te preparo la cotización. ¿A qué razón social la emito?",
            }}
          />
        </Interactive.Div>
      </LoopBody>
    </Frame>
  );
};
