import LoadingNewMessage from "@/app/(with-appshell)/messages/new/loading";
import {Suspense} from "react";
import {FilteringModule, PrintingModule} from "@/components/messages";
import {GROUPS} from "@/constants/groups";

export default async function NewMessagePage(props: { searchParams: { step?: string } }) {
    switch (props.searchParams.step) {
        case 'printing': {
            return <PrintingModule/>
        }
        case 'filtering':
        default: {
            return <Suspense fallback={<LoadingNewMessage/>}>
                <FilteringModule groups={GROUPS}/>
            </Suspense>
        }
    }
}