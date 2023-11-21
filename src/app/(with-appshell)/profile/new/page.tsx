import {Container} from "@mantine/core";
import {NewProfileForm} from "@/components/newProfileForm";
import {FormLayout} from "@/layouts";

function NewProfilePage() {
    return (
            <Container p={'xl'}>
                <FormLayout>
                    <NewProfileForm/>
                </FormLayout>
            </Container>
    );
}

export default NewProfilePage;