import {FilteringModule, PrintingModule} from "@/components/messages";
import {GROUPS} from "@/constants/groups";
import {redirect} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";

export default function NewMessagePage(props: { searchParams: { step?: string } }) {
    if (props.searchParams.step === 'filtering') {
        return <FilteringModule groups={GROUPS}/>
    }

    if (props.searchParams.step === 'printing') {
        return <PrintingModule/>
    }

    return redirect(PAGES_LINK.NEW_MESSAGE_FILTERING)
}