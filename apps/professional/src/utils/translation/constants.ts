import { sv } from "./sv";

export type HeaderTranslation = {
	home: string;
	companies: string;
	changeCompany: string;
	addAccount: string;
	kallesConstruction: string;
	cleaningCompanyBlossom: string;
	plumbingCompanyQuickPlumber: string;
	print: string;
	exportFiles: string;
	importFiles: string;
	logout: string;
	zoom: string;
	zoomIn: string;
	zoomOut: string;
};

export type AppLauncherTranslation = {
	businessCategory: string;
	financialManagementCategory: string;
	productionCategory: string;
	businessSupportCategory: string;
	offer: string;
	b2b: string;
	calculation: string;
	invoice: string;
	forecast: string;
	personnel: string;
	debtCollection: string;
	law: string;
	order: string;
	project: string;
	purchase: string;
	kma: string;
	design: string;
	machine: string;
	agreement: string;
	templates: string;
	marketingSales: string;
	dataIT: string;
	managementSupport: string;
	vehicle: string;
	access: string;
	economy: string;
};

export interface AuthTranslation {
	addUser: string;
	loginWelcomeTitle: string;
	loginWelcomeSubtitle: string;
	loginTabPassword: string;
	loginTabBankId: string;
	loginEmailOrUsernameLabel: string;
	loginEmailPlaceholder: string;
	loginPasswordLabel: string;
	loginPasswordPlaceholder: string;
	loginForgotPasswordLink: string;
	loginButtonText: string;
	loginSigningIn: string;
	loginCreateAccountQuestion: string;
	loginBankIdComingSoon: string;
	loginBankIdOr: string;
	loginBankIdSameDevice: string;
	bankIdModalTitle: string;
	bankIdModalStep1: string;
	bankIdModalStep2: string;
	bankIdModalStep3: string;
	bankIdModalQrPlaceholder: string;
	bankIdModalUseSameDevice: string;
	bankIdModalClose: string;
	validationLoginEmailRequired: string;
	validationLoginPasswordRequired: string;
	forgotPasswordTitle: string;
	forgotPasswordSubtitle: string;
	forgotPasswordEmailLabel: string;
	forgotPasswordEmailPlaceholder: string;
	forgotPasswordBackToLogin: string;
	forgotPasswordButtonText: string;
	forgotPasswordSending: string;
	validationForgotPasswordEmailRequired: string;
	otpTitle: string;
	otpSubtitle: string;
	otpLabel: string;
	otpPlaceholder: string;
	otpBackToLogin: string;
	otpButtonText: string;
	otpVerifying: string;
	resetPasswordTitle: string;
	resetPasswordSubtitle: string;
	resetPasswordButtonText: string;
	resetPasswordSubmitting: string;
	validationOtpRequired: string;
	validationOtpInvalid: string;
	myCompaniesTitle: string;
	myCompaniesSubtitle: string;
	myCompaniesCreateNew: string;
	myCompaniesLogIn: string;
	registerWelcomeTitle: string;
	registerWelcomeSubtitle: string;
	registerCompanyNameLabel: string;
	registerCompanyNamePlaceholder: string;
	registerCategoryLabel: string;
	registerCategoryPlaceholder: string;
	registerOrganisationNumberLabel: string;
	registerOrganisationNumberPlaceholder: string;
	registerContactFirstNameLabel: string;
	registerContactFirstNamePlaceholder: string;
	registerContactLastNameLabel: string;
	registerContactLastNamePlaceholder: string;
	registerEmailLabel: string;
	registerEmailPlaceholder: string;
	registerPhoneLabel: string;
	registerPhonePlaceholder: string;
	registerPostalCodeLabel: string;
	registerPostalCodePlaceholder: string;
	registerAddressLabel: string;
	registerAddressPlaceholder: string;
	registerCityLabel: string;
	registerCityPlaceholder: string;
	registerCountryLabel: string;
	registerCountryPlaceholder: string;
	registerPasswordLabel: string;
	registerPasswordPlaceholder: string;
	registerConfirmPasswordLabel: string;
	registerConfirmPasswordPlaceholder: string;
	registerTermsLabel: string;
	registerTermsMustAccept: string;
	registerCheckoutButton: string;
	registerSubmitting: string;
	registerChangeRegistrationType: string;
	registerWantToLogin: string;
	validationRegisterCompanyNameRequired: string;
	validationRegisterCategoryRequired: string;
	validationRegisterOrganisationNumberRequired: string;
	validationRegisterContactFirstNameRequired: string;
	validationRegisterContactLastNameRequired: string;
	validationRegisterEmailRequired: string;
	validationRegisterEmailInvalid: string;
	validationRegisterPhoneRequired: string;
	validationRegisterPostalCodeRequired: string;
	validationRegisterAddressRequired: string;
	validationRegisterCityRequired: string;
	validationRegisterCountryRequired: string;
	validationRegisterPasswordRequired: string;
	validationRegisterConfirmPasswordRequired: string;
	validationRegisterTermsMustAccept: string;
	validationRegisterPasswordMismatch: string;
	acceptInvitationTitle: string;
	acceptInvitationSubtitle: string;
	acceptInvitationEmailLabel: string;
	acceptInvitationEmailPlaceholder: string;
	acceptInvitationPasswordLabel: string;
	acceptInvitationPasswordPlaceholder: string;
	acceptInvitationConfirmPasswordLabel: string;
	acceptInvitationConfirmPasswordPlaceholder: string;
	acceptInvitationActivateAccount: string;
	acceptInvitationGoToRegister: string;
	acceptInvitationErrorInvalidToken: string;
	acceptInvitationErrorNoToken: string;
}

export type SidebarTranslation = {
	favorites: string;
	tools: string;
	register: string;
	templatesItem: string;
	myPages: string;
	employment: string;
	companyItem: string;
	timeItem: string;
	itSupport: string;
	profileSettings: string;
	diary: string;
	business: string;
	production: string;
	financialManagement: string;
	businessSupport: string;
	moduleItem: string;
	adminItem: string;
	dashboard: string;
	adminSetting: string;
	adminIntegration: string;
	adminSubscription: string;
	adminLicence: string;
	adminUser: string;
	adminEconomy: string;
	quote: string;
	accountPlan: string;
	wageTypes: string;
	priceList: string;
	customerRegister: string;
	supplierRegister: string;
	quoteList: string;
	projectList: string;
	orderList: string;
	costCentre: string;
	materialStorage: string;
	customerRegisterList: string;
	customerRegisterCustomerNo: string;
	customerRegisterCustomer: string;
	customerRegisterRegNo: string;
	customerRegisterAddress: string;
	customerRegisterPostcode: string;
	customerRegisterCity: string;
	customerRegisterCountry: string;
	customerRegisterPhone: string;
	customerRegisterEmail: string;
	customerRegisterStatus: string;
	customerRegisterSearch: string;
	customerRegisterFilter: string;
	customerRegisterImportCustomer: string;
	customerRegisterRegisterNew: string;
};

export type MyPagesTranslation = {
	profileSettings: string;
	myPages: string;
	myPagesEmployment: string;
	myPagesCompany: string;
	myPagesTime: string;
	myPagesItSupport: string;
	myPagesProfileSettings: string;
	backToMainMenu: string;
	contactInformation: string;
	bank: string;
	bankTab: string;
	bankDetails: string;
	taxTable: string;
	bankAccountNumber: string;
	swish: string;
	swift: string;
	security: string;
	companyInformation: string;
	logotype: string;
	companyLogotype: string;
	uploadYourLogotype: string;
	logo: string;
	logotypeFileTypesAllowed: string;
	logotypeUnsupportedFileType: string;
	removeLogo: string;
	presentation: string;
	referenceList: string;
	reviews: string;
	leadManagement: string;
	comingSoon: string;
	comingSoonMessage: string;

	firstName: string;
	lastName: string;
	personalId: string;
	email: string;
	phone: string;
	website: string;

	streetAddress: string;
	address: string;
	city: string;
	postalCode: string;
	company: string;
	alternativeContacts: string;
	companyName: string;
	orgNumber: string;
	vatNumber: string;
	sniCode: string;
	postalAddress: string;
	visitingAddress: string;
	deliveryAddress: string;
	outgoingEmail: string;
	supplierInvoiceEmail: string;
	smsNumber: string;

	contactDetails: string;
	nextOfKin: string;
	nextOfKinName: string;
	nextOfKinPhone: string;
	nextOfKinEmail: string;
	addRelatives: string;

	workDetails: string;
	employmentNumber: string;
	position: string;
	department: string;

	settings: string;
	profilePicture: string;
	upload: string;
	noFileChosen: string;
	fileTypesAllowed: string;
	unsupportedFileType: string;

	languagePreference: string;
	swedish: string;
	english: string;
	other: string;
	french: string;
	german: string;
	spanish: string;

	relation: string;
	parent: string;
	spouse: string;
	child: string;

	notifications: string;
	sms: string;
	webPush: string;

	save: string;
	cancel: string;
	selectField: string;
	profileUpdated: string;
	profileUpdateFailed: string;
	loadCountriesFailed: string;
	invalidCurrentPassword: string;

	bankName: string;
	accountNumber: string;
	iban: string;
	bic: string;
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
};

export type ManagePlansTranslation = {
	managePlansChoosePlanButton: string;
	managePlansViewCartButton: string;
	managePlansCartAddedNotification: string;
	managePlansBaseFee: string;
	managePlansLicense: string;
	managePlansTotal: string;
	managePlansPrice: string;
	managePlansCurrencySuffix: string;
	managePlansPerUserSuffix: string;
	managePlansPerMonthSuffix: string;
	managePlansSelectPaymentOption: string;
	managePlansPaymentDiscountText: string;
	managePlansPaymentOptionMonth: string;
	managePlansPaymentOptionQuarter: string;
	managePlansPaymentOptionYear: string;
};

export type ManageCartTranslation = {
	manageCartTitle: string;
	manageCartLicensesTitle: string;
	manageCartLicensesTotalLabel: string;
	manageCartEmptyMessage: string;
	manageCartRemoveItem: string;
	manageCartDiscountTitle: string;
	manageCartDiscountPlaceholder: string;
	manageCartSubtotalLabel: string;
	manageCartTotalLabel: string;
	manageCartCheckoutButton: string;
	manageCartConfirmTitle: string;
	manageCartSubscriptionPlanTitle: string;
	manageCartSubscriptionMembershipLabel: string;
	manageCartSubscriptionBillingOptionLabel: string;
	manageCartSubscriptionPriceLabel: string;
	manageCartSubscriptionFrequencyLabel: string;
	manageCartContactInfoTitle: string;
	manageCartContactCompanyNameLabel: string;
	manageCartContactPersonLabel: string;
	manageCartContactEmailLabel: string;
	manageCartContactOrgNumberLabel: string;
	manageCartOrderOverviewTitle: string;
	manageCartTaxLabel: string;
	manageCartTermsText: string;
	manageCartBackToCart: string;
	manageCartBackToPlans: string;
	manageCartContactInformationTitle: string;
	manageCartCompanyNameLabel: string;
	manageCartEmailLabel: string;
	manageCartOrganisationNumberLabel: string;

	manageCartCheckoutPaymentDetailsTitle: string;
	manageCartCheckoutContactInformationTitle: string;
	manageCartCheckoutContactInformationDescription: string;
	manageCartCheckoutEmailPlaceholder: string;

	manageCartCheckoutBillingAddressTitle: string;
	manageCartCheckoutBillingAddressDescription: string;
	manageCartCheckoutFirstNamePlaceholder: string;
	manageCartCheckoutLastNamePlaceholder: string;
	manageCartCheckoutAddressPlaceholder: string;
	manageCartCheckoutAddress2Placeholder: string;
	manageCartCheckoutCountryPlaceholder: string;
	manageCartCheckoutCityPlaceholder: string;
	manageCartCheckoutPostalCodePlaceholder: string;
	manageCartCheckoutPhonePlaceholder: string;

	manageCartCheckoutPaymentOptionsTitle: string;
	manageCartCheckoutCardSectionTitle: string;
	manageCartCheckoutSecurePaymentText: string;
	manageCartCheckoutCardNumberPlaceholder: string;
	manageCartCheckoutCardExpiryPlaceholder: string;
	manageCartCheckoutCardCvcPlaceholder: string;
	manageCartCheckoutAddNoteLabel: string;

	manageCartCheckoutOrderSummaryTitle: string;
	manageCartCheckoutMembershipTitle: string;
	manageCartCheckoutDiscountCodeTitle: string;
	manageCartCheckoutDiscountCodePlaceholder: string;
	manageCartCheckoutPayButton: string;
	manageCartCheckoutAddOrderButton: string;

	manageCartCheckoutSavedCardsTitle: string;
	manageCartCheckoutAddNewCardButton: string;
	manageCartCheckoutNoSavedCardsText: string;
	manageCartCheckoutLoadingSavedCardsText: string;
	manageCartCheckoutAddCardButton: string;
	manageCartCheckoutAddingCardButton: string;

	manageCartCheckoutValidationEmailRequired: string;
	manageCartCheckoutValidationEmailInvalid: string;
	manageCartCheckoutValidationFirstNameRequired: string;
	manageCartCheckoutValidationLastNameRequired: string;
	manageCartCheckoutValidationAddressRequired: string;
	manageCartCheckoutValidationCountryRequired: string;
	manageCartCheckoutValidationCityRequired: string;
	manageCartCheckoutValidationPostalCodeRequired: string;
};

export type DashboardTranslation = {
	activeOrders: string;
	itemsLabel: string;
	projectsLabel: string;
	activeProjects: string;
	completedChecks: string;
	activeLabel: string;
	availableLabel: string;
	numberOfBids: string;
	totalLabel: string;
	kronorLabel: string;
	numberLabel: string;
	availableProjectsTitle: string;
	availableProjectsDescription: string;
	modulesTitle: string;
	addMenuButton: string;
	emptyPageLabel: string;
	imageLabel: string;
	newsLabel: string;
	turnoverLabel: string;
	ordersLabel: string;
	ongoingQuotesLabel: string;
	biddersTitle: string;
	currentQuotesTitle: string;
	turnover90DaysTitle: string;
	personnel: string;
	placeHere: string;
	quotes: string;
	replaceWidgetTitle: string;
	replaceWidgetDescription: string;
	replaceWidgetUndone: string;
	confirmSave: string;
	confirmClose: string;
	removeWidgetTitle: string;
	removeWidgetDescription: string;
	confirmRemove: string;
};

export type AdminPageTranslation = {
	companyGear: string;
	companyPostNo: string;
	companyPlace: string;
};

export type OfferTranslation = {
	openQuotes: string;
	quickActions: string;
	kpiStatus: string;
	ongoingQuotes: string;
	deadlinesReminders: string;
	quoteFlowPipeline: string;
	quickStatistics: string;
	quoteDashboard: string;
	quoteList: string;
	archive: string;
	goTo: string;
	quoteNo: string;
	activeQuotes: string;
	sentQuotes: string;
	accepted: string;
	inquiries: string;
	expiredQuotes: string;
	renegotiation: string;
	completionRequired: string;
	awaitingResponse: string;
	createContract: string;
	quoteDraftReady: string;
	priorityHigh: string;
	finalInspection: string;
	productionStart: string;
	activeProjects: string;
	activeOrders: string;
	completedChecks: string;
	guaranteedPointsOpen: string;
	jobsInPlanningPhase: string;
	awaitingCustomerResponse: string;
	number: string;
	offertSent: string;
	offertAwaitingResponse: string;
	rearrange: string;
	throwAway: string;
	offerDashboard: string;
	widgetPanelOpenClosed: string;
	// Offer - List
	offerList: string;
	job: string;
	projectName: string;
	date: string;
	type: string;
	request: string;
	municipality: string;
	category: string;
	actions: string;
	viewProject: string;
	takeJob: string;
	noQuotesFound: string;
	// Offer - Detail
	offerDetailPostedLabel: string;
	offerDetailExpressJobBadge: string;
	offerDetailMarkAsFavourite: string;
	offerDetailTakeJob: string;
	offerDetailDescriptionTitle: string;
	offerDetailDocumentsAndImagesTitle: string;
	offerDetailImagesTitle: string;
	offerDetailDocumentTitle: string;
	offerDetailDrawingTitle: string;
	offerDetailPostedDateLabel: string;

	// Business offer modal
	businessOfferModalTitle: string;
	businessOfferModalSubtitle: string;
	businessOfferModalBullet1: string;
	businessOfferModalBullet2: string;
	businessOfferModalBullet3: string;
	businessOfferModalBullet4: string;
	businessOfferModalBullet5: string;
	businessOfferModalBullet6: string;
	businessOfferModalCheckbox: string;
	businessOfferModalCancel: string;
	businessOfferModalConfirm: string;

	// Business express modal
	businessExpressModalTitle: string;
	businessExpressModalSubtitleB2C: string;
	businessExpressModalSubtitleB2B: string;
	businessExpressModalBullet1: string;
	businessExpressModalBullet2: string;
	businessExpressModalBullet3: string;
	businessExpressModalBullet4: string;
	businessExpressModalBullet5: string;
	businessExpressModalBullet6: string;
	businessExpressModalCheckbox: string;
	businessExpressModalCancel: string;
	businessExpressModalConfirm: string;

	// Business rent modal
	businessRentModalTitle: string;
	businessRentModalSubtitle: string;
	businessRentModalBullet1: string;
	businessRentModalBullet2: string;
	businessRentModalBullet3: string;
	businessRentModalBullet4: string;
	businessRentModalBullet5: string;
	businessRentModalBullet6: string;
	businessRentModalCheckbox: string;
	businessRentModalCancel: string;
	businessRentModalConfirm: string;

	// Offer confirmation modal
	offerConfirmationModalTitle: string;
	offerConfirmationModalCheckbox: string;
	offerConfirmationModalCancel: string;
	offerConfirmationModalConfirm: string;

	// Offer - Send page
	offerSendCustomerDetails: string;
	offerSendDescription: string;
	offerSendDocumentsAndImages: string;
	offerSendConfirmationTitle: string;
	offerSendPreliminaryBudgetLabel: string;
	offerSendOfferDateLabel: string;
	offerSendCancel: string;
	offerSendSave: string;
	offerSendCreateOffer: string;
	offerSendCreateCalculation: string;
};

export type RegisterTranslation = {
	invoiceDashboard: string;
	invoiceOverview: string;
	contractInvoicing: string;
	registerDropdownLabel: string;
	customerListTab: string;
	importCustomer: string;
	registerNew: string;
	customerNoHeader: string;
	customerHeader: string;
	orgNoHeader: string;
	addressHeader: string;
	postNrHeader: string;
	ortHeader: string;
	landHeader: string;
	phoneHeader: string;
	mailHeader: string;
	statusHeader: string;
	activeStatus: string;
	inactiveStatus: string;
	allStatus: string;
	rowsPerPageLabel: string;
	pageLabel: string;
	ofLabel: string;
	pageOfLabel: string;
	customerOption: string;
	supplierOption: string;
	supplierListTab: string;
	importSupplier: string;
	supplierNoHeader: string;
	supplierHeader: string;
	reportsItem: string;
	protocolsItem: string;
	documentCenterItem: string;
	statisticsItem: string;
	archiveItem: string;
	viewLabel: string;
	editLabel: string;
	deleteLabel: string;
};

export type CommonTranslation = {
	search: string;
	filter: string;
	createNewButtonText: string;
};

export type Translation = HeaderTranslation &
	AppLauncherTranslation &
	SidebarTranslation &
	AuthTranslation &
	ManagePlansTranslation &
	ManageCartTranslation &
	DashboardTranslation &
	AdminPageTranslation &
	MyPagesTranslation &
	OfferTranslation &
	RegisterTranslation &
	CommonTranslation;

export type TranslationKeys = keyof Translation;

const localizationConstants = {} as Record<TranslationKeys, TranslationKeys>;

for (const key in sv) {
	localizationConstants[key as TranslationKeys] = key as TranslationKeys;
}

export default localizationConstants;
