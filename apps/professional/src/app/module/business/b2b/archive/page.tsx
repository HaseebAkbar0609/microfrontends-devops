import { B2BArchiveView } from "@/features/b2b/components/B2BArchiveView";
import { DUMMY_ARCHIVE_ITEMS } from "@/features/b2b/constants/archiveMock";

export default function B2BArchivePage() {
  return <B2BArchiveView items={DUMMY_ARCHIVE_ITEMS} />;
}
