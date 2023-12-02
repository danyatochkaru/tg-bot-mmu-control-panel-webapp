import {FilteringModule} from "@/components";
import {GROUPS} from "@/constants/groups";
import {redirect} from "next/navigation";
import {PAGES_LINK} from "@/constants/PAGES_LINK";
import {PrintingModule} from "@/components/printinig";

export default function NewMessagePage(props: { searchParams: { step?: string } }) {
    if (props.searchParams.step === 'filtering') {
        return <FilteringModule groups={GROUPS}/>
    }

    if (props.searchParams.step === 'printing') {
        return <PrintingModule/>
    }

    return redirect(PAGES_LINK.NEW_NOTIFY)
}