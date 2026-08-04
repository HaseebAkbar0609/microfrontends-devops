import DynamicModulePage from "../[slug]";
import { findModule } from "@/lib/modules";

const slug = "smart-access";
const found = findModule(slug);

export default function ProfessionalAccessPage() {
  if (!found) {
    throw new Error(`Unable to resolve professional module "${slug}"`);
  }
  return <DynamicModulePage slug={slug} item={found.item} section={found.section} />;
}

export const getStaticProps = async () => ({ props: { hasHeader: false } });
