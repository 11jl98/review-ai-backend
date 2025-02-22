export const TYPES = {
    Controllers:{
        webHooks: Symbol.for("WebHooksController"),
    },
    Services:{
        GitHubService: Symbol.for("GitHubService"),
        OpenAIService: Symbol.for("OpenAIService"),
    },
}