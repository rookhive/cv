class Translator {
    constructor(settings) {
        if (__DEV__) {
            const requiredProps = ['translations']
            const missedRequiredProps = requiredProps
                .filter(prop => {
                    return settings && (
                        settings[prop] === undefined
                        || settings[prop] === null)
                })

            if (!settings || missedRequiredProps.length) {
                throw new Error(
                    `Some required properties were not passed: `
                    + `${missedRequiredProps
                        .map(prop => `"${prop}"`)
                        .join(', ')}`)
            }

            if (!settings.language) {
                console.warn('Language is set to "en" by default.')
            }
        }

        this.translations = settings.translations
        this.setLanguage(settings.language || 'en')
    }

    get(key) {
        const language = this.language

        if (__DEV__) {
            if (typeof this.translations !== 'object'
                || !this.translations[language]) {
                console.error(
                    `There are no translations for "${language}" language.`)
            }
            const translation = this.translations[language][key]
            if (translation === undefined
                || translation === null) {
                console.error(
                    `There is no translation for key "${key}" in language `
                    + `"${language}".`)
            }
        }

        const translation = this.translations[language][key]
        return translation
    }

    getAllStartingWith(prefix) {
        const translations = this.translations[this.language]
        const result = {}

        for (let key in translations) {
            if (!key.startsWith(prefix))
                continue
            result[key] = translations[key]
        }

        return result
    }

    setLanguage(language) {
        this.language = language
    }

    getLanguage() {
        return this.language
    }
}

export default Translator