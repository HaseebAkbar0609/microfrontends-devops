export type DealDetailStatus = "active" | "pending" | "closed";

export type DealFile = {
  id: string;
  label: string;
  type: "pdf" | "doc" | "other";
};

export type DealImage = {
  id: string;
  label: string;
};

export type B2BDealDetail = {
  id: string;
  refNumber: string;
  title: string;
  status: DealDetailStatus;
  date: string;
  projectNr: string;
  municipality: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    postalCode: string;
    address: string;
    city: string;
  };
  request: {
    projectName: string;
    projectNumber: string;
    projectAddress: string;
    city: string;
    postalCode: string;
    contractForm: string;
    jobType: string;
    addressOptional: string;
  };
  typeSection: {
    title: string;
    category: string;
    subcategory: string;
    description: string;
    startDate: string;
    offerDate: string;
    images: DealImage[];
    extraImagesCount: number;
    documents: DealFile[];
    drawings: DealFile[];
  };
  additionalInfo: string;
};
