export type {
  ModuleRichContent,
  ModuleRichStep,
  ModuleRichCard,
  ModuleRichGroup,
  ModuleRichSection,
  ModuleRichPricing,
  ModulePriceObj,
  ModuleSmartFeature,
} from "./types";

import type { ModuleRichContent } from "./types";

import { avtalContent } from "./avtal";
import { b2bContent } from "./b2b";
import { dataItContent } from "./data-it";
import { ekonomiContent } from "./ekonomi";
import { fakturaContent } from "./faktura";
import { fordonContent } from "./fordon";
import { inkassoContent } from "./inkasso";
import { inkopMottagningContent } from "./inkop-mottagning";
import { inkopContent } from "./inkop";
import { juridikContent } from "./juridik";
import { kalkylContent } from "./kalkyl";
import { kmaContent } from "./kma";
import { ledningsstodContent } from "./ledningsstod";
import { mallarContent } from "./mallar";
import { marknadSaljContent } from "./marknad-salj";
import { maskinContent } from "./maskin";
import { materialContent } from "./material";
import { orderContent } from "./order";
import { personalContent } from "./personal";
import { prognosContent } from "./prognos";
import { projektContent } from "./projekt";
import { projekteringContent } from "./projektering";
import { smartAccessContent } from "./smart-access";

export const moduleContent: Record<string, ModuleRichContent> = {
  "avtal": avtalContent,
  "b2b": b2bContent,
  "data-it": dataItContent,
  "ekonomi": ekonomiContent,
  "faktura": fakturaContent,
  "fordon": fordonContent,
  "inkasso": inkassoContent,
  "inkop-mottagning": inkopMottagningContent,
  "inkop": inkopContent,
  "juridik": juridikContent,
  "kalkyl": kalkylContent,
  "kma": kmaContent,
  "ledningsstod": ledningsstodContent,
  "mallar": mallarContent,
  "marknad-salj": marknadSaljContent,
  "maskin": maskinContent,
  "material": materialContent,
  "order": orderContent,
  "personal": personalContent,
  "prognos": prognosContent,
  "projekt": projektContent,
  "projektering": projekteringContent,
  "smart-access": smartAccessContent,
};
