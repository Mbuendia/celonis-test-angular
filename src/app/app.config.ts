import { ApplicationConfig, provideClientHydration, withEventReplay, withIncrementalHydration } from "@angular/platform-browser";

export const appConfig: ApplicationConfig = {
    providers: [
        // [...]
        provideClientHydration(withEventReplay(), withIncrementalHydration()),
    ],
};