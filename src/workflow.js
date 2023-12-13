const {
    promptButtonsArea,
    promptButtonsOptions
} = require('./prompts')

const workflow = async (buttons = []) => {
    return promptButtonsArea()
        .then(async (area) => {
            if (area) {
                const button = await promptButtonsOptions()
                buttons.push({area, ...button})
                return Promise.resolve(true)
            }
            return Promise.resolve(false)
        })
        .then(async (repeat) =>
            repeat ? workflow(buttons) : Promise.resolve(buttons)
        )
}

module.exports = {
    workflow
}
