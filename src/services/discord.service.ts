import { client } from "../app";
import Viaje from "../models/viaje.model";
import cron from "node-cron";
import { EmbedBuilder, TextChannel } from "discord.js";

export const discordService = {
  init: async () => {
    let channel: TextChannel;

    client.on("ready", async () => {
      await client.channels
        .fetch(process.env.DISCORD_CHANNEL_ID || "")
        .then((a) => {
          channel = a as TextChannel;
        });
      console.log(`Logged in as ${client?.user?.tag}!`);
    });

    // get all viajes from db
    const viajes = await Viaje.find({})
      .populate("participantes")
      .populate("conceptos")
      .populate("contable")
      .exec();

    // check if theirs any active viaje, active being that the viaje has not ended yet
    const activeViajes = viajes.filter(
      (viaje) => (viaje?.end_date as Date) > new Date() && (viaje?.start_date as Date) < new Date()
    );

    cron.schedule(activeViajes.length > 0 ? "0 0 */12 * * * " : "0 0 22 * * *", async () => {
      // calculate the standing balance, separated by currency, of every user in every active viaje
      const balances = activeViajes.map((viaje) => {
        const participantes = viaje.participantes;
        const conceptosPorDivisa = (viaje.conceptos as any[]).reduce(
          (acc, concepto) => {
            const divisa = concepto.divisa;
            acc[divisa] = acc[divisa] ? [...acc[divisa], concepto] : [concepto];
            return acc;
          },
          {} as { [key: string]: any[] }
        );

        const participantesBalances = participantes.map((participante) => {
          const balances: any[] = [];

          Object.entries(conceptosPorDivisa).forEach(([divisa, conceptos]) => {
            const conceptosPagados = (conceptos as any[]).filter(
              (concepto) =>
                concepto.pagador._id.toString() === participante._id.toString()
            );
            const conceptosParticipados = (conceptos as any[]).filter(
              (concepto) =>
                (concepto.participantes as any[]).some(
                  (participanteConcepto) =>
                    participanteConcepto.usuario._id.toString() ===
                    participante._id.toString()
                )
            );

            const totalPagado = conceptosPagados.reduce(
              (acc, concepto) =>
                acc +
                (concepto.precio *
                  concepto.unidades *
                  concepto.participantes.filter((user: any) => !user.pagado)
                    .length) /
                  concepto.participantes.length,
              0
            );

            const totalParticipado = conceptosParticipados.reduce(
              (acc, concepto) => {
                const total =
                  acc +
                  (concepto.participantes.find(
                    (user: any) =>
                      user.usuario._id.toString() ===
                      participante._id.toString()
                  ).pagado
                    ? 0
                    : (concepto.precio * concepto.unidades) /
                      concepto.participantes.length);
                return total;
              },
              0
            );

            const balance = totalParticipado - totalPagado;
            balances.push({ divisa, balance });
          });
          return { name: participante.name, balances };
        });

        return { viaje: viaje.destino, participantesBalances };
      });

      let fieldsDeudas = [];

      balances.forEach((viaje) => {
        fieldsDeudas = viaje.participantesBalances.map((participante) => {
          return {
            name: participante.name,
            value: participante.balances.reduce((acc, balance) => {
              acc += `${balance.divisa}: ${balance.balance}\n`;
              return acc;
            }, ""),
            inline: true,
          };
        });
        const viajeEmbed = new EmbedBuilder();

        viajeEmbed
          .setTitle(`Deudas de ${viaje.viaje}`)
          .setURL("http://travel.pibardos.club/stats")
          .setDescription(
            "Para más información, visita la web http://travel.pibardos.club"
          )
          .setThumbnail("https://i.imgur.com/lk2wCDS.png")
          .addFields(...fieldsDeudas)
          .setImage("https://i.imgur.com/lyNs02i.png")
          .setTimestamp()
          .setFooter({
            text: "¿Es esto un error? Contacta con el soporte técnico en soporte@pibardos.club",
            iconURL: "https://i.imgur.com/lk2wCDS.png",
          });

        channel.send({ embeds: [viajeEmbed] });
      });
    });

    client.login(process.env.DISCORD_TOKEN);
  },
};
