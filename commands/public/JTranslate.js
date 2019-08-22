module.exports = Cmds.addCommand({
    cmds: [';translatej '],

    requires: {
        guild: true,
        loud: false,
    },

    desc: 'Translate a Japanese word/sentence into English, allowing for Romaji',

    args: '([word] | [sentence])',

    example: 'Sayonara!',

    // export GOOGLE_APPLICATION_CREDENTIALS="/home/einsteink/VaebVPS-4cce7d4f015f.json"

    func: async (cmd, args, msgObj, speaker, channel, guild) => {
        const projectId = 'vaebvps';
        const location = 'global';

        const useText = index.Hepburn.toHiragana(index.Hepburn.cleanRomaji(args));

        const request = {
            parent: index.TranslateClient.locationPath(projectId, location), // projects/vaebvps/locations/global
            contents: [useText],
            mimeType: 'text/plain', // mime types: text/plain, text/html
            targetLanguageCode: 'en-US',
        };

        const [response] = await index.TranslateClient.translateText(request);

        for (const translation of response.translations) {
            const embFields = [
                { name: '[ja] Original', value: `${translation.originalText || args} (${useText})`, inline: false },
                { name: '[en] Translation', value: translation.translatedText, inline: false },
            ];

            Util.sendEmbed(channel, 'Translated', null, Util.makeEmbedFooter(speaker), null, colGreen, embFields);
        }
    },
});
