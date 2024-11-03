import LoadingNewMessage from "@/app/(with-appshell)/messages/new/loading";
import {Suspense} from "react";
import {GROUPS} from "@/constants/groups";
import dynamic from "next/dynamic";

const PrintingModule = dynamic(() => import("@/components/messages/printing/PrintingModule"), {ssr: false})
const FilteringModule = dynamic(() => import("@/components/messages/filtering/FilteringModule"), {ssr: false})

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