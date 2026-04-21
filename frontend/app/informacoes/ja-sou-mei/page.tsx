import { InfoPage } from "@/features/public/info-page";
import { INFO_PAGES } from "@/lib/constants/domain";

export default function JaSouMeiPage() {
  return <InfoPage content={INFO_PAGES["ja-sou-mei"]} />;
}
