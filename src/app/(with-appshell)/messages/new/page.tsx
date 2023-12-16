import {FilteringModule, PrintingModule} from "@/components/messages";
import {GROUPS} from "@/constants/groups";
import {redirect} from "next/navigation";
import {PAGE_LINKS} from "@/constants/page-links";

export default function NewMessagePage(props: { searchParams: { step?: string } }) {
    if (props.searchParams.step === 'filtering') {
        return <FilteringModule groups={GROUPS}/>
    }

    if (props.searchParams.step === 'printing') {
        return <PrintingModule/>
    }

    return redirect(PAGE_LINKS.NEW_MESSAGE_FILTERING)
}