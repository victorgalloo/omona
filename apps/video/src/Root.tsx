import { Composition } from "remotion";
import { ChatRespondiendo } from "./compositions/ChatRespondiendo";
import { CrmSeLlenaSolo } from "./compositions/CrmSeLlenaSolo";
import { CitaAgendada } from "./compositions/CitaAgendada";
import { NotaDeVoz } from "./compositions/NotaDeVoz";
import { Handoff } from "./compositions/Handoff";
import { SeguimientoAutomatico } from "./compositions/SeguimientoAutomatico";
import { AntesDespues } from "./compositions/AntesDespues";
import { PipelineReal, InboxReal, TareasReal } from "./compositions/CrmReal";
import type { ThemeName } from "./theme";

const FPS = 30;

/**
 * Cada loop se rinde dos veces, en claro y en oscuro, porque la landing
 * arranca en claro y el usuario puede cambiar de tema (ThemeScript en
 * apps/dashboard/src/app/layout.tsx). Un video no se adapta al tema: hay
 * que tener las dos versiones. El tema se pasa por props y scripts/render-all.mjs
 * hace las dos pasadas.
 */
const defaultProps = { theme: "light" as ThemeName };

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ChatRespondiendo"
        component={ChatRespondiendo}
        durationInFrames={300}
        fps={FPS}
        width={900}
        height={1200}
        defaultProps={defaultProps}
      />
      <Composition
        id="CrmSeLlenaSolo"
        component={CrmSeLlenaSolo}
        durationInFrames={270}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      <Composition
        id="CitaAgendada"
        component={CitaAgendada}
        durationInFrames={260}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      <Composition
        id="NotaDeVoz"
        component={NotaDeVoz}
        durationInFrames={240}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      <Composition
        id="Handoff"
        component={Handoff}
        durationInFrames={210}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      <Composition
        id="SeguimientoAutomatico"
        component={SeguimientoAutomatico}
        durationInFrames={210}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      {/* Nuestro CRM real, en lugar de las capturas de Twenty */}
      <Composition
        id="PipelineReal"
        component={PipelineReal}
        durationInFrames={240}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      <Composition
        id="InboxReal"
        component={InboxReal}
        durationInFrames={240}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      <Composition
        id="TareasReal"
        component={TareasReal}
        durationInFrames={240}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
      <Composition
        id="AntesDespues"
        component={AntesDespues}
        durationInFrames={210}
        fps={FPS}
        width={1200}
        height={900}
        defaultProps={defaultProps}
      />
    </>
  );
};
