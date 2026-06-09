import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
export type FaqCategory =
  | "quote"
  | "find-consultant"
  | "active-projects"
  | "archived-projects"
  | "cost-calculator"
  | "inspiration"
  | "offers"
  | "security-account";


export type FaqItem = {
  question: string;
  answer: string;
  category: FaqCategory;
};

export const FAQ_CATEGORY_OPTIONS = [
  {
    label: localizationConstants.faqCategoryQuoteAndFindTradespeople,
    value: "quote",
  },
  {
    label: localizationConstants.faqCategoryFindConsultant,
    value: "find-consultant",
  },
  {
    label: localizationConstants.faqCategoryActiveProjects,
    value: "active-projects",
  },
  {
    label: localizationConstants.faqCategoryArchivedProjects,
    value: "archived-projects",
  },
  {
    label: localizationConstants.faqCategoryCostCalculator,
    value: "cost-calculator",
  },
  {
    label: localizationConstants.faqCategoryInspiration,
    value: "inspiration",
  },
  {
    label: localizationConstants.faqCategoryOffers,
    value: "offers",
  },
  {
    label: localizationConstants.faqCategorySecurityAccount,
    value: "security-account",
  },
];
export const FAQ_ITEMS: FaqItem[] = [
  {
    question: localizationConstants.faqWhatHappensWhenIAcceptAQuote,
    answer: localizationConstants.faqWhenYouChooseATradespersonProjectMovesToActiveProjects,
    category: "quote",
  },
  {
    question: localizationConstants.faqWhatCanIDoInActiveProjects,
    answer: localizationConstants.faqFollowSchedulesManageBudgetsApproveChanges,
    category: "active-projects",
  },
  {
    question: localizationConstants.faqCanIFollowTheProjectOnMobile,
    answer: localizationConstants.faqTimeFlowHomeMobileAccess,
    category: "active-projects",
  },
  {
    question: localizationConstants.faqWhatIsAChangeOrder,
    answer: localizationConstants.faqAtaStandsForChangesAdditionsAndDeductions,
    category: "active-projects",
  },

  {
    question: localizationConstants.faqWhatAreArchivedProjects,
    answer: localizationConstants.faqCompletedProjectsMovedToArchive,
    category: "archived-projects",
  },
  {
    question: localizationConstants.faqWhyArchiveProjects,
    answer: localizationConstants.faqArchivedInformationUsefulForSalesAndInsurance,
    category: "archived-projects",
  },
  {
    question: localizationConstants.faqHowLongAreProjectsStored,
    answer: localizationConstants.faqProjectStorageGdprConfirmation,
    category: "archived-projects",
  },

  {
    question: localizationConstants.faqWhatIsTheCostCalculator,
    answer: localizationConstants.faqCostCalculatorHelpsEstimateCosts,
    category: "cost-calculator",
  },
  {
    question: localizationConstants.faqWhatProjectsCanIEstimate,
    answer: localizationConstants.faqProjectEstimateExamples,
    category: "cost-calculator",
  },
  {
    question: localizationConstants.faqAreTheCalculationsExact,
    answer: localizationConstants.faqCalculationsAreIndicative,
    category: "cost-calculator",
  },
  {
    question: localizationConstants.faqCanIUseItForBudgeting,
    answer: localizationConstants.faqBudgetPlanningEstimate,
    category: "cost-calculator",
  },

  {
    question: localizationConstants.faqWhatIsInspiration,
    answer: localizationConstants.faqInspirationArticlesGuidesIdeasAndTips,
    category: "inspiration",
  },
  {
    question: localizationConstants.faqDoesInspirationCostAnything,
    answer: localizationConstants.faqInspirationFreeForRegisteredUsers,
    category: "inspiration",
  },
  {
    question: localizationConstants.faqCanIGetIdeasForMyProject,
    answer: localizationConstants.faqInspirationHelpsDiscoverIdeas,
    category: "inspiration",
  },

  {
    question: localizationConstants.faqWhatAreOffers,
    answer: localizationConstants.faqAccessToDiscountsAndOffers,
    category: "offers",
  },
  {
    question: localizationConstants.faqHowDoIUseTheDiscounts,
    answer: localizationConstants.faqDiscountsRedeemedWithCodesOrQr,
    category: "offers",
  },
  {
    question: localizationConstants.faqWhatKindsOfOffersExist,
    answer: localizationConstants.faqOfferExamplesMaterialsToolsInsurance,
    category: "offers",
  },
  {
    question: localizationConstants.faqWillMoreOffersBeAdded,
    answer: localizationConstants.faqContinuouslyAddingNewOffers,
    category: "offers",
  },

  {
    question: localizationConstants.faqIsMyDataSecure,
    answer: localizationConstants.faqSecurityAndPrivacyCorePartsOfTimeFlow,
    category: "security-account",
  },
  {
    question: localizationConstants.faqWhereIsMyInformationStored,
    answer: localizationConstants.faqInformationStoredInSecureDatacenters,
    category: "security-account",
  },
  {
    question: localizationConstants.faqWhatHappensIfICloseMyAccount,
    answer: localizationConstants.faqAccountInformationRetainedSixMonths,
    category: "security-account",
  },
  {
    question: localizationConstants.faqCanIUseTimeFlowInOtherCountries,
    answer: localizationConstants.faqTimeFlowFocusedOnSwedishMarket,
    category: "security-account",
  },
  {
    question: localizationConstants.faqDoINeedToDownloadAnApp,
    answer: localizationConstants.faqTimeFlowWorksInBrowserAndApp,
    category: "security-account",
  },
];
export const QUESTIONS_BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.tools },
  { label: localizationConstants.questions },
];
